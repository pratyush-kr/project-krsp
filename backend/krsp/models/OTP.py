from django.db import models

from krsp.models.User import User


class OTP(models.Model):
    otp_id = models.AutoField(primary_key=True)
    otp = models.CharField(max_length=4, blank=False, null=False)
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, default=1)
    email = models.EmailField()
    verified = models.BooleanField(blank=False, null=False, default=False)
    used = models.BooleanField(blank=False, null=False, default=False)
    create_time = models.DateTimeField()
    expiry_time = models.DateTimeField()

    def __str__(self):
        return self.otp_id
