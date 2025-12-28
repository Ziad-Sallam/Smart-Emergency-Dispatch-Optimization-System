from django.test import TransactionTestCase
from channels.testing import WebsocketCommunicator
from unittest.mock import patch, MagicMock
from project.asgi import application
from app.jwt_utils import generate_access_token
import json

class WebSocketAuthTests(TransactionTestCase):
    def setUp(self):
        self.user = {
            "user_id": 1,
            "role": "ADMIN",
            "email": "test@example.com",
            "name": "Test User"
        }

    @patch('ws.ws_jwt_middleware.get_user_by_user_id')
    async def test_connect_valid_token_and_identify_sender(self, mock_get_user):
        mock_get_user.return_value = self.user
        
        token = generate_access_token(self.user)
        communicator = WebsocketCommunicator(application, f"ws/chat/?token={token}")
        
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)
        
        # Test sending a message and checking identity in response
        await communicator.send_json_to({"message": "Hello"})
        response = await communicator.receive_json_from()
        
        self.assertEqual(response["message"], "Hello")
        self.assertIn("sender", response)
        self.assertEqual(response["sender"]["user_id"], 1)
        self.assertEqual(response["sender"]["name"], "Test User")
        
        await communicator.disconnect()

    async def test_connect_no_token(self):
        communicator = WebsocketCommunicator(application, "ws/chat/")
        
        connected, subprotocol = await communicator.connect()
        self.assertFalse(connected)

    async def test_connect_invalid_token(self):
        communicator = WebsocketCommunicator(application, "ws/chat/?token=invalid")
        
        connected, subprotocol = await communicator.connect()
        self.assertFalse(connected)
