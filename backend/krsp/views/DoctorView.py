from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Doctor
from krsp.serializers import DoctorSerializer
from krsp.views.Services import get_avg_rating


class DoctorView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()

    @action(methods=["GET"], detail=False)
    def get_doctors(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        doctors = Doctor.objects.all()
        users = [
            {
                'id': doctor.doctor_id,
                'name': doctor.fk_user.name,
                'image': doctor.fk_user.profile_picture.url,
                'experience': doctor.experience,
                'ratings': get_avg_rating(doctor)
            }
            for doctor in doctors
        ]
        print(users)
        return Response({"users": users}, status=status.HTTP_200_OK)
