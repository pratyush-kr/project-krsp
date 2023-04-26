from django.db import models

from krsp.models.User import User


class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE)
    experience = models.CharField(max_length=500, default="20 years")
    create_date = models.DateField(default=None)
    create_time = models.TimeField(default=None)
