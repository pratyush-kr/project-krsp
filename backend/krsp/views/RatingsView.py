from django.db import IntegrityError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from krsp.models import Ratings
from krsp.serializers import RatingsSerializer
from krsp.views.Services import get_user_from_request, get_user_implementation_from_user


class RatingsView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RatingsSerializer
    queryset = Ratings.objects.all()

    @action(methods=["POST"], detail=False)
    def create_review(self, request):
        user, token = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        doctor_id = request.data['doctor_id']
        rating = request.data['rating']
        comment = request.data['comment']
        patient, user_type = get_user_implementation_from_user(user)
        if user_type.__name__ == "Doctor":
            return Response({"msg": "doctors cant rate"}, status=status.HTTP_200_OK)
        try:
            Ratings.objects.create(fk_doctor_id=doctor_id, fk_patient_id=patient.patient_id, ratings=rating,
                                   comment=comment)
        except IntegrityError:
            return Response({"msg": "already reviewed"}, status=status.HTTP_226_IM_USED)
        return Response({"msg": "created"}, status=status.HTTP_201_CREATED)
