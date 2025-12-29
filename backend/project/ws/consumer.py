from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
from ws.ws_actions import WSActions
from django.core.serializers.json import DjangoJSONEncoder

class ChatConsumer(AsyncWebsocketConsumer):    
    async def connect(self):
        # Accept the connection
        user = self.scope["user"]
        if user is None:
            await self.close()
            return
            
        # Add to groups
        self.user_group_name = f"user_{user['user_id']}"
        await self.channel_layer.group_add("all_users", self.channel_name)
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        
        # Add to role-based groups
        if 'role' in user:
            role_group = f"group_{user['role'].upper()}"
            self.role_group_name = role_group
            await self.channel_layer.group_add(role_group, self.channel_name)
        
        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user:
            await self.channel_layer.group_discard("all_users", self.channel_name)
            if hasattr(self, 'user_group_name'):
                await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
            if hasattr(self, 'role_group_name'):
                await self.channel_layer.group_discard(self.role_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON"}))
            return

        action = data.get("action")
        if not action:
            await self.send(text_data=json.dumps({"error": "No action specified"}))
            return
        
        # Instantiate actions with scope to access user/auth info AND channel_layer/channel_name
        actions = WSActions(self.scope, self.channel_layer)
        
        # Try to find the handler with 'action_' prefix
        method_name = f"{action}"
        if hasattr(actions, method_name):
            handler = getattr(actions, method_name)
            if asyncio.iscoroutinefunction(handler):
                res = await handler(data)
            else:
                res = handler(data)
            
            # If the handler returns a dict with "action", send it back
            if res:
                # Revised logic for handling response:
                if isinstance(res, dict) and "action" in res:
                     response_payload = res
                else:
                     # Fallback for simple messages or if structure isn't fully defined
                     response_payload = await self.action_send_message(res)
    
                to_user_id = data.get("to_user_id")
                if to_user_id:
                    await self.channel_layer.group_send(
                        f"user_{to_user_id}",
                        {
                            "type": "user_message",
                            "message": response_payload
                        }
                    )
                    # Also send confirmation to sender? 
                    # Usually sender wants immediate feedback.
                    # ws_actions returns feedback as 'res'.
                    # So we should send 'res' to self.
                    await self.send(text_data=json.dumps(response_payload, cls=DjangoJSONEncoder))
                else:
                    await self.send(text_data=json.dumps(response_payload, cls=DjangoJSONEncoder)) 
        else:
            await self.send(text_data=json.dumps({"error": f"Unknown action: {action}"}))

    async def action_send_message(self, data):
        message = data.get("message", "")
        
        user = self.scope.get("user")
        sender_info = {}
        if user:
            sender_info = {
                "user_id": user.get("user_id"),
                "name": user.get("name"),
                "email": user.get("email")
            }

        return {
            "action": "message_received",
            "message": message,
            "sender": sender_info
        }

    async def vehicle_update(self, event):
        pass

    async def broadcast_message(self, event):
        """
        Handler for messages broadcast to groups (e.g. from ws_actions).
        The event dict must contain a 'message' key which is the payload to send to the client.
        """
        await self.send(text_data=json.dumps(event["message"], cls=DjangoJSONEncoder))

    async def user_message(self, event):
        await self.send(text_data=json.dumps(event["message"], cls=DjangoJSONEncoder))
    
    
