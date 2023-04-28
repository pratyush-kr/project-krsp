import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async

from krsp.models import Chat


@sync_to_async
def get_user_from_token(token):
    jwt = JWTAuthentication()
    validated_token = jwt.get_validated_token(token)
    user = jwt.get_user(validated_token)
    return user


@sync_to_async
def create_chat(user, message, room_id):
    chats_message = Chat.objects.create(message=message, fk_user_id=user.id, fk_room_id=room_id)
    return chats_message


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.roomGroupName = None

    async def connect(self):
        self.roomGroupName = self.scope['url_route']['kwargs']['room_id']
        print(self.scope['url_route']['kwargs']['room_id'])
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        pass
        # await self.channel_layer.group_discard(
        #     self.roomGroupName,
        #     self.channel_layer
        # )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        token = text_data_json["token"]
        name = text_data_json["name"]
        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "message": message,
                "token": token,
                "name": name
            })

    async def sendMessage(self, event):
        token = event['token']
        user = await get_user_from_token(token)
        message = event['message']
        print(user, message)
        await self.send(text_data=json.dumps({"message": message, "name": user.name}))
