from django.db import models
from krsp.models.ChatRoom import ChatRoom
from krsp.models.User import User


class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE)
    fk_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    message = models.CharField(max_length=2000)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
