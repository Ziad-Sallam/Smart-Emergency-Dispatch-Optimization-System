import redis
import json

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

# Last known vehicle location
def set_last_location(vehicle_id, lat, lng):
    r.set(f"vehicle:last_location:{vehicle_id}", json.dumps({"lat": lat, "lng": lng}))

def get_last_location(vehicle_id):
    data = r.get(f"vehicle:last_location:{vehicle_id}")
    return json.loads(data) if data else None

# Users monitoring vehicle
def add_vehicle_user(vehicle_id, user_id):
    r.sadd(f"vehicle:{vehicle_id}:users", user_id)

def remove_vehicle_user(vehicle_id, user_id):
    r.srem(f"vehicle:{vehicle_id}:users", user_id)

def get_users_for_vehicle(vehicle_id):
    return [int(u) for u in r.smembers(f"vehicle:{vehicle_id}:users")]

def set_vehicle_route(vehicle_id, route):
    r.set(f"vehicle:route:{vehicle_id}", json.dumps(route))
    r.set(f"vehicle:route_index:{vehicle_id}", 0)

def get_vehicle_route(vehicle_id):
    data = r.get(f"vehicle:route:{vehicle_id}")
    return json.loads(data) if data else None

def set_route_index(vehicle_id, idx):
    r.set(f"vehicle:route_index:{vehicle_id}", idx)

def get_route_index(vehicle_id):
    return int(r.get(f"vehicle:route_index:{vehicle_id}") or 0)