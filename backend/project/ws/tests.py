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
        
        # Test sending a message with action
        await communicator.send_json_to({
            "action": "send_message",
            "message": "Hello"
        })
        response = await communicator.receive_json_from()
        
        self.assertEqual(response.get("action"), "message_received")
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

    @patch('ws.ws_jwt_middleware.get_user_by_user_id')
    async def test_private_message(self, mock_get_user):
        # Setup User 1
        user1 = self.user.copy()
        user1['user_id'] = 1
        
        # Setup User 2
        user2 = self.user.copy()
        user2['user_id'] = 2
        user2['email'] = "user2@example.com"
        
        # Mock getting users
        def get_user_side_effect(user_id):
            if user_id == 1:
                return user1
            elif user_id == 2:
                return user2
            return None
        mock_get_user.side_effect = get_user_side_effect
        
        # Connect User 1
        token1 = generate_access_token(user1)
        com1 = WebsocketCommunicator(application, f"ws/chat/?token={token1}")
        await com1.connect()
        
        # Connect User 2
        token2 = generate_access_token(user2)
        com2 = WebsocketCommunicator(application, f"ws/chat/?token={token2}")
        await com2.connect()
        
        # User 1 sends message to User 2
        await com1.send_json_to({
            "action": "send_message",
            "message": "Secret",
            "to_user_id": 2
        })
        
        # User 2 should receive it
        response2 = await com2.receive_json_from()
        self.assertEqual(response2["message"], "Secret")
        self.assertEqual(response2["sender"]["user_id"], 1)
        
        # User 1 should NOT receive it (assuming unicast)
        self.assertTrue(await com1.receive_nothing())
        
        await com1.disconnect()
        await com2.disconnect()

    @patch('app.repo.get_average_response_time')
    async def test_get_analytics(self, mock_get_avg):
        mock_get_avg.return_value = 10.5
        
        # Connect
        token = generate_access_token(self.user)
        communicator = WebsocketCommunicator(application, f"ws/chat/?token={token}")
        await communicator.connect()
        
        # Send analytics request
        await communicator.send_json_to({
            "action": "get_analytics"
        })
        
        # Verify response
        response = await communicator.receive_json_from()
        self.assertEqual(response.get("action"), "analytics_received")
        self.assertIn("analytics", response)
        self.assertEqual(response["analytics"]["average_response_time"], 10.5)
        
        await communicator.disconnect()
