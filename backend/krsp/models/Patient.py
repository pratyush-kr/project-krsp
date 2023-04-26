from django.db import models

from krsp.models.User import User


class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE)
    create_date = models.DateField(default=None)
    create_time = models.TimeField(default=None)
