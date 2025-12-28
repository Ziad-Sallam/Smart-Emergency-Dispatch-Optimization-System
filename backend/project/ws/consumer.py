from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the connection
        user = self.scope["user"]
        if user is None:
            await self.close()
            return
        await self.accept()

    async def disconnect(self, close_code):
        # Handle disconnect
        pass

    async def receive(self, text_data):
        # Receive message from client
        data = json.loads(text_data)
        message = data.get("message", "")
        
        user = self.scope.get("user")
        sender_info = {}
        if user:
            sender_info = {
                "user_id": user.get("user_id"),
                "name": user.get("name"),
                "email": user.get("email")
            }

        # Example: echo message back with sender info
        await self.send(text_data=json.dumps({
            "message": message,
            "sender": sender_info
        }))
    
    
