from django.contrib import admin

# Register your models here.
from krsp.models import *

admin.site.register(Appointment)
admin.site.register(Doctor)
admin.site.register(Order)
admin.site.register(Patient)
admin.site.register(User)
