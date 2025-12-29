import React, { useState, useEffect, useRef } from 'react';
import EmergencyMap from '../../components/map/EmergencyMap';
import './ResponderPage.css';
import { useNotification } from '../../components/Notificatoions/NotificationContext';

const ResponderPage = () => {
    const { showSuccess, showError, showInfo } = useNotification();

    // Responder State - ideally fetched from backend or assigned via WS
    const [responder, setResponder] = useState({
        name: "Waiting for assignment...",
        vehicleId: null,
        type: "UNKNOWN",
        status: "UNKNOWN"
    });

    // States: IDLE, INCOMING, ACTIVE
    const [status, setStatus] = useState("IDLE");
    const [incident, setIncident] = useState(null);

    // WebSocket Reference
    const ws = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            showError("No access token found. Please login.");
            return;
        }

        const wsUrl = `ws://127.0.0.1:8000/ws/chat/?token=${token}`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("Responder WS Connected");
            showInfo("Connected to Dispatch System");
            // Optionally request current status? 
            // ws.current.send(JSON.stringify({ action: "action_get_my_status" })); 
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WS Message:", data);

                switch (data.action) {
                    case "you_are_assigned":
                        // Sent when admin assigns responder to a vehicle
                        if (data.vehicle) {
                            setResponder({
                                name: data.responder ? data.responder.name : "Responder",
                                vehicleId: data.vehicle.vehicle_id,
                                type: data.vehicle.vehicle_type,
                                status: data.vehicle.status
                            });
                            showSuccess(`Assigned to vehicle ${data.vehicle.vehicle_id}`);
                        }
                        break;

                    case "new_incident":
                    case "incident_updated":
                        // Check if this incident is assigned to MY vehicle
                        if (responder.vehicleId && data.vehicle_ids && data.vehicle_ids.includes(responder.vehicleId)) {
                            // If I'm already active on this incident, just update details
                            if (incident && incident.incident_id === data.incident_id) {
                                setIncident(data);
                                // If status changed?
                            } else if (!incident || incident.incident_id !== data.incident_id) {
                                // New assignment for me
                                setIncident(data);
                                setStatus("INCOMING");
                                // If already accepted/on route, status might need to be checked from data
                                // But 'incident_updated' usually implies dispatch logic.
                            }
                        }
                        break;

                    case "incident_resolved":
                        if (incident && incident.incident_id === data.incident_id) {
                            setIncident(null);
                            setStatus("IDLE");
                            showInfo("Incident Resolved");
                        }
                        break;

                    case "pending_to_on_route_response":
                        if (data.data && data.data.status === "ON_ROUTE") {
                            setStatus("ACTIVE");
                            setResponder(prev => ({ ...prev, status: "ON_ROUTE" }));
                            showSuccess("Status updated: En Route");
                        }
                        break;

                    case "resolve_incident_response":
                        setIncident(null);
                        setStatus("IDLE");
                        setResponder(prev => ({ ...prev, status: "AVAILABLE" }));
                        showSuccess("Mission Completed");
                        break;

                    case "error":
                        showError(data.message);
                        break;

                    default:
                        break;
                }

            } catch (err) {
                console.error("WS Parse Error", err);
            }
        };

        ws.current.onclose = () => {
            console.log("Responder WS Disconnected");
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, [responder.vehicleId, incident]); // Re-bind if vehicleId changes so we catch updates correctly? 
    // Actually typically onmessage closure captures state, so refs or functional updates are safer. 
    // But for now, simple dependency might cause reconnects. 
    // Better to use ref for responder/incident or functional state updates.
    // Given the complexity, let's stick to simple logic, and maybe remove dependencies if it causes reconnect loops.
    // Moving WS init outside dependencies or empty dep array is standard, but then we need refs for state access inside onmessage.

    // Using refs for state check inside callback:
    const responderRef = useRef(responder);
    const incidentRef = useRef(incident);
    useEffect(() => { responderRef.current = responder; }, [responder]);
    useEffect(() => { incidentRef.current = incident; }, [incident]);

    // Re-writing the onmessage part to use refs to avoid dependency issues on useEffect
    useEffect(() => {
        if (!ws.current) return;
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const currentResponder = responderRef.current;
                const currentIncident = incidentRef.current;

                switch (data.action) {
                    case "you_are_assigned":
                        if (data.vehicle) {
                            setResponder({
                                name: data.responder ? data.responder.name : "Responder",
                                vehicleId: data.vehicle.vehicle_id,
                                type: data.vehicle.vehicle_type,
                                status: data.vehicle.status
                            });
                            showSuccess(`Assigned to vehicle ${data.vehicle.vehicle_id}`);
                        }
                        break;

                    case "new_incident":
                    case "incident_updated":
                        // Check against current vehicle ID
                        if (currentResponder.vehicleId && data.vehicle_ids && data.vehicle_ids.includes(currentResponder.vehicleId)) {
                            // If it's the same incident, update data
                            if (currentIncident && currentIncident.incident_id === data.incident_id) {
                                setIncident(data);
                            } else {
                                // New incoming
                                setIncident(data);
                                setStatus("INCOMING");
                            }
                        }
                        break;

                    case "incident_resolved":
                        if (currentIncident && currentIncident.incident_id === data.incident_id) {
                            setIncident(null);
                            setStatus("IDLE");
                            showInfo("Incident Resolved");
                        }
                        break;

                    case "pending_to_on_route_response":
                        if (data.data) { // response format might differ, checking generic success
                            setStatus("ACTIVE");
                            setResponder(prev => ({ ...prev, status: "ON_ROUTE" }));
                            showSuccess("Status updated: En Route");
                        }
                        break;

                    case "resolve_incident_response":
                        setIncident(null);
                        setStatus("IDLE");
                        setResponder(prev => ({ ...prev, status: "AVAILABLE" }));
                        showSuccess("Mission Completed");
                        break;
                    case "error":
                        showError(data.message);
                        break;
                    default: break;
                }
            } catch (e) { console.error(e); }
        };
    }, [responder, incident]); // This will re-bind listener when state changes.


    const handleAccept = () => {
        if (!incident || !responder.vehicleId) return;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                action: "action_pending_to_on_route",
                vehicle_id: parseInt(responder.vehicleId),
                incident_id: incident.incident_id
            }));
        }
    };

    const handleResolve = () => {
        if (!incident) return;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                action: "action_resolve_incident",
                incident_id: incident.incident_id
            }));
        }
    };

    // Helper to get formatted status for UI
    const getStatusBadge = () => {
        switch (status) {
            case "IDLE": return <span className="status-badge available">Available</span>;
            case "INCOMING": return <span className="status-badge incoming">Incoming Request</span>;
            case "ACTIVE": return <span className="status-badge busy">On Mission</span>;
            default: return null;
        }
    };

    return (
        <div className="responder-page">
            <div className="responder-header">
                <div>
                    <h2 className="responder-name">{responder.name}</h2>
                    <p className="vehicle-info">Vehicle: <strong>{responder.vehicleId || "None"}</strong> ({responder.type})</p>
                </div>
                <div>
                    {getStatusBadge()}
                </div>
            </div>

            <div className="responder-content">
                {/* IDLE STATE */}
                {status === "IDLE" && (
                    <div className="idle-view">
                        <div className="pulse-circle"></div>
                        <h3>Scanning for incidents...</h3>
                        <p>{responder.vehicleId ? "You are currently available." : "Waiting for vehicle assignment..."}</p>
                    </div>
                )}

                {/* INCOMING REQUEST STATE */}
                {status === "INCOMING" && incident && (
                    <div className="incoming-alert">
                        <div className="alert-header">
                            <h1>🚨 ALERT 🚨</h1>
                            <p>New Incident Assigned</p>
                        </div>
                        <div className="incident-details-card">
                            <div className="detail-row">
                                <span className="label">Type:</span>
                                <span className="value red">{incident.type}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Severity:</span>
                                <span className="value">{incident.severity_level}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Location:</span>
                                <span className="value">{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Info:</span>
                                <span className="value">{incident.description}</span>
                            </div>
                        </div>
                        <button onClick={handleAccept} className="action-btn accept-btn">
                            ACCEPT ASSIGNMENT
                        </button>
                    </div>
                )}

                {/* ACTIVE MISSION STATE */}
                {status === "ACTIVE" && incident && (
                    <div className="active-mission">
                        <div className="mission-map-container">
                            <EmergencyMap
                                stations={[]}
                                cars={[{
                                    vehicle_id: responder.vehicleId,
                                    lat: incident.lat - 0.002, // Simulate vehicle slightly away
                                    lng: incident.lng - 0.002,
                                    vehicle_type: responder.type
                                }]}
                                allIncidents={[incident]}
                                focusedLocation={{ lat: incident.lat, lng: incident.lng }}
                                onMapClick={() => { }} // No interaction needed for dragging/dropping
                                pickedLocation={null}
                                isAddingCar={false}
                                isAddingIncident={false}
                                isAddingStation={false}
                            />
                        </div>

                        <div className="mission-controls">
                            <h3>Current Mission: #{incident.incident_id}</h3>
                            <button onClick={handleResolve} className="action-btn resolve-btn">
                                MARK RESOLVED
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponderPage;
