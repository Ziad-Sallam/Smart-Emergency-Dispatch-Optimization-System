import React, { useState, useRef, useEffect } from 'react';
import EmergencyMap from '../../components/map/EmergencyMap';
import axios from 'axios';
import './ReporterPage.css'; // We'll create this for specific styles

const API_BASE_URL = 'http://127.0.0.1:8000'; // Make sure this matches your backend

const ReporterPage = () => {
    const [pickedLocation, setPickedLocation] = useState(null);
    const [incidentForm, setIncidentForm] = useState({
        type: 'POLICE',
        severity: 'MEDIUM',
        lat: '',
        lng: '',
        description: '', // Added description field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // For success/error messages

    // Update form when location is picked on map
    useEffect(() => {
        if (pickedLocation) {
            setIncidentForm(prev => ({
                ...prev,
                lat: pickedLocation.lat.toFixed(6),
                lng: pickedLocation.lng.toFixed(6)
            }));
        }
    }, [pickedLocation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIncidentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleMapClick = (lngLat) => {
        setPickedLocation(lngLat);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/incidents/report/`,
                {
                    type: incidentForm.type,
                    severity_level: incidentForm.severity, // Note: Backend expects severity_level
                    lat: parseFloat(incidentForm.lat),
                    lng: parseFloat(incidentForm.lng),
                    description: incidentForm.description
                }
            );

            console.log("Incident reported:", response.data);
            setMessage({ type: 'success', text: 'Incident reported successfully!' });

            // Reset form
            setIncidentForm({
                type: 'POLICE',
                severity: 'MEDIUM',
                lat: '',
                lng: '',
                description: ''
            });
            setPickedLocation(null);

        } catch (error) {
            console.error("Error reporting incident:", error);
            setMessage({ type: 'error', text: 'Failed to report incident. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    

    // Mobile check (simple generic check, better done with CSS media queries, but inline styles for logic)
    const isMobile = window.innerWidth <= 768;

    return (
        <div className="reporter-page">
            {/* Mobile-first CSS classes will handle the layout switch provided via ReporterPage.css */}
            <div className="form-section">
                <div className="form-header">
                    <h2>Report an Incident</h2>
                    <p>Use the map to pin the location, then fill out the details underneath.</p>
                </div>

                {message && (
                    <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Incident Type</label>
                        <select
                            name="type"
                            value={incidentForm.type}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="POLICE">Police</option>
                            <option value="FIRE">Fire</option>
                            <option value="MEDICAL">Medical</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Severity</label>
                        <select
                            name="severity"
                            value={incidentForm.severity}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={incidentForm.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="form-control"
                            placeholder="Describe the situation..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Latitude</label>
                            <input
                                type="number"
                                name="lat"
                                value={incidentForm.lat}
                                readOnly
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Longitude</label>
                            <input
                                type="number"
                                name="lng"
                                value={incidentForm.lng}
                                readOnly
                                className="form-control"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !incidentForm.lat}
                        className="submit-btn"
                    >
                        {isSubmitting ? 'Submitting...' : 'Report Incident'}
                    </button>
                </form>

            </div>

            <div className="map-section">
                <EmergencyMap
                    stations={[]} // Hiding stations for reporter
                    cars={[]}     // Hiding cars for reporter
                    allIncidents={[]} // Hiding other incidents for reporter
                    focusedLocation={null}
                    onMapClick={handleMapClick}
                    pickedLocation={pickedLocation}
                    isAddingCar={false}
                    isAddingIncident={true} // Enable pin drop mode logic in map
                    isAddingStation={false}
                />
            </div>
        </div >
    );
};

export default ReporterPage;
