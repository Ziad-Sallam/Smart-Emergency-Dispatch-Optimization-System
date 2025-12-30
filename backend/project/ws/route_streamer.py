# route_streamer.py
import asyncio
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from .map_routing import get_route
from .vehicle_state import set_last_location, set_vehicle_route, set_route_index

channel_layer = get_channel_layer()

async def stream_vehicle_route(vehicle_id, user_ids, start, end, interval=5):
    try:
        route_points = await sync_to_async(get_route)(start, end)

        set_vehicle_route(vehicle_id, route_points)

        for idx, (lng, lat) in enumerate(route_points):
            set_route_index(vehicle_id, idx)

            payload = {
                "action": "vehicle_location_update",
                "vehicle_id": vehicle_id,
                "lat": lat,
                "lng": lng
            }

            await channel_layer.group_send(
                f"vehicle_{vehicle_id}",
                {"type": "vehicle_update", "data": payload}
            )

            for user_id in user_ids:
                await channel_layer.group_send(
                    f"user_{user_id}",
                    {"type": "vehicle_update", "data": payload}
                )

            await sync_to_async(set_last_location)(vehicle_id, lat, lng)
            await asyncio.sleep(interval)

    except asyncio.CancelledError:
        print(f"[stream] Vehicle {vehicle_id} route cancelled")
        raise
