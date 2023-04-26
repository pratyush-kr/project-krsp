from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Appointment
from krsp.serializers import AppointmentSerializer
from krsp.views.Services import get_user_implementation_from_user, get_user_appointment_json, \
    get_user_appointments_by_date


class AppointmentView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()

    @action(methods=["POST"], detail=False)
    def get_appointments(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        user_implementation, user_type = get_user_implementation_from_user(user)
        json_data_todo = get_user_appointment_json(user_type, user)
        json_data_history = get_user_appointment_json(user_type, user, done=True)
        return Response({'todo': json_data_todo, 'history': json_data_history}, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False)
    def update_appointments(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        user_implementation, user_type = get_user_implementation_from_user(user)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        appointment_id = request.data['appointment_id']
        appointment_status = request.data['appointment_status'] is True
        appointment = Appointment.objects.filter(appointment_id=appointment_id).first()
        appointment.done = appointment_status
        appointment.save()
        json_data_todo = get_user_appointment_json(user_type, user)
        json_data_history = get_user_appointment_json(user_type, user, done=True)
        print(json_data_history)
        return Response({'todo': json_data_todo, 'history': json_data_history}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def cancel_appointment(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        user_implementation, user_type = get_user_implementation_from_user(user)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        appointment_id = request.data['appointment_id']
        is_canceled = request.data['is_canceled']
        appointment = Appointment.objects.filter(appointment_id=appointment_id).first()
        appointment.is_canceled = is_canceled
        appointment.save()
        json_data_todo = get_user_appointment_json(user_type, user)
        json_data_history = get_user_appointment_json(user_type, user, done=True)
        return Response({'todo': json_data_todo, 'history': json_data_history}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def get_appointments_by_date(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        user_implementation, user_type = get_user_implementation_from_user(user)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        date = request.data["date"]
        json_data = get_user_appointments_by_date(user_type, user, date)
        return Response(json_data, status=status.HTTP_200_OK)
