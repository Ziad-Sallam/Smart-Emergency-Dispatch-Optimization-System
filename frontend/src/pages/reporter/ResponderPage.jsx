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
    const [vehicle, setVehicle] = useState(null);
    const [incident, setIncident] = useState(null);
    const [route, setRoute] = useState(null);

    // WebSocket Reference
    const ws = useRef(null);
    const vehicleWs = useRef(null);

    // Refs to keep track of state without triggering re-renders in WS callback
    const responderRef = useRef(responder);
    const incidentRef = useRef(incident);
    const vehicleRef = useRef(vehicle);

    // Update refs whenever state changes
    useEffect(() => {
        responderRef.current = responder;
    }, [responder]);

    useEffect(() => {
        incidentRef.current = incident;
    }, [incident]);

    useEffect(() => {
        vehicleRef.current = vehicle;
    }, [vehicle])

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
            // Fetch initial status
            ws.current.send(JSON.stringify({
                action: "action_get_responder",
                responder_id: localStorage.getItem("user_id")
            }));
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WS Message:", data);

                // Use refs to get latest state
                const currentResponder = responderRef.current;
                const currentIncident = incidentRef.current;

                switch (data.action) {
                    case "get_responder_response":
                        if (data.vehicle[0]) {
                            setResponder({
                                name: data.user.name,
                                vehicleId: data.vehicle[0].vehicle_id,
                                type: data.vehicle[0].vehicle_type,
                                status: data.vehicle[0].status
                            });
                            setVehicle({
                                vehicle_id: data.vehicle[0].vehicle_id,
                                vehicle_type: data.vehicle[0].vehicle_type,
                                status: data.vehicle[0].status,
                                lng: data.vehicle[0].vehicle_lng,
                                lat: data.vehicle[0].vehicle_lat,
                            })
                        }

                        if (data.incident[0]) {
                            setIncident({
                                incident_id: data.incident[0].incident_id,
                                lng: data.incident[0].incident_lng,
                                lat: data.incident[0].incident_lat,
                                type: data.incident[0].type,
                                status: data.incident[0].status,
                                severity_level: data.incident[0].severity_level,
                            });
                        }
                        if (data.vehicle[0].status === "AVAILABLE") {
                            setStatus("IDLE");
                        }
                        if (data.vehicle[0].status === "PENDING") {
                            setStatus("INCOMING");
                        }
                        if (data.vehicle[0].status === "ON_ROUTE") {
                            setStatus("ACTIVE");
                        }

                        break;

                    case "you_are_assigned":
                        if (data.vehicle) {
                            setResponder({
                                name: data.user ? data.user.name : (currentResponder.name || "Responder"),
                                vehicleId: data.vehicle.vehicle_id,
                                type: data.vehicle.vehicle_type,
                                status: data.vehicle.status
                            });
                            setIncident({
                                incident_id: data.incident[0].incident_id,
                                lng: data.incident[0].lng,
                                lat: data.incident[0].lat,
                                type: data.incident[0].type,
                                status: data.incident[0].status,
                            });
                            showSuccess(`Assigned to vehicle ${data.vehicle.vehicle_id}`);
                        }
                        break;

                    case "new_incident":
                    case "incident_updated":
                        // Check if this incident is assigned to MY vehicle
                        if (parseInt(data.incident.vehicle_ids) === vehicleRef.current.vehicle_id) {
                            setIncident({
                                incident_id: data.incident.incident_id,
                                lng: data.incident.lng,
                                lat: data.incident.lat,
                                type: data.incident.type,
                                status: data.incident.status,
                                severity_level: data.incident.severity_level,
                            });
                            setStatus("INCOMING");
                        }
                        break;

                    case "incident_resolved":
                        if (currentIncident && currentIncident.incident_id === data.incident_id) {
                            setIncident(null);
                            setStatus("IDLE");
                            setRoute(null);
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

                    case "dispatch_vehicle_response":
                        if (data.route) {
                            const geoJsonRoute = {
                                type: "FeatureCollection",
                                features: [{
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "LineString",
                                        coordinates: data.route
                                    }
                                }]
                            };
                            setRoute(geoJsonRoute);
                            console.log("Route received:", geoJsonRoute);
                        }
                        break;

                    case "resolve_incident_response":
                        setIncident(null);
                        setStatus("IDLE");
                        setRoute(null);
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
    }, []); // Run ONCE on mount

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            showError("No access token found. Please login.");
            return;
        }

        if (!vehicle || !vehicle.vehicle_id) return;

        const wsUrl = `ws://127.0.0.1:8000/ws/fleet/?token=${token}`;
        vehicleWs.current = new WebSocket(wsUrl);

        vehicleWs.current.onopen = () => {
            console.log("Vehicle WS Connected");
            vehicleWs.current.send(JSON.stringify({
                action: "subscribe_vehicle",
                vehicle_id: vehicle.vehicle_id
            }));
        };

        vehicleWs.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Vehicle WS Message", data);
                switch(data.action){
                    case "vehicle_route":
                        if (data.vehicle_id === vehicle.vehicle_id) {
                            const geoJsonRoute = {
                                type: "FeatureCollection",
                                features: [{
                                    type: "Feature",
                                    properties: {},
                                    geometry: {
                                        type: "LineString",
                                        coordinates: data.route
                                    }
                                }]
                            };
                            setRoute(geoJsonRoute);
                        }
                        break;
                    case "vehicle_location_update":
                        if (data.vehicle_id === vehicle.vehicle_id) {
                            setVehicle(prev => ({
                                ...prev,
                                lng: data.lng,
                            lat: data.lat,
                        }));
                        }
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.error("WS Parse Error", err);
            }
        };

        vehicleWs.current.onclose = () => {
            console.log("Vehicle WS Disconnected");
        };

        return () => {
            if (vehicleWs.current) vehicleWs.current.close();
        };
    }, [vehicle?.vehicle_id]);


    const handleAccept = () => {
        console.log("Responder", responder);
        console.log("Vehicle Status", vehicle);
        console.log("Incident", incident);
        if (!incident || !responder.vehicleId) return;
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                action: "action_pending_to_on_route",
                vehicle_id: responder.vehicleId,
                incident_id: incident.incident_id
            }));
            ws.current.send(JSON.stringify({
                action: "action_dispatch_vehicle",
                vehicle_id: responder.vehicleId,
                start_lng: vehicle.lng,
                start_lat: vehicle.lat,
                end_lng: incident.lng,
                end_lat: incident.lat,
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
                                <span className="value">{incident.lat}, {incident.lng}</span>
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
                                cars={[vehicle]}
                                allIncidents={[incident]}
                                routes={[route]}
                                focusedLocation={null}
                                onMapClick={() => null}
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
