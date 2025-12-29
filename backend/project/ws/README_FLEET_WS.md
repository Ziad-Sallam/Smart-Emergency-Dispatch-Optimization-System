# Fleet Management WebSockets

This document details the WebSocket APIs available for the Smart Emergency Dispatch Optimization System. The system uses two main WebSocket endpoints: one for general command & control actions and another for dedicated real-time vehicle tracking.

## Authentication

All WebSocket connections require authentication via a JSON Web Token (JWT). The token must be passed as a query parameter named `token` in the connection URL.

**Format:**
`ws://<host>/ws/<endpoint>/?token=<YOUR_JWT_TOKEN>`

## Endpoints

### 1. General Actions & Notifications (`ws/chat/`)

**URL:** `ws://<host>/ws/chat/?token=...`

This is the primary endpoint for most interactions, including incident reporting, dispatching, administration, and non-real-time updates.

#### Structure
- **Request (Client -> Server):**
  ```json
  {
      "action": "ACTION_NAME",
      "...": "other parameters"
  }
  ```
- **Response (Server -> Client):**
  ```json
  {
      "action": "ACTION_NAME_response",
      "...": "response data"
  }
  ```
- **Broadcasts:** Events triggered by other users/system will be pushed to this socket with relevant action names (e.g., `incident_updated`, `new_incident`).

#### Available Actions

##### Incident Management

| Action | Parameters | Description |
|--------|------------|-------------|
| `list_incidents` | `status` (optional) | Lists all incidents. |
| `report_incident` | `type`, `lat`, `lng`, `severity_level`, `description` | Reports a new incident. |
| `dispatch_incident` | `incident_id`, `new_vehicle_id` | Reassigns a vehicle to an incident. |
| `resolve_incident` | `incident_id` | Marks an incident as resolved. |
| `get_incident_dispatches`| `incident_id` | Gets dispatch history for an incident. |

##### Vehicle Management

| Action | Parameters | Description |
|--------|------------|-------------|
| `list_vehicles` | `status` (optional) | Lists all vehicles. |
| `create_vehicle` | `station_id`, `capacity`, `lat`, `lng` | (Admin) Creates a new vehicle. |
| `delete_vehicle` | `vehicle_id` | (Admin) Deletes a vehicle. |
| `update_unit_location` | `vehicle_id`, `lat`, `lng` | Updates a specific vehicle's location. |
| `pending_to_on_route` | `vehicle_id`, `incident_id` (optional) | Updates status to ON_ROUTE. |
| `assign_responder_to_vehicle` | `responder_id`, `vehicle_id` | Assigns a user to a vehicle. |
| `dispatch_vehicle` | `vehicle_id`, `end_lat`, `end_lng` | Dispatches vehicle to a location. |

##### Station Management

| Action | Parameters | Description |
|--------|------------|-------------|
| `list_stations` | N/A | Lists all stations. |
| `create_station` | `type`, `zone`, `lat`, `lng` | (Admin) Creates a new station. |

##### User Management

| Action | Parameters | Description |
|--------|------------|-------------|
| `list_admins` | N/A | (Admin) Lists admin users. |
| `create_admin` | `email`, `password`, `name`, `role` | (Admin) Creates a new admin/dispatcher. |
| `get_responder` | `responder_id` | Gets details for a responder. |

##### Analytics
| Action | Parameters | Description |
|--------|------------|-------------|
| `get_analytics` | N/A | Retrieves system analytics (response times, counts). |

---

### 2. Real-time Fleet Tracking (`ws/fleet/`)

**URL:** `ws://<host>/ws/fleet/?token=...`

This endpoint is optimized for high-frequency updates related to vehicle movement and route streaming.

#### Connection Events
On successful connection, server sends:
```json
{
    "action": "connected",
    "user_id": <USER_ID>
}
```

#### Actions

##### Subscribe to Vehicle
Listen for updates for a specific vehicle.

**Request:**
```json
{
    "action": "subscribe_vehicle",
    "vehicle_id": "VEHICLE_UUID"
}
```

**Response:**
```json
{
    "action": "vehicle_subscribed",
    "vehicle_id": "VEHICLE_UUID"
}
```

##### Unsubscribe from Vehicle
Stop listening for updates.

**Request:**
```json
{
    "action": "unsubscribe_vehicle",
    "vehicle_id": "VEHICLE_UUID"
}
```

##### Start Vehicle Route Stream 
Simulates/Starts streaming a route for a vehicle between two points.

**Request:** (send to /ws/chat/)
```json
{
    "action": "action_dispatch_vehicle",
    "vehicle_id": <VEHICLE_ID>,
    "end_lng": <DESTINATION_LNG>,
    "end_lat": <DESTINATION_LAT>,
    "start_lng": <START_LNG>,
    "start_lat": <START_LAT>    
}
```

**Response:** (received from /ws/fleet/)
```json
{
    "action": "vehicle_location_update",
    "vehicle_id": <VEHICLE_ID>,
    "lat": <LATITUDE>,
    "lng": <LONGITUDE>
}
```

**Broadcasted Events:**
Route updates will be sent as standard JSON packets containing vehicle state during the simulation.
