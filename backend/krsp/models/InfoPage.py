from django.db import models


class InfoPage(models.Model):
    pageId = models.AutoField(primary_key=True)
    page = models.TextField(max_length=100000)
    page_name = models.CharField(max_length=100, unique=True)
