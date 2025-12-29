import React, { useEffect, useState } from "react";
import EmergencyMap from "../../components/map/EmergencyMap";
import DispatcherControls from "../../components/dispatcherControls/DispatcherControls";
import api from "../../interceptor/api";
import { useNotification } from "../../components/Notificatoions/NotificationContext";
// import "./Dispatcher.css"; 

export default function Dispatcher() {
  const {showError,showSuccess,showWarning} = useNotification();
  // 1. DATA STATE 
  const [stations, setStations] = useState([]);

  const [incidents, setIncidents] = useState([]);

  const [cars, setCars] = useState([]);

  const [focusedLocation, setFocusedLocation] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [isAddingStation, setIsAddingStation] = useState(false);



  const handleLocate = (lat, lng) => {
    setFocusedLocation({ lat, lng, timestamp: Date.now() }); // Timestamp ensures unique updates even if clicking same spot
  };

  const handleMapClick = (lngLat) => {
    setPickedLocation(lngLat);
  };

  const assignUnit = (incidentId, carId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        action: "action_dispatch_incident",
        incident_id: incidentId,
        new_vehicle_id: carId
      }));
    } else {
      console.error("WebSocket not connected");
      showError("WebSocket not connected. Please refresh.");
    }
  };


  // WebSocket Reference
  const ws = React.useRef(null);

  useEffect(() => {
    // 1. Establish WebSocket Connection
    const token = localStorage.getItem("access_token");
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      // 2. Fetch Initial Data via WebSocket Actions
      ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
      ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
      ws.current.send(JSON.stringify({ action: "action_list_stations" }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WS Message:", data);

      switch (data.action) {
        case "list_incidents_response":
          if (data.incidents) setIncidents(data.incidents);
          break;
        case "list_vehicles_response":
          if (data.vehicles) setCars(data.vehicles);
          break;
        case "list_stations_response":
          if (data.stations) setStations(data.stations);
          break;
        case "report_incident_response":
          console.log("Incident reported:", data);
          showSuccess("Incident reported successfully!");
          ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
          break;
        case "create_vehicle_response":
          console.log("Vehicle created:", data);
          showSuccess("Vehicle created successfully!");
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          break;
        case "create_station_response":
          console.log("Station created:", data);
          showSuccess("Station created successfully!");
          ws.current.send(JSON.stringify({ action: "action_list_stations" }));
          break;
        case "delete_vehicle_response":
          console.log("Vehicle deleted:", data);
          showSuccess("Vehicle deleted successfully!");
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          break;
        case "dispatch_incident_response":
          console.log("Dispatch success", data);
          // Re-fetch to streamline updates
          ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          showSuccess("Unit assigned successfully!");
          break;
        case "new_incident":
        case "incident_updated":
        case "incident_resolved":
          // Broadcast events: just refresh list
          console.log("Incident update received");
          ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
          break;
        case "vehicle_created":
        case "vehicle_deleted":
        case "vehicle_status_updated":
        case "unit_location_updated":
        case "vehicle_assignment_updated":
          // Broadcast events: just refresh list
          console.log("Vehicle update received");
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          break;
        case "station_created":
          // Broadcast events: just refresh list
          console.log("Station update received");
          ws.current.send(JSON.stringify({ action: "action_list_stations" }));
          break;
        case "error":
          console.error("WS Error:", data.message);
          showError("Error: " + data.message);
          break;
        default:
          break;
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);


  return (
    <div className="dispatcher-layout" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ width: "400px", zIndex: 20, boxShadow: "2px 0 10px rgba(0,0,0,0.1)" }}>
        <DispatcherControls
          ws={ws}
          stations={stations}
          cars={cars}
          allIncidents={incidents}
          onAssign={assignUnit}
          onLocate={handleLocate} // Pass the function down
          pickedLocation={pickedLocation}
          clearPickedLocation={() => setPickedLocation(null)}
          isAddingCar={isAddingCar}
          isAddingIncident={isAddingIncident}
          isAddingStation={isAddingStation}
          setIsAddingCar={setIsAddingCar}
          setIsAddingIncident={setIsAddingIncident}
          setIsAddingStation={setIsAddingStation}
        />
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <EmergencyMap
          stations={stations}
          cars={cars}
          allIncidents={incidents}
          focusedLocation={focusedLocation}
          onMapClick={handleMapClick}
          pickedLocation={pickedLocation}
          isAddingCar={isAddingCar}
          isAddingIncident={isAddingIncident}
          isAddingStation={isAddingStation}
        />
      </div>
    </div>
  );
}