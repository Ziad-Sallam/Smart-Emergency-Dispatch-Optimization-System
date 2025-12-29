import asyncio
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .route_streamer import stream_vehicle_route
from .vehicle_state import get_last_location, get_users_for_vehicle

channel_layer = get_channel_layer()


VEHICLE_TASKS = {}
async def dispatch_vehicle_to_destination(vehicle_id, end_lng, end_lat, start_lng=None, start_lat=None):
    """
    Dispatch a vehicle to a destination. If already moving, cancel previous route and reassign.
    """
    last_location = get_last_location(vehicle_id)
    if not last_location and not start_lng and not start_lat:
        raise ValueError("No last known location for vehicle")

    start = f"{start_lng},{start_lat}" if start_lng and start_lat else f"{last_location['lng']},{last_location['lat']}"
    end = f"{end_lng},{end_lat}"

    print(f"[dispatch] Vehicle {vehicle_id} moving from {start} to {end}")

    # Cancel previous task if exists
    previous_task = VEHICLE_TASKS.get(vehicle_id)
    if previous_task and not previous_task.done():
        previous_task.cancel()
        try:
            await previous_task
        except asyncio.CancelledError:
            print(f"[dispatch] Previous route task for vehicle {vehicle_id} cancelled")

    user_ids = get_users_for_vehicle(vehicle_id)

    # Start a new background route streaming task
    task = asyncio.create_task(
        stream_vehicle_route(
            vehicle_id=vehicle_id,
            user_ids=user_ids,
            start=start,
            end=end
        )
    )

    VEHICLE_TASKS[vehicle_id] = task

