import React, { useEffect, useState } from "react";
import EmergencyMap from "../../components/map/EmergencyMap";
import DispatcherControls from "../../components/dispatcherControls/DispatcherControls";
import api from "../../interceptor/api";
// import "./Dispatcher.css"; 

export default function Dispatcher() {
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
      alert("WebSocket not connected. Please refresh.");
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
        case "dispatch_incident_response":
          console.log("Dispatch success", data);
          console.log("Incidents:", incidents);
          console.log(data.message);
          // Re-fetch to streamline updates or update local state manually
          ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          alert("Unit assigned successfully!");
          break;
        case "report_incident_response":
          console.log("Report success", data);
          console.log("Incidents:", incidents);
          console.log(data.message);
          // Re-fetch to streamline updates or update local state manually
          ws.current.send(JSON.stringify({ action: "action_list_incidents" }));
          ws.current.send(JSON.stringify({ action: "action_list_vehicles" }));
          alert("Incident reported successfully!");
          break;
        case "error":
          console.error("WS Error:", data.message);
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