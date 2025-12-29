from django.urls import re_path
from .consumer import ChatConsumer
from .fleet_consumer import FleetConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
    re_path(r"ws/fleet/$", FleetConsumer.as_asgi()),
]
