# WebSocket API Documentation

This document describes the WebSocket actions available in the application. All messages sent to the WebSocket should be JSON objects with an `action` field.

## General Structure

**Request:**
```json
{
  "action": "action_name",
  "data_key": "data_value"
}
```

**Response:**
```json
{
  "action": "action_name_response",
  "data": "..."
}
```

**Error Response:**
```json
{
  "action": "error",
  "message": "Error description"
}
```

---

## Actions List

### 1. General Actions

#### `action_send_message`
Sends a chat message (echoes back).
- **Request:**
  ```json
  {
      "action": "action_send_message",
      "message": "Hello"
  }
  ```
- **Response:**
  ```json
  {
      "action": "message_received",
      "message": "Hello"
  }
  ```

#### `action_get_analytics`
Retrieves system analytics.
- **Request:**
  ```json
  {
      "action": "action_get_analytics"
  }
  ```
- **Response:**
  ```json
  {
      "action": "analytics_received",
      "analytics": {
          "average_response_time": ...,
          "max_response_time": ...,
          ...
      }
  }
  ```

### 2. Admin/Dispatcher Actions

#### `action_list_incidents`
Lists all incidents, optionally filtered by status.
- **Request:**
  ```json
  {
      "action": "action_list_incidents",
      "status": "PENDING"  // Optional
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_incidents_response",
      "incidents": [...],
      "count": 10
  }
  ```

#### `action_dispatch_incident`
Reassigns a vehicle to an incident.
- **Request:**
  ```json
  {
      "action": "action_dispatch_incident",
      "incident_id": 123,
      "new_vehicle_id": 456
  }
  ```
- **Response:**
  ```json
  {
      "action": "dispatch_incident_response",
      "message": "Dispatch modified successfully",
      "incident": {...}
  }
  ```

#### `action_get_incident_dispatches`
Gets dispatch history for an incident.
- **Request:**
  ```json
  {
      "action": "action_get_incident_dispatches",
      "incident_id": 123
  }
  ```
- **Response:**
  ```json
  {
      "action": "get_incident_dispatches_response",
      "dispatches": [...]
  }
  ```

### 3. Vehicle Management (Admin Only)

#### `action_list_vehicles`
Lists all vehicles.
- **Request:**
  ```json
  {
      "action": "action_list_vehicles",
      "status": "AVAILABLE" // Optional
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_vehicles_response",
      "vehicles": [...],
      "count": 5
  }
  ```

#### `action_create_vehicle`
Creates a new vehicle.
- **Request:**
  ```json
  {
      "action": "action_create_vehicle",
      "station_id": 1,
      "capacity": 100,
      "lat": 30.123,
      "lng": 31.123
  }
  ```
- **Response:**
  ```json
  {
      "action": "create_vehicle_response",
      "message": "Vehicle created successfully",
      "vehicle": {...}
  }
  ```

#### `action_delete_vehicle`
Deletes a vehicle.
- **Request:**
  ```json
  {
      "action": "action_delete_vehicle",
      "vehicle_id": 123
  }
  ```
- **Response:**
  ```json
  {
      "action": "delete_vehicle_response",
      "message": "Vehicle deleted successfully"
  }
  ```

### 4. Station Management

#### `action_list_stations`
Lists all stations.
- **Request:**
  ```json
  {
      "action": "action_list_stations"
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_stations_response",
      "stations": [...],
      "count": 3
  }
  ```

#### `action_create_station`
Creates a new station (Admin only).
- **Request:**
  ```json
  {
      "action": "action_create_station",
      "type": "FIRE",
      "zone": "Zone A",
      "lat": 30.123,
      "lng": 31.123
  }
  ```
- **Response:**
  ```json
  {
      "action": "create_station_response",
      "message": "Station created successfully",
      "station": {...}
  }
  ```

### 5. User Management

#### `action_list_admins`
Lists admin users (Admin only).
- **Request:**
  ```json
  {
      "action": "action_list_admins"
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_admins_response",
      "admins": [...],
      "count": 5
  }
  ```

#### `action_create_admin`
Creates a new admin/dispatcher (Admin only).
- **Request:**
  ```json
  {
      "action": "action_create_admin",
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe",
      "role": "DISPATCHER" // Optional, default DISPATCHER
  }
  ```
- **Response:**
  ```json
  {
      "action": "create_admin_response",
      "message": "User created successfully",
      "admin": {...}
  }
  ```

### 6. Reporter Actions

#### `action_report_incident`
Reports a new incident.
- **Request:**
  ```json
  {
      "action": "action_report_incident",
      "type": "FIRE",
      "lat": 30.123,
      "lng": 31.123,
      "severity_level": "HIGH",
      "description": "Fire in building" // Optional
  }
  ```
- **Response:**
  ```json
  {
      "action": "report_incident_response",
      "message": "Incident reported...",
      "incident": {...}
  }
  ```

### 7. Responder Actions

#### `action_update_unit_location`
Updates vehicle location.
- **Request:**
  ```json
  {
      "action": "action_update_unit_location",
      "vehicle_id": 123,
      "lat": 30.123,
      "lng": 31.123
  }
  ```
- **Response:**
  ```json
  {
      "action": "update_unit_location_response",
      "message": "Location updated successfully",
      "vehicle": {...}
  }
  ```

#### `action_resolve_incident`
Mark an incident as resolved.
- **Request:**
  ```json
  {
      "action": "action_resolve_incident",
      "incident_id": 123
  }
  ```
- **Response:**
  ```json
  {
      "action": "resolve_incident_response",
      "message": "Incident resolved successfully",
      "incident": {...}
  }
  ```

#### `action_pending_to_on_route`
Updates vehicle status to on-route.
- **Request:**
  ```json
  {
      "action": "action_pending_to_on_route",
      "vehicle_id": 123,
      "incident_id": 456 // Required for response data
  }
  ```
- **Response:**
  ```json
  {
      "action": "pending_to_on_route_response",
      "data": {...}
  }
  ```

#### `action_assign_responder_to_vehicle`
Assigns a responder to a vehicle (Admin only).
- **Request:**
  ```json
  {
      "action": "action_assign_responder_to_vehicle",
      "responder_id": 123,
      "vehicle_id": 456
  }
  ```
- **Response:**
  ```json
  {
      "action": "assign_responder_to_vehicle_response",
      "user": {...},
      "vehicle": {...}
  }
  ```
