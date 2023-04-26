from django.db import models
from krsp.models.Patient import Patient


class MedicalHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    fk_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    details = models.CharField(max_length=2048)
    create_date = models.DateField(default=None)
    create_time = models.TimeField(default=None)
