from django.contrib import admin

# Register your tests_models here.
from krsp.models import *

admin.site.register(Appointment)
admin.site.register(Chat)
admin.site.register(ChatRoom)
admin.site.register(Doctor)
admin.site.register(InfoPage)
admin.site.register(MedicalHistory)
admin.site.register(Order)
admin.site.register(OTP)
admin.site.register(Patient)
admin.site.register(Ratings)
admin.site.register(Scheme)
admin.site.register(User)
