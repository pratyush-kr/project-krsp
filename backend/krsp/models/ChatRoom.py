from django.db import models


class ChatRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=150)
    create_date = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now_add=True)
