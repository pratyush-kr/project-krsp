from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Patient
from krsp.serializers import PatientSerializer


class PatientView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

    @action(methods=['GET'], detail=False)
    def get_patients(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        data = Patient.objects.all()
        serialized_data = PatientSerializer(data=data, many=True)
        print(serialized_data.is_valid())
        return Response(serialized_data.data, status=status.HTTP_200_OK)
