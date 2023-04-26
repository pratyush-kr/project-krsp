from django.db import models

from krsp.models.Patient import Patient
from krsp.models.Doctor import Doctor


class Ratings(models.Model):
    rating_id = models.AutoField(primary_key=True)
    fk_doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    ratings = models.DecimalField(max_digits=2, decimal_places=1)
    fk_patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    comment = models.CharField(max_length=100, null=True, blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["fk_doctor", "fk_patient"], name="unique_key_client_advisor")
        ]
