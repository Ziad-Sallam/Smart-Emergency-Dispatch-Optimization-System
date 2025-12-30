from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.serializers.json import DjangoJSONEncoder
import asyncio
from .route_streamer import stream_vehicle_route
from .vehicle_state import add_vehicle_user
from .vehicle_state import get_vehicle_route, get_last_location

class FleetConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("Connected to FleetConsumer")
        self.joined_groups = set()

        user = self.scope["user"]
        if not user:
            print("herererer")
            await self.close()
            return

        self.user_id = user["user_id"]
        self.user_group = f"user_{self.user_id}"
        

        await self.channel_layer.group_add(self.user_group, self.channel_name)
        self.joined_groups.add(self.user_group)

        await self.accept()

        await self.send_json({
            "action": "connected",
            "user_id": self.user_id
        })

    async def disconnect(self, close_code):
        for group in self.joined_groups:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        if action == "subscribe_vehicle":
            await self.subscribe_vehicle(data)
        elif action == "unsubscribe_vehicle":
            await self.unsubscribe_vehicle(data)
        elif action == "start_vehicle_route":
            await self.start_vehicle_route(data)
        else:
            await self.send_json({"error": "Unknown action"})


    async def subscribe_vehicle(self, data):
        vehicle_id = data.get("vehicle_id")
        if not vehicle_id:
            return

        group = f"vehicle_{vehicle_id}"
        await self.channel_layer.group_add(group, self.channel_name)
        self.joined_groups.add(group)

        # Track user in Redis
        add_vehicle_user(vehicle_id, self.user_id)

        # --- Send current route if exists ---
        route = get_vehicle_route(vehicle_id)
        if route:
            last_location = get_last_location(vehicle_id)
            start = f"{last_location['lng']},{last_location['lat']}" if last_location else None
            end = route[-1] if isinstance(route, list) else None  # last point as end
            await self.send_json({
                "action": "vehicle_route",
                "vehicle_id": vehicle_id,
                "route": route,
                "start": start,
                "end": end,
            })

        await self.send_json({
            "action": "vehicle_subscribed",
            "vehicle_id": vehicle_id
        })


    async def unsubscribe_vehicle(self, data):
        vehicle_id = data.get("vehicle_id")
        group = f"vehicle_{vehicle_id}"

        await self.channel_layer.group_discard(group, self.channel_name)
        self.joined_groups.discard(group)

        # Remove user from Redis
        remove_vehicle_user(vehicle_id, self.user_id)

        await self.send_json({
            "action": "vehicle_unsubscribed",
            "vehicle_id": vehicle_id
        })

    async def vehicle_update(self, event):
        await self.send_json(event["data"])

    async def send_json(self, payload):
        await self.send(
            text_data=json.dumps(payload, cls=DjangoJSONEncoder)
        )

    async def vehicle_route(self, event):
        """
        Receives full route when vehicle is dispatched
        """
        await self.send_json({
            "action": "vehicle_route",
            "vehicle_id": event["vehicle_id"],
            "route": event["route"],
            "start": event["start"],
            "end": event["end"],
        })



    async def start_vehicle_route(self, data):
        vehicle_id = data.get("vehicle_id")
        start = data.get("start") 
        end = data.get("end")      

        if not all([vehicle_id, start, end]):
            await self.send_json({"error": "Missing parameters"})
            return

        user_ids = [self.user_id]

        asyncio.create_task(
            stream_vehicle_route(
                vehicle_id=vehicle_id,
                user_ids=user_ids,
                start=start,
                end=end
            )
        )

        await self.send_json({
            "action": "route_started",
            "vehicle_id": vehicle_id
        })
