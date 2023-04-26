import base64
import datetime

import jwt
import openai
from django.core.files.base import ContentFile
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

from backend.settings import SECRET_JWT_KEY
from krsp.models import User, Doctor, Patient, Appointment, Ratings


def get_user_from_request(request):
    if request is None:
        raise AuthenticationFailed('Unauthenticated')
    user, _ = JWTAuthentication().authenticate(request)
    if not user:
        raise AuthenticationFailed('Unauthenticated')
    return user


def get_user_implementation_from_user(user):
    user_implementation = Doctor.objects.filter(fk_user_id=user.id).first()
    if user_implementation is None:
        user_implementation = Patient.objects.filter(fk_user_id=user.id).first()
    return user_implementation, type(user_implementation)


def get_json_from_appointments(appointments, user_type):
    json_data = []
    if user_type.__name__ == 'Patient':
        json_data = [{
            "id": appointment.appointment_id,
            "message": f"Appointment With Dr. {appointment.fk_doctor.fk_user.first_name}",
            "done": appointment.done,
            "start_time": appointment.time,
            "start_date": appointment.date,
            'user_type': user_type.__name__.lower()
        } for appointment in appointments]
    if user_type.__name__ == 'Doctor':
        json_data = [{
            "id": appointment.appointment_id,
            "message": f"Appointment With {appointment.fk_patient.fk_user.first_name}",
            "done": appointment.done,
            "start_time": appointment.time,
            "start_date": appointment.date,
            "is_canceled": appointment.is_canceled,
            'user_type': user_type.__name__.lower()
        } for appointment in appointments]
    return json_data


def get_user_appointment_json(user_type, user, date=None, done=False):
    json_data = []
    if date is None:
        date = datetime.datetime.now()
    if user_type.__name__ == "Patient":
        user_implementation = Patient.objects.filter(fk_user_id=user.id).first()
        appointments = Appointment.objects.filter(fk_patient_id=user_implementation.patient_id). \
            filter(is_canceled=False).filter(date__lte=date).order_by('-date', '-time').filter(done=done)
        json_data = get_json_from_appointments(appointments, user_type)
    elif user_type.__name__ == "Doctor":
        user_implementation = Doctor.objects.filter(fk_user_id=user.id).first()
        appointments = Appointment.objects.filter(fk_doctor_id=user_implementation.doctor_id). \
            filter(is_canceled=False).filter(date__lte=date).order_by('-date', '-time').filter(done=done)
        json_data = get_json_from_appointments(appointments, user_type)
    return json_data


def get_user_appointments_by_date(user_type, user, date=None, done=False):
    json_data = []
    if date is None:
        date = datetime.datetime.now()
    if user_type.__name__ == "Patient":
        user_implementation = Patient.objects.filter(fk_user_id=user.id).first()
        appointments = Appointment.objects.filter(fk_patient_id=user_implementation.patient_id). \
            filter(is_canceled=False).filter(date=date).order_by('-date', '-time').filter(done=done)
        json_data = get_json_from_appointments(appointments, user_type)
    elif user_type.__name__ == "Doctor":
        user_implementation = Doctor.objects.filter(fk_user_id=user.id).first()
        appointments = Appointment.objects.filter(fk_doctor_id=user_implementation.doctor_id). \
            filter(is_canceled=False).filter(date=date).order_by('-date', '-time').filter(done=done)
        json_data = get_json_from_appointments(appointments, user_type)
    return json_data


def get_image_from_base64(base64_img):
    format_, img_str = base64_img.split(';base64,')
    ext = format_.split('/')[-1]
    data = ContentFile(base64.b64decode(img_str), name='profile.' + ext)
    return data


def get_avg_rating(doctor):
    ratings = Ratings.objects.filter(fk_doctor_id=doctor.doctor_id)
    star_sum = 0
    n = len(ratings)
    if n == 0:
        n = 1
    for rating in ratings:
        star_sum += rating.ratings

    return star_sum / n


def generate_prompt(prompt_):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=prompt_,
        max_tokens=150,
        stop="bye"

    )
    return response.choices[0]['message']['content']
