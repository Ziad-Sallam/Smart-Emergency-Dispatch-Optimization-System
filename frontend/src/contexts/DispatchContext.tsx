import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Incident, Vehicle, Assignment, Notification } from '@/types';
import { localStorageService } from '@/services/localStorage';
import { generateRandomIncident } from '@/services/mockData';

interface DispatchContextType {
  incidents: Incident[];
  vehicles: Vehicle[];
  assignments: Assignment[];
  notifications: Notification[];
  assignVehicleToIncident: (incidentId: string, vehicleId: string) => void;
  resolveIncident: (incidentId: string) => void;
  updateVehicleLocation: (vehicleId: string, lat: number, lng: number) => void;
  markNotificationAsRead: (notificationId: string) => void;
  unreadNotificationsCount: number;
}

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export function DispatchProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      simulateRealTimeUpdates();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setIncidents(localStorageService.getIncidents());
    setVehicles(localStorageService.getVehicles());
    setAssignments(localStorageService.getAssignments());
    setNotifications(localStorageService.getNotifications());
  };

  const simulateRealTimeUpdates = () => {
    if (Math.random() > 0.7) {
      const newIncident = generateRandomIncident();
      localStorageService.addIncident(newIncident);
      setIncidents(localStorageService.getIncidents());

      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'new_incident',
        message: `New ${newIncident.severity} ${newIncident.type} incident reported at ${newIncident.location.address}`,
        timestamp: new Date().toISOString(),
        read: false,
        incident_id: newIncident.id,
      };
      localStorageService.addNotification(notification);
      setNotifications(localStorageService.getNotifications());
    }

    const currentVehicles = localStorageService.getVehicles();
    currentVehicles.forEach((vehicle) => {
      if (vehicle.status === 'on_route') {
        const newLat = vehicle.current_location.lat + (Math.random() - 0.5) * 0.001;
        const newLng = vehicle.current_location.lng + (Math.random() - 0.5) * 0.001;
        localStorageService.updateVehicle(vehicle.id, {
          current_location: { lat: newLat, lng: newLng },
        });
      }
    });
    setVehicles(localStorageService.getVehicles());
  };

  const assignVehicleToIncident = (incidentId: string, vehicleId: string) => {
    const incident = incidents.find((i) => i.id === incidentId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (!incident || !vehicle) return;

    if (vehicle.status !== 'available') {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: 'system_alert',
        message: `Vehicle ${vehicle.unit_number} is not available for assignment`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      localStorageService.addNotification(notification);
      setNotifications(localStorageService.getNotifications());
      return;
    }

    localStorageService.updateIncident(incidentId, {
      status: 'assigned',
      assigned_vehicle_id: vehicleId,
    });

    localStorageService.updateVehicle(vehicleId, {
      status: 'on_route',
      assigned_incident_id: incidentId,
    });

    const assignment: Assignment = {
      id: `assign-${Date.now()}`,
      incident_id: incidentId,
      vehicle_id: vehicleId,
      assigned_at: new Date().toISOString(),
    };
    localStorageService.addAssignment(assignment);

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'status_change',
      message: `Vehicle ${vehicle.unit_number} assigned to incident at ${incident.location.address}`,
      timestamp: new Date().toISOString(),
      read: false,
      incident_id: incidentId,
    };
    localStorageService.addNotification(notification);

    loadData();
  };

  const resolveIncident = (incidentId: string) => {
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident) return;

    localStorageService.updateIncident(incidentId, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });

    if (incident.assigned_vehicle_id) {
      localStorageService.updateVehicle(incident.assigned_vehicle_id, {
        status: 'available',
        assigned_incident_id: undefined,
      });

      const assignment = assignments.find(
        (a) => a.incident_id === incidentId && !a.completed_at
      );
      if (assignment) {
        const responseTime = Math.floor(
          (new Date().getTime() - new Date(assignment.assigned_at).getTime()) / 60000
        );
        localStorageService.updateAssignment(assignment.id, {
          completed_at: new Date().toISOString(),
          response_time: responseTime,
        });
      }
    }

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'status_change',
      message: `Incident at ${incident.location.address} has been resolved`,
      timestamp: new Date().toISOString(),
      read: false,
      incident_id: incidentId,
    };
    localStorageService.addNotification(notification);

    loadData();
  };

  const updateVehicleLocation = (vehicleId: string, lat: number, lng: number) => {
    localStorageService.updateVehicle(vehicleId, {
      current_location: { lat, lng },
    });
    setVehicles(localStorageService.getVehicles());
  };

  const markNotificationAsRead = (notificationId: string) => {
    localStorageService.markNotificationAsRead(notificationId);
    setNotifications(localStorageService.getNotifications());
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <DispatchContext.Provider
      value={{
        incidents,
        vehicles,
        assignments,
        notifications,
        assignVehicleToIncident,
        resolveIncident,
        updateVehicleLocation,
        markNotificationAsRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a DispatchProvider');
  }
  return context;
}
