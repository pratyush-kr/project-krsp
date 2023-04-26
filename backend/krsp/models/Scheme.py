from django.db import models


class Scheme(models.Model):
    scheme_id = models.AutoField(primary_key=True)
    duration = models.IntegerField()
    cost = models.IntegerField()
    text = models.CharField(max_length=100)
    scheme_name = models.CharField(max_length=50)
