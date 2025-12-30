import { createContext, useContext, useState, useEffect } from 'react';
import Notification from './Notification.jsx';

const NotificationContext = createContext();

export function useNotification() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within NotificationProvider');
	}
	return context;
}

export function NotificationProvider({ children }) {
	const [notification, setNotification] = useState({
		open: false,
		message: '',
		severity: 'success',
		duration: 3000,
		timestamp: null
	});

	// Persistent Notifications State
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);

	// WebSocket for Notifications
	useEffect(() => {
		const token = localStorage.getItem("access_token");
		// Use a specific path or query param if needed, or share the same endpoint
		const wsUrl = `ws://127.0.0.1:8000/ws/chat/?token=${token}`;
		const ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			console.log("Notification WS Connected");
			// Fetch history based on role
			const role = localStorage.getItem("user_role");
			if (role === 'ADMIN' || role === 'DISPATCHER') {
				ws.send(JSON.stringify({ action: "action_list_admin_notifications" }));
			} else {
				ws.send(JSON.stringify({ action: "action_list_user_notifications" }));
			}
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.action === "new_notification") {
					const newNotif = {
						id: Date.now(),
						title: data.title || '',
						body: data.body || '',
						time: data.created_at || data.time || new Date().toISOString(),
						read: false
					};
					setNotifications(prev => [newNotif, ...prev]);
					setUnreadCount(prev => prev + 1);

					// Also show a transient snackbar
					showInfo(data.title);
				} else if (data.action === "vehicle_assignment_updated") {
					const newNotif = {
						id: Date.now(),
						title: "Vehicle Assignment Update",
						body: `Responder ${data.user.name} assigned to Vehicle #${data.vehicle.vehicle_id}`,
						time: new Date().toISOString(),
						read: false
					};
					setNotifications(prev => [newNotif, ...prev]);
					setUnreadCount(prev => prev + 1);
					showInfo("Vehicle Assigned");
				} else if (data.action === "you_are_assigned") {
					const newNotif = {
						id: Date.now(),
						title: "New Assignment",
						body: `You have been assigned to Vehicle #${data.vehicle.vehicle_id}`,
						time: new Date().toISOString(),
						read: false
					};
					setNotifications(prev => [newNotif, ...prev]);
					setUnreadCount(prev => prev + 1);
					showSuccess("You have been assigned to a vehicle!");
				} else if (data.action === "incident_resolved") {
					const newNotif = {
						id: Date.now(),
						title: "Incident Resolved",
						body: `Incident #${data.incident_id} has been resolved.`,
						time: new Date().toISOString(),
						read: false
					};
					setNotifications(prev => [newNotif, ...prev]);
					setUnreadCount(prev => prev + 1);
					showSuccess(`Incident #${data.incident_id} Resolved`);
				} else if (data.action === "list_admin_notifications_response") {
					if (data.notifications) {
						const history = data.notifications.map(n => ({
							id: n.admin_notification_id,
							title: n.title,
							body: n.body,
							time: n.created_at,
							read: true // Mark history as read to avoid badge clutter
						}));
						setNotifications(prev => {
							// Merge and avoid duplicates by ID
							const currentIds = new Set(prev.map(i => i.id));
							const uniqueHistory = history.filter(h => !currentIds.has(h.id));
							return [...uniqueHistory, ...prev];
						});
					}
				} else if (data.action === "list_user_notifications_response") {
					if (data.notifications) {
						const history = data.notifications.map(n => ({
							id: n.user_notification_id,
							title: n.title,
							body: `Incident #${n.incident_id}`,
							time: n.created_at,
							read: n.status === 'READ'
						}));
						setNotifications(prev => {
							const currentIds = new Set(prev.map(i => i.id));
							const uniqueHistory = history.filter(h => !currentIds.has(h.id));
							return [...uniqueHistory, ...prev];
						});
						// Calculate unread
						const unread = history.filter(n => !n.read).length;
						setUnreadCount(prev => prev + unread);
					}
				}
			} catch (err) {
				console.error("Error parsing notification WS message", err);
			}
		};

		ws.onclose = () => {
			console.log("Notification WS Disconnected");
		};

		return () => {
			ws.close();
		};
	}, []);

	function showNotification(message, severity = 'success', duration = 3000) {
		setNotification({
			open: true,
			message,
			severity,
			duration,
			timestamp: Date.now()
		});
	}

	function showSuccess(message, duration = 3000) {
		showNotification(message, 'success', duration);
	}

	function showError(message, duration = 3000) {
		showNotification(message, 'error', duration);
	}

	function showWarning(message, duration = 3000) {
		showNotification(message, 'warning', duration);
	}

	function showInfo(message, duration = 3000) {
		showNotification(message, 'info', duration);
	}

	function hideNotification() {
		setNotification(prev => ({ ...prev, open: false }));
	}

	function markAsRead() {
		setUnreadCount(0);
		setNotifications(prev => prev.map(n => ({ ...n, read: true })));
	}

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
				showSuccess,
				showError,
				showWarning,
				showInfo,
				hideNotification,
				notifications,
				unreadCount,
				markAsRead
			}}
		>
			{children}
			<Notification
				message={notification.message}
				severity={notification.severity}
				duration={notification.duration}
				open={notification.open}
				onClose={hideNotification}
				timestamp={notification.timestamp}
			/>
		</NotificationContext.Provider>
	);
}