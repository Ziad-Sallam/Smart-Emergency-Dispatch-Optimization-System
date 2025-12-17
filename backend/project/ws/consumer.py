from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the connection
        await self.accept()

    async def disconnect(self, close_code):
        # Handle disconnect
        pass

    async def receive(self, text_data):
        # Receive message from client
        data = json.loads(text_data)
        message = data.get("message", "")

        # Example: echo message back
        await self.send(text_data=json.dumps({
            "message": message
        }))
