from asgiref.sync import sync_to_async
from app import repo
from decimal import Decimal
from app.hasher import hash_password
from datetime import datetime 
from .dispatch import dispatch_vehicle_to_destination
# Assuming hash_password is in app.hasher based on views.py imports

def convert_decimals(obj):
    """Recursively convert all Decimals in dicts/lists to floats."""
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    else:
        return obj

def convert_for_json(obj):
    """Recursively convert Decimals to floats and datetimes to strings."""
    if isinstance(obj, list):
        return [convert_for_json(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj


class WSActions:
    def __init__(self, scope, channel_layer=None):
        self.scope = scope
        self.user = scope.get("user")
        self.channel_layer = channel_layer

    async def _broadcast(self, group_name, message, action_type=None):
        """Helper to broadcast messages to a channel group."""
        if not self.channel_layer:
            print("No channel layer available for broadcast")
            return
            
        if action_type:
            message['action'] = action_type
            
        await self.channel_layer.group_send(
            group_name,
            {
                "type": "broadcast_message",
                "message": message
            }
        )

    async def action_send_message(self, data):
        return {"action": "message_received", "message": data.get("message", "")}

    async def action_get_analytics(self, data):
        try:
            print("action_get_analytics")
            get_avg = sync_to_async(repo.get_average_response_time)
            get_max = sync_to_async(repo.get_max_response_time)
            get_min = sync_to_async(repo.get_min_response_time)
            get_best_resp = sync_to_async(repo.get_best_responder)
            get_worst_resp = sync_to_async(repo.get_worst_responder)
            get_best_stn = sync_to_async(repo.get_best_station)
            get_worst_stn = sync_to_async(repo.get_worst_station)
            get_incidents = sync_to_async(repo.get_incidents_by_type_detailed)
            get_vehicles = sync_to_async(repo.get_vehicle_count_by_type)

            analytics = {}
            analytics["average_response_time"] = (await get_avg())
            analytics["max_response_time"] = (await get_max())
            analytics["min_response_time"] = (await get_min())
            analytics["best_responder"] = await get_best_resp()
            analytics["worst_responder"] = await get_worst_resp()
            analytics["best_station"] = await get_best_stn()
            analytics["worst_station"] = await get_worst_stn()
            analytics["total_incidents_type"] = await get_incidents()
            analytics["active_vehicles_type"] = await get_vehicles()
            analytics = convert_for_json(analytics)
            print(analytics)

            return {"action": "analytics_received", "analytics": analytics}
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= ADMIN/DISPATCHER ACTIONS =============

    async def action_list_incidents(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                return {"action": "error", "message": "Unauthorized"}
            
            status = data.get('status', None)
            if status:
                status = status.upper()
            
            get_incidents = sync_to_async(repo.get_all_incidents)
            incidents = await get_incidents(status)
            print(incidents)
            incidents = convert_for_json(incidents)
            
            return {
                "action": "list_incidents_response",
                "incidents": incidents,
                "count": len(incidents)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_dispatch_incident(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                return {"action": "error", "message": "Unauthorized"}
            
            required_fields = ['incident_id', 'new_vehicle_id']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            reassign = sync_to_async(repo.reassign_dispatch)
            incident = await reassign(
                incident_id=data['incident_id'],
                vehicle_id=data['new_vehicle_id'],
                dispatcher_id=self.user['user_id']
            )
            incident = convert_for_json(incident)

            res = {
                "action": "dispatch_incident_response",
                "message": "Dispatch modified successfully",
                "incident": incident
            }
            
            # Broadcast update
            await self._broadcast("group_ADMIN", res, "incident_updated")
            await self._broadcast("group_DISPATCHER", res, "incident_updated")
            await self._broadcast("group_RESPONDER", res, "incident_updated")
            
            # Notify the specific responder if vehicle is assigned
            # We need to find the responder user_id associated with this vehicle to notify them directly
            # For now, broadcasting to all responders might be noisy, so we rely on them polling or 
            # we need a way to look up vehicle->responder. 
            # Assuming 'vehicle' key in incident has enough info or we can fetch it.
            # Ideally: await self._broadcast(f"user_{responder_id}", incident, "new_dispatch")
            
            return res
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_get_incident_dispatches(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                return {"action": "error", "message": "Unauthorized"}
            
            incident_id = data.get('incident_id', None)
            
            get_dispatches = sync_to_async(repo.get_dispatch_by_incident)
            dispatches = await get_dispatches(incident_id)
            dispatches = convert_for_json(dispatches)
            
            return {
                "action": "get_incident_dispatches_response",
                "dispatches": dispatches
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= VEHICLE MANAGEMENT =============

    async def action_list_vehicles(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                return {"action": "error", "message": "Unauthorized"}
            
            status = data.get('status', None)
            if status:
                status = status.upper()
            
            get_vehicles = sync_to_async(repo.get_all_vehicles)
            vehicles = await get_vehicles(status)
            vehicles = convert_for_json(vehicles)
            
            return {
                "action": "list_vehicles_response",
                "vehicles": vehicles,
                "count": len(vehicles)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_create_vehicle(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            required_fields = ['station_id', 'capacity', 'lat', 'lng']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            create_veh = sync_to_async(repo.create_vehicle)
            vehicle = await create_veh(
                station_id=data['station_id'],
                capacity=data['capacity'],
                lat=data['lat'],
                lng=data['lng']
            )
            vehicle = convert_for_json(vehicle)
            
            await self._broadcast("group_ADMIN", vehicle, "vehicle_created")
            await self._broadcast("group_DISPATCHER", vehicle, "vehicle_created")

            return {
                "action": "create_vehicle_response",
                "message": "Vehicle created successfully",
                "vehicle": vehicle
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_delete_vehicle(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            vehicle_id = data.get('vehicle_id', None)
            if vehicle_id is None:
                return {"action": "error", "message": "Missing vehicle_id"}
            
            delete_veh = sync_to_async(repo.delete_vehicle)
            await delete_veh(vehicle_id)
            
            await self._broadcast("group_ADMIN", {"vehicle_id": vehicle_id}, "vehicle_deleted")
            await self._broadcast("group_DISPATCHER", {"vehicle_id": vehicle_id}, "vehicle_deleted")

            return {
                "action": "delete_vehicle_response",
                "message": "Vehicle deleted successfully"
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= STATION MANAGEMENT =============

    async def action_list_stations(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                return {"action": "error", "message": "Unauthorized"}
            
            get_stations = sync_to_async(repo.get_all_stations)
            stations = await get_stations()
            stations = convert_for_json(stations)
            
            return {
                "action": "list_stations_response",
                "stations": stations,
                "count": len(stations)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_create_station(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            required_fields = ['type', 'zone', 'lat', 'lng']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            valid_types = ['FIRE', 'POLICE', 'MEDICAL']
            if data['type'].upper() not in valid_types:
                return {"action": "error", "message": "Invalid type"}
            
            create_stn = sync_to_async(repo.create_station)
            station = await create_stn(
                station_type=data['type'].upper(),
                zone=data['zone'],
                lat=data['lat'],
                lng=data['lng']
            )
            station = convert_for_json(station)
            
            await self._broadcast("group_ADMIN", station, "station_created")
            
            return {
                "action": "create_station_response",
                "message": "Station created successfully",
                "station": station
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= USER MANAGEMENT =============

    async def action_list_admins(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            get_admins = sync_to_async(repo.get_all_admin_users)
            admins = await get_admins()
            admins = convert_for_json(admins)
            
            return {
                "action": "list_admins_response",
                "admins": admins,
                "count": len(admins)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_create_admin(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            required_fields = ['email', 'password', 'name']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            role = data.get('role', 'DISPATCHER').upper()
            if role not in ['ADMIN', 'DISPATCHER', 'RESPONDER']:
                return {"action": "error", "message": "Invalid role"}
            
            password_hash = hash_password(data['password'])
            
            create_adm = sync_to_async(repo.create_admin_user)
            admin = await create_adm(
                email=data['email'],
                password_hash=password_hash,
                name=data['name'],
                role=role
            )
            
            if admin and 'password' in admin:
                admin.pop('password')
            
            await self._broadcast("group_ADMIN", admin, "admin_created")

            return {
                "action": "create_admin_response",
                "message": "User created successfully",
                "admin": admin
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= REPORTER ACTIONS =============

    async def action_report_incident(self, data):
        try:
            required_fields = ['type', 'lat', 'lng', 'severity_level']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            valid_types = ['FIRE', 'POLICE', 'MEDICAL']
            if data['type'].upper() not in valid_types:
                return {"action": "error", "message": "Invalid type"}
            
            valid_severity = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
            if data['severity_level'].upper() not in valid_severity:
                return {"action": "error", "message": "Invalid severity_level"}
            
            create_inc = sync_to_async(repo.create_incident)
            incident = await create_inc(
                incident_type=data['type'].upper(),
                location_lat=data['lat'],
                location_lng=data['lng'],
                severity=data['severity_level'].upper(),
                description=data.get('description', '')
            )
            incident = convert_for_json(incident)
            
            # Broadcast to admins and dispatchers
            await self._broadcast("group_ADMIN", incident, "new_incident")
            await self._broadcast("group_DISPATCHER", incident, "new_incident")
            await self._broadcast("group_RESPONDER", incident, "new_incident")

            # Create Notification
            create_notif = sync_to_async(repo.create_admin_notification)
            await create_notif(
                title=f"New Incident #{incident['incident_id']} Reported",
                body=f"Type: {incident['type']}, Severity: {incident['severity_level']}. Location: {incident['lat']}, {incident['lng']}"
            )

            
            return {
                "action": "report_incident_response",
                "message": "Incident reported and vehicle auto-assigned successfully",
                "incident": incident
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= RESPONDER ACTIONS =============

    async def action_update_unit_location(self, data):
        try:
            required_fields = ['vehicle_id', 'lat', 'lng']
            for field in required_fields:
                if field not in data:
                    return {"action": "error", "message": f"Missing required field: {field}"}
            
            update_loc = sync_to_async(repo.update_vehicle_location)
            vehicle = await update_loc(
                vehicle_id=data['vehicle_id'],
                lat=data['lat'],
                lng=data['lng']
            )
            vehicle = convert_for_json(vehicle)
            
            # Broadcast location update
            payload = {
                "vehicle_id": vehicle.get("vehicle_id"),
                "lat": vehicle.get("lat"),
                "lng": vehicle.get("lng"),
                "status": vehicle.get("status")
            }
            await self._broadcast("group_ADMIN", payload, "unit_location_updated")
            await self._broadcast("group_DISPATCHER", payload, "unit_location_updated")

            return {
                "action": "update_unit_location_response",
                "message": "Location updated successfully",
                "vehicle": vehicle
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_resolve_incident(self, data):
        try:
            if 'incident_id' not in data:
                return {"action": "error", "message": "Missing incident_id"}
            
            resolve = sync_to_async(repo.resolve_incident)
            incident = await resolve(data['incident_id'])
            incident = convert_for_json(incident)
            
            await self._broadcast("group_ADMIN", incident, "incident_resolved")
            await self._broadcast("group_DISPATCHER", incident, "incident_resolved")

            # Create Admin Notification
            create_admin_notif = sync_to_async(repo.create_admin_notification)
            await create_admin_notif(
                title=f"Incident #{data['incident_id']} Resolved",
                body=f"Incident has been marked as resolved."
            )

            # Create User Notification for responders
            # We notify all responders involved in this incident
            create_user_notif = sync_to_async(repo.create_user_notification)
            await create_user_notif(
                incident_id=data['incident_id'],
                title=f"Incident #{data['incident_id']} Resolved"
            )


            return {
                "action": "resolve_incident_response",
                "message": "Incident resolved successfully",
                "incident": convert_for_json(incident)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_pending_to_on_route(self, data):
        try:
            if not self.user or (self.user['role'] != 'ADMIN' and self.user['role'] != 'RESPONDER'):
                return {"action": "error", "message": "Unauthorized"}

            if "vehicle_id" not in data:
                 return {"action": "error", "message": "please enter vehicle_id"}
                 
            vehicle_id = data.get("vehicle_id")
            
            update_route = sync_to_async(repo.update_vehicles_to_on_route_by_incident)
            get_veh = sync_to_async(repo.get_vehicle_by_id)
            
            await update_route(vehicle_id)
            
            # response uses incident_id
            response_data = {}
            if "incident_id" in data:
                 veh = await get_veh(data["incident_id"]) 
                 response_data = veh
            
            await self._broadcast("group_ADMIN", {"vehicle_id": vehicle_id, "status": "ON_ROUTE"}, "vehicle_status_updated")
            await self._broadcast("group_DISPATCHER", {"vehicle_id": vehicle_id, "status": "ON_ROUTE"}, "vehicle_status_updated")

            return {
                "action": "pending_to_on_route_response",
                "data": convert_decimals(response_data)
            }

        except Exception as e:
            return {"action": "error", "message": str(e)}

    async def action_assign_responder_to_vehicle(self, data):
        try:
            if not self.user or self.user['role'] != 'ADMIN':
                return {"action": "error", "message": "Unauthorized - Admin only"}
            
            assign = sync_to_async(repo.assign_responder_to_vehicle)
            get_u = sync_to_async(repo.get_user_by_user_id)
            get_v = sync_to_async(repo.get_vehicle_by_id)
            
            await assign(data["responder_id"], data["vehicle_id"])
            await self.action_get_responder(data)
            
            usr = await get_u(data["responder_id"])
            if usr and 'password' in usr: usr.pop('password')
            
            vehicle = await get_v(data["vehicle_id"]) 
            
            payload = {
                "responder": convert_for_json(usr),
                "vehicle": convert_for_json(vehicle)
            }
            await self._broadcast("group_ADMIN", payload, "vehicle_assignment_updated")
            await self._broadcast("group_DISPATCHER", payload, "vehicle_assignment_updated")
            
            await self._broadcast(f"user_{data['responder_id']}", payload, "you_are_assigned")

            return {
                "action": "assign_responder_to_vehicle_response",
                "user": convert_for_json(usr),
                "vehicle": convert_for_json(vehicle)
            }
        except Exception as e:
            return {"action": "error", "message": str(e)}

    # ============= NOTIFICATION ACTIONS =============

    async def action_list_admin_notifications(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                 return {"action": "error", "message": "Unauthorized"}
            
            get_notifs = sync_to_async(repo.get_admin_notifications)
            notifications = await get_notifs(limit=50)
            
            return {
                "action": "list_admin_notifications_response",
                "notifications": convert_for_json(notifications)
            }
        except Exception as e:
             return {"action": "error", "message": str(e)}

    async def action_list_user_notifications(self, data):
        try:
             # Regular users (responders)
             if not self.user:
                  return {"action": "error", "message": "Unauthorized"}
             
             get_notifs = sync_to_async(repo.get_user_notifications)
             notifications = await get_notifs(self.user['user_id'], limit=20)
             
             return {
                 "action": "list_user_notifications_response",
                 "notifications": convert_for_json(notifications)
             }
        except Exception as e:
             return {"action": "error", "message": str(e)}


    # ============= NOTIFICATION ACTIONS =============

    async def action_list_admin_notifications(self, data):
        try:
            if not self.user or self.user['role'] not in ['ADMIN', 'DISPATCHER']:
                 return {"action": "error", "message": "Unauthorized"}
            
            get_notifs = sync_to_async(repo.get_admin_notifications)
            notifications = await get_notifs(limit=50)
            
            return {
                "action": "list_admin_notifications_response",
                "notifications": convert_for_json(notifications)
            }
        except Exception as e:
             return {"action": "error", "message": str(e)}

    async def action_list_user_notifications(self, data):
        try:
             # Regular users (responders)
             if not self.user:
                  return {"action": "error", "message": "Unauthorized"}
             
             get_notifs = sync_to_async(repo.get_user_notifications)
             notifications = await get_notifs(self.user['user_id'], limit=20)
             
             return {
                 "action": "list_user_notifications_response",
                 "notifications": convert_for_json(notifications)
             }
        except Exception as e:
             return {"action": "error", "message": str(e)}


    async def action_get_responder(self, data):
        try:
            get_u = sync_to_async(repo.get_user_by_user_id)
            get_user_vehicle = sync_to_async(repo.get_user_vehicle)
            get_user_incident = sync_to_async(repo.get_user_incident)
            
            usr = await get_u(data["responder_id"])
            vehicle = await get_user_vehicle(data["responder_id"])
            incident = await get_user_incident(data["responder_id"])
            if usr and 'password' in usr: usr.pop('password')
        

            res = {
                "action": "get_responder_response",
                "user": convert_for_json(usr),
                "vehicle": convert_for_json(vehicle),
                "incident": convert_for_json(incident)
            }
            print(res)
            
            await self._broadcast(f"user_{data['responder_id']}", res, "get_responder_response")
            
            return res
        except Exception as e:
            return {"action": "error", "message": str(e)}
    
    async def action_dispatch_vehicle(self, data):
        try:    
            await dispatch_vehicle_to_destination(data["vehicle_id"], data["end_lng"], data["end_lat"], data["start_lng"] if data["start_lng"] else None, data["start_lat"] if data["start_lat"] else None)
            
            return {"action": "dispatch_vehicle_response"}
        except Exception as e:
            return {"action": "error", "message": str(e)}