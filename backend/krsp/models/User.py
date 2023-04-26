from django.contrib.auth.models import AbstractUser
from django.db import models

from krsp.models.Services import upload_path


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    dob = models.DateField(null=True)
    gender = models.CharField(max_length=8, choices=[('0', 'male'), ('1', 'female'), ('2', 'trans')], null=True)
    phone = models.CharField(max_length=20, null=True)
    USERNAME_FIELDS = ['email', 'username']
    profile_picture = models.ImageField(upload_to=upload_path, null=True, blank=False)
    is_doctor = models.BooleanField(default=False)
    REQUIRED_FIELDS = []

    class Meta:
        app_label = 'krsp'

