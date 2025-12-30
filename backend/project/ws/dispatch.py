import asyncio
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

from .route_streamer import stream_vehicle_route
from .vehicle_state import get_last_location, get_users_for_vehicle
from .map_routing import get_route

channel_layer = get_channel_layer()

# Track running vehicle tasks for cancellation
VEHICLE_TASKS = {}


async def dispatch_vehicle_to_destination(
    vehicle_id,
    end_lng,
    end_lat,
    start_lng=None,
    start_lat=None
):
    """
    Dispatch a vehicle to a destination.
    Cancels previous movement if exists.
    Broadcasts route to all subscribed users.
    Starts streaming the vehicle movement.
    """

    # --- Determine start location ---
    last_location = get_last_location(vehicle_id)
    if not last_location and not (start_lng and start_lat):
        raise ValueError(f"No last known location for vehicle {vehicle_id}")

    start = (
        f"{start_lng},{start_lat}" if start_lng and start_lat
        else f"{last_location['lng']},{last_location['lat']}"
    )
    end = f"{end_lng},{end_lat}"

    print(f"[dispatch] Vehicle {vehicle_id} moving from {start} to {end}")

    # --- Cancel previous task if it exists ---
    previous_task = VEHICLE_TASKS.get(vehicle_id)
    if previous_task and not previous_task.done():
        previous_task.cancel()
        try:
            await previous_task
        except asyncio.CancelledError:
            print(f"[dispatch] Previous route cancelled for vehicle {vehicle_id}")

    # --- Get the route (sync function via async) ---
    route = await sync_to_async(get_route)(start, end)

    # --- Broadcast full route to all subscribed users ---
    await channel_layer.group_send(
        f"vehicle_{vehicle_id}",
        {
            "type": "vehicle.route",  # maps to vehicle_route() in consumer
            "vehicle_id": vehicle_id,
            "route": route,
            "start": start,
            "end": end,
        }
    )

    # --- Start streaming vehicle movement ---
    task = asyncio.create_task(
        stream_vehicle_route(
            vehicle_id=vehicle_id,
            user_ids=get_users_for_vehicle(vehicle_id),
            start=start,
            end=end
        )
    )

    VEHICLE_TASKS[vehicle_id] = task

    return route
