import datetime
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Chat, User, ChatRoom
from krsp.serializers import ChatSerializer
from krsp.views.Services import generate_prompt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from backend.settings import PROMPT


class ChatView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    @action(methods=["POST"], detail=False)
    def load_rooms(self, request):
        auth_user, _ = JWTAuthentication().authenticate(request)
        if auth_user.name == "Guest User":
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        rooms = ChatRoom.objects.filter(Q(name__startswith=f'{auth_user.id}&') | Q(name__endswith=f'&{auth_user.id}'))
        room_names = rooms.values_list('name', flat=True).order_by('update_time').distinct()
        user_ids = []
        for room_name in room_names:
            ids = room_name.split('&')
            user_ids += [ids[0]] if f'{auth_user.id}' == ids[1] else [ids[1]]
        users = User.objects.filter(id__in=user_ids)
        data = []
        for user in users:
            room = rooms.filter(Q(name__startswith=f'{user.id}&') | Q(name__endswith=f'&{user.id}')).first()
            chat = Chat.objects.filter(fk_room=room.room_id).order_by('-date', '-time').first()
            data += [{
                'user_id': user.id,
                'name': user.name,
                'last_message': chat.message if chat else "Start a chat...",
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
                "room_id": chat.fk_room_id if chat else None
            }]
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def load_chats(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        room_id = request.data['room_id']
        chats = Chat.objects.filter(fk_room_id=room_id)
        data = []
        for chat_data in chats:
            data += [{
                "message": chat_data.message,
                "date": chat_data.date,
                "time": f'{chat_data.time.hour}:{chat_data.time.minute}',
                "name": "You" if user.id == chat_data.fk_user.id else chat_data.fk_user.first_name

            }]
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def send_message(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        message = request.data['message']
        room_id = request.data['room_id']
        Chat.objects.create(fk_user_id=user.id, message=message, fk_room_id=room_id)
        return Response(status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def chat_with_bot(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        message = request.data['message']
        room_id = request.data['room_id']
        room = ChatRoom.objects.filter(room_id=room_id).first()
        room.update_time = datetime.datetime.now()
        room.save()
        Chat.objects.create(fk_user_id=user.id, message=message, fk_room_id=room_id)
        prompt = [PROMPT]
        query = message
        chats = Chat.objects.filter(fk_room_id=room_id)
        prompt += [{'role': 'user', 'content': chat.message} if chat.fk_user.name != 'Chat Bot'
                   else {'role': 'assistant', 'content': chat.message} for chat in chats]
        prompt += [{"role": "user", "content": query}]
        res = generate_prompt(prompt)
        chat = Chat.objects.create(fk_user_id=24, message=res, fk_room_id=room_id)
        return Response({'message': res, 'name': 'Bot', 'date': chat.date,
                         'time': f'{chat.time.hour}:{chat.time.minute}'}, status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False)
    def get_people(self, request):
        auth_user, _ = JWTAuthentication().authenticate(request)
        slug = request.GET.get('slug')
        peoples = []
        users = User.objects.filter(Q(name__icontains=slug) | Q(username__icontains=slug) | Q(email__icontains=slug)) \
            .exclude(Q(id=auth_user.id) | Q(name='admin'))
        for user in users:
            chat = Chat.objects.filter(fk_user_id=user.id, fk_room__chat__fk_user_id=auth_user.id). \
                order_by('-date', '-time').first()
            peoples += [{
                'user_id': user.id,
                'name': user.name,
                'last_message': chat.message if chat else "Start a chat...",
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
                "room_id": chat.fk_room_id if chat else None
            }]
        return Response(data=peoples, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def create_room(self, request):
        auth_user, _ = JWTAuthentication().authenticate(request)
        target_user = request.data['target_user']
        name = f'{auth_user.id}&{target_user}'
        description = request.data['description']
        room = ChatRoom.objects.filter(Q(name=f'{auth_user.id}&{target_user}') |
                                       Q(name=f'{target_user}&{auth_user.id}')).first()
        if room is None:
            room = ChatRoom.objects.create(name=name, description=description)
        return Response(data={'message': 'crated', 'room_id': room.room_id}, status=status.HTTP_201_CREATED)
