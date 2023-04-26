from django.urls import path
from krsp import ChatUser

websocket_urlpatterns = [
    path('ws/chat/<int:room_id>/', ChatUser.as_asgi()),
]