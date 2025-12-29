import asyncio
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from .map_routing import get_route
from .vehicle_state import set_last_location  # Import the last location setter

channel_layer = get_channel_layer()

import asyncio
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from .map_routing import get_route
from .vehicle_state import set_last_location

channel_layer = get_channel_layer()

async def stream_vehicle_route(vehicle_id, user_ids, start, end, interval=5):
    try:
        route_points = await sync_to_async(get_route)(start, end)
        print(f"[stream] Vehicle {vehicle_id} route points:", route_points)

        for lng, lat in route_points:
            payload = {
                "action": "vehicle_location_update",
                "vehicle_id": vehicle_id,
                "lat": lat,
                "lng": lng
            }

            # Send to vehicle group
            await channel_layer.group_send(
                f"vehicle_{vehicle_id}",
                {"type": "vehicle_update", "data": payload}
            )

            # Send to all monitoring users
            for user_id in user_ids:
                await channel_layer.group_send(
                    f"user_{user_id}",
                    {"type": "vehicle_update", "data": payload}
                )

            # Save last location asynchronously
            await sync_to_async(set_last_location)(vehicle_id, lat, lng)

            # Wait before next point
            await asyncio.sleep(interval)

        print(f"[stream] Finished streaming route for vehicle {vehicle_id}")

    except asyncio.CancelledError:
        print(f"[stream] Streaming for vehicle {vehicle_id} cancelled")
        # Optional: send notification to users that route was cancelled
        cancel_payload = {
            "action": "vehicle_route_cancelled",
            "vehicle_id": vehicle_id
        }
        for user_id in user_ids:
            await channel_layer.group_send(
                f"user_{user_id}",
                {"type": "vehicle_update", "data": cancel_payload}
            )
        raise