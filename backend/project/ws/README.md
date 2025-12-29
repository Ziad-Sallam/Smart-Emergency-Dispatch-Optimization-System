# WebSocket API Documentation

This document describes the WebSocket actions available in the application. All messages sent to the WebSocket should be JSON objects with an `action` field.

## Connection

Connect to the WebSocket endpoint with a valid JWT token:
```
ws://127.0.0.1:8000/ws/chat/?token=<YOUR_JWT_TOKEN>
```

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

> **Note:** You can omit the `action_` prefix when sending requests. The server automatically prepends it.

---

## Actions List

### 1. General Actions

#### `send_message`
Sends a chat message (echoes back).
- **Request:**
  ```json
  {
      "action": "send_message",
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

#### `get_analytics`
Retrieves comprehensive system analytics.
- **Request:**
  ```json
  {
      "action": "get_analytics"
  }
  ```
- **Response:**
  ```json
  {
      "action": "analytics_received",
      "analytics": {
          "average_response_time": 12.5,
          "max_response_time": 45,
          "min_response_time": 3,
          "best_responder": {...},
          "worst_responder": {...},
          "best_station": {...},
          "worst_station": {...},
          "total_incidents_type": [...],
          "active_vehicles_type": [...]
      }
  }
  ```

---

### 2. Incident Management

#### `list_incidents`
Lists all incidents, optionally filtered by status.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "list_incidents",
      "status": "REPORTED"  // Optional: REPORTED, ASSIGNED, RESOLVED
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

#### `report_incident`
Reports a new incident. Auto-assigns the nearest available vehicle.
- **Authorization:** Any user
- **Request:**
  ```json
  {
      "action": "report_incident",
      "type": "FIRE",           // FIRE, POLICE, or MEDICAL
      "lat": 40.7128,
      "lng": -74.0060,
      "severity_level": "CRITICAL",  // LOW, MEDIUM, HIGH, CRITICAL
      "description": "Large fire in building"  // Optional
  }
  ```
- **Response:**
  ```json
  {
      "action": "report_incident_response",
      "message": "Incident reported and vehicle auto-assigned successfully",
      "incident": {
          "incident_id": 29,
          "type": "FIRE",
          "status": "ASSIGNED",
          "severity_level": "CRITICAL",
          "lat": 40.7128,
          "lng": -74.0060,
          "vehicle_ids": "1",
          "time_reported": "2025-12-29T15:50:00"
      }
  }
  ```
- **Broadcasts:** `new_incident` to ADMIN, DISPATCHER, and RESPONDER groups.

#### `dispatch_incident`
Reassigns a different vehicle to an incident.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "dispatch_incident",
      "incident_id": 29,
      "new_vehicle_id": 5
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
- **Broadcasts:** `incident_updated` to ADMIN, DISPATCHER, and RESPONDER groups.

#### `resolve_incident`
Marks an incident as resolved.
- **Authorization:** Any user
- **Request:**
  ```json
  {
      "action": "resolve_incident",
      "incident_id": 29
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
- **Broadcasts:** `incident_resolved` to ADMIN and DISPATCHER groups.

#### `get_incident_dispatches`
Gets dispatch history for a specific incident.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "get_incident_dispatches",
      "incident_id": 29
  }
  ```
- **Response:**
  ```json
  {
      "action": "get_incident_dispatches_response",
      "dispatches": [...]
  }
  ```

---

### 3. Vehicle Management

#### `list_vehicles`
Lists all vehicles, optionally filtered by status.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "list_vehicles",
      "status": "AVAILABLE"  // Optional: AVAILABLE, PENDING, ON_ROUTE
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_vehicles_response",
      "vehicles": [...],
      "count": 15
  }
  ```

#### `create_vehicle`
Creates a new vehicle.
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "create_vehicle",
      "station_id": 1,
      "capacity": 5,
      "lat": 40.7000,
      "lng": -74.0000
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
- **Broadcasts:** `vehicle_created` to ADMIN and DISPATCHER groups.

#### `delete_vehicle`
Deletes a vehicle (only if no active assignments).
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "delete_vehicle",
      "vehicle_id": 5
  }
  ```
- **Response:**
  ```json
  {
      "action": "delete_vehicle_response",
      "message": "Vehicle deleted successfully"
  }
  ```
- **Broadcasts:** `vehicle_deleted` to ADMIN and DISPATCHER groups.

#### `update_unit_location`
Updates the GPS location of a vehicle.
- **Authorization:** Any user (typically Responders)
- **Request:**
  ```json
  {
      "action": "update_unit_location",
      "vehicle_id": 1,
      "lat": 40.7300,
      "lng": -74.0100
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
- **Broadcasts:** `unit_location_updated` to ADMIN and DISPATCHER groups.

#### `pending_to_on_route`
Updates vehicle status from PENDING to ON_ROUTE.
- **Authorization:** ADMIN or RESPONDER
- **Request:**
  ```json
  {
      "action": "pending_to_on_route",
      "vehicle_id": 1,
      "incident_id": 29  // Optional, for response data
  }
  ```
- **Response:**
  ```json
  {
      "action": "pending_to_on_route_response",
      "data": {...}
  }
  ```
- **Broadcasts:** `vehicle_status_updated` to ADMIN and DISPATCHER groups.

---

### 4. Station Management

#### `list_stations`
Lists all stations.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "list_stations"
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

#### `create_station`
Creates a new station.
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "create_station",
      "type": "FIRE",      // FIRE, POLICE, or MEDICAL
      "zone": "Downtown-A",
      "lat": 40.7200,
      "lng": -74.0200
  }
  ```
- **Response:**
  ```json
  {
      "action": "create_station_response",
      "message": "Station created successfully",
      "station": {
          "station_id": 4,
          "type": "FIRE",
          "zone": "Downtown-A",
          "lat": 40.7200,
          "lng": -74.0200
      }
  }
  ```
- **Broadcasts:** `station_created` to ADMIN group.

---

### 5. User Management

#### `list_admins`
Lists all admin and dispatcher users.
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "list_admins"
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

#### `create_admin`
Creates a new admin, dispatcher, or responder user.
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "create_admin",
      "email": "newuser@example.com",
      "password": "secure_password",
      "name": "Jane Smith",
      "role": "DISPATCHER"  // Optional: ADMIN, DISPATCHER, RESPONDER (default: DISPATCHER)
  }
  ```
- **Response:**
  ```json
  {
      "action": "create_admin_response",
      "message": "User created successfully",
      "admin": {
          "user_id": 10,
          "email": "newuser@example.com",
          "name": "Jane Smith",
          "role": "DISPATCHER"
      }
  }
  ```
- **Broadcasts:** `admin_created` to ADMIN group.

#### `assign_responder_to_vehicle`
Assigns a responder to a vehicle.
- **Authorization:** ADMIN only
- **Request:**
  ```json
  {
      "action": "assign_responder_to_vehicle",
      "responder_id": 7,
      "vehicle_id": 1
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
- **Broadcasts:**
  - `vehicle_assignment_updated` to ADMIN and DISPATCHER groups.
  - `you_are_assigned` directly to the specific responder (`user_7`).
  - `get_responder_response` to the assigned responder with full context.

#### `get_responder`
Fetches comprehensive responder data including assigned vehicle and active incidents.
- **Request:**
  ```json
  {
      "action": "get_responder",
      "responder_id": 7
  }
  ```
- **Response:**
  ```json
  {
      "action": "get_responder_response",
      "user": {
          "user_id": 7,
          "name": "John Doe",
          "email": "responder@test.com",
          "role": "RESPONDER"
      },
      "vehicle": [
          {
              "vehicle_id": 1,
              "status": "ON_ROUTE",
              "capacity": 5,
              "station_id": 1,
              "vehicle_lat": 40.7128,
              "vehicle_lng": -74.0060
          }
      ],
      "incident": [
          {
              "incident_id": 29,
              "type": "FIRE",
              "status": "ASSIGNED",
              "severity_level": "CRITICAL",
              "incident_lat": 40.7200,
              "incident_lng": -74.0100
          }
      ]
  }
  ```
- **Broadcasts:** `get_responder_response` to the specific responder.

---

### 6. Notification Management

#### `list_admin_notifications`
Retrieves admin notifications.
- **Authorization:** ADMIN or DISPATCHER
- **Request:**
  ```json
  {
      "action": "list_admin_notifications"
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_admin_notifications_response",
      "notifications": [
          {
              "admin_notification_id": 1,
              "title": "Unassigned Timeout: Incident #29",
              "body": "Incident #29 (FIRE, CRITICAL) has been unassigned for more than 2 minutes!",
              "created_at": "2025-12-29T15:52:53"
          },
          {
              "admin_notification_id": 2,
              "title": "New Incident #30 Reported",
              "body": "Type: FIRE, Severity: CRITICAL. Location: 40.7128, -74.0060",
              "created_at": "2025-12-29T16:00:00"
          }
      ]
  }
  ```

#### `list_user_notifications`
Retrieves user-specific notifications.
- **Authorization:** Any authenticated user
- **Request:**
  ```json
  {
      "action": "list_user_notifications"
  }
  ```
- **Response:**
  ```json
  {
      "action": "list_user_notifications_response",
      "notifications": [
          {
              "user_notification_id": 1,
              "incident_id": 15,
              "title": "Incident #15 Resolved",
              "created_at": "2025-12-29T14:30:00"
          }
      ]
  }
  ```

---

## Broadcast Events

These are **server-initiated messages** that you may receive without sending a request:

| Event | Recipient | Description |
|-------|-----------|-------------|
| `new_incident` | ADMIN, DISPATCHER, RESPONDER | New incident reported |
| `incident_updated` | ADMIN, DISPATCHER, RESPONDER | Dispatch reassigned |
| `incident_resolved` | ADMIN, DISPATCHER | Incident marked resolved |
| `new_notification` | ADMIN | Background timeout alert pushed via Redis |
| `unit_location_updated` | ADMIN, DISPATCHER | Responder updated GPS location |
| `vehicle_created` | ADMIN, DISPATCHER | New vehicle added to fleet |
| `vehicle_deleted` | ADMIN, DISPATCHER | Vehicle removed from fleet |
| `vehicle_status_updated` | ADMIN, DISPATCHER | Vehicle status changed (e.g., PENDING → ON_ROUTE) |
| `vehicle_assignment_updated` | ADMIN, DISPATCHER | Responder assigned to vehicle |
| `you_are_assigned` | Specific Responder | You have been assigned to a vehicle |
| `get_responder_response` | Specific Responder | Your profile data (vehicle + incidents) |
| `station_created` | ADMIN | New station created |
| `admin_created` | ADMIN | New user created |

---

## Authorization

Many actions require specific roles:
- **ADMIN**: Full access to all actions
- **DISPATCHER**: Incident and vehicle management
- **RESPONDER**: Location updates, incident resolution

Unauthorized requests return:
```json
{
    "action": "error",
    "message": "Unauthorized"
}
```

---

## Background Services

### Notification Service
The `run_notification_service` management command runs continuously and:
- Checks every 30 seconds for stale incidents
- Sends `new_notification` broadcasts for:
  - **Unassigned Timeout**: Incidents in `REPORTED` status for >2 minutes
  - **Resolution Timeout**: Incidents not resolved for >2 minutes
- Uses Redis for cross-process communication

To start the service:
```bash
python manage.py run_notification_service
```
