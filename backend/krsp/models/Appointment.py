from django.db import models
from krsp.models.Patient import Patient
from krsp.models.Doctor import Doctor
from krsp.models.Scheme import Scheme


class Appointment(models.Model):
    appointment_id = models.AutoField(primary_key=True)
    fk_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    fk_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    fk_scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE)
    done = models.BooleanField(default=False)
    is_canceled = models.BooleanField(default=False)
    date = models.DateField()
    time = models.TimeField()
    create_date = models.DateField()
    create_time = models.TimeField()
    update_date = models.DateField()
    update_time = models.TimeField()
