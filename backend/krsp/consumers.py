import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Chat


async def get_user_from_token(token):
    try:
        user = JWTAuthentication().get_user(validated_token=token)
        return user
    except Exception as e:
        return None


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.roomGroupName = None

    async def connect(self):
        self.roomGroupName = self.scope['url_route']['kwargs']['room_id']
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_layer
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "message": message,
                "username": username,
            })

    async def send_message(self, event):
        token = event['token']
        user = await get_user_from_token(token)
        message = event["message"]
        room_id = event['room_id']
        chats_message = Chat.objects.create(message=message, fk_user_id=user.id, room_id=room_id)
        chats_message.save()
        await self.send(text_data=json.dumps({"message": message, "username": user.name}))

