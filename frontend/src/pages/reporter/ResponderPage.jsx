import React, { useState, useEffect } from 'react';
import EmergencyMap from '../../components/map/EmergencyMap';
import './ResponderPage.css';

const ResponderPage = () => {
    // Mock Responder Data
    const [responder] = useState({
        name: "Ahmed Hassan",
        vehicleId: "MED-01",
        type: "MEDICAL",
        status: "AVAILABLE"
    });

    // States: IDLE, INCOMING, ACTIVE
    const [status, setStatus] = useState("IDLE");
    const [incident, setIncident] = useState(null);

    // Mock Incident Data for simulation
    const mockIncident = {
        incident_id: 101,
        type: "MEDICAL",
        severity_level: "CRITICAL",
        lat: 31.2252407,
        lng: 29.9467916, // Near the central command in existing data
        description: "Cardiac arrest reported at Alexandria Station.",
        time_reported: new Date().toISOString()
    };

    const handleSimulateIncoming = () => {
        setIncident(mockIncident);
        setStatus("INCOMING");
    };

    const handleAccept = () => {
        setStatus("ACTIVE");
    };

    const handleResolve = () => {
        setStatus("IDLE");
        setIncident(null);
        alert("Incident Resolved! Good work.");
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
                    <p className="vehicle-info">Vehicle: <strong>{responder.vehicleId}</strong> ({responder.type})</p>
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
                        <p>You are currently available.</p>

                        {/* Dev Tool for Simulation */}
                        <button onClick={handleSimulateIncoming} className="simulate-btn">
                            [DEV] Simulate Incoming Incident
                        </button>
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
