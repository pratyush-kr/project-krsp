import datetime
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMultiAlternatives
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import viewsets, status
from rest_framework.authentication import get_authorization_header
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from backend.settings import EMAIL_HOST_USER
from krsp.models import User, OTP
from krsp.serializers import UserSerializer
from krsp.views.Services import get_user_from_request, get_image_from_base64
from django.utils import timezone
import numpy as np
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


class UserView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(methods=["GET"], detail=False, permission_classes=[AllowAny])
    def verify(self, request):
        token = get_authorization_header(request).decode().split(" ")[1]
        # user = User.objects.filter(name="Guest User").first()
        # refresh_token = RefreshToken.for_user(user)
        # access_token = refresh_token.access_token
        # token = str(access_token)
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)
        print(user.name)
        return Response({"data": token}, status=status.HTTP_200_OK)

    @action(methods=["GET", "POST"], detail=False)
    def get_user(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(methods=["POST"], detail=False)
    def logout(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

    @action(methods=["POST"], detail=False)
    def login(self, request):
        guest_user, _ = JWTAuthentication().authenticate(request)
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()
        try:
            if user is None:
                raise AuthenticationFailed('User not found!')
            if not user.check_password(password):
                raise AuthenticationFailed('Incorrect password!')
        except AuthenticationFailed as error:
            return Response({'msg': str(error)}, status=status.HTTP_403_FORBIDDEN)
        token = f'{RefreshToken.for_user(user).access_token}'
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {'jwt': token, 'name': user.name, 'email': user.email,
                         'profile_picture': user.profile_picture.url, 'is_doctor': user.is_doctor}
        return response

    @action(methods=["POST"], detail=False)
    def check_token(self, request):
        token = request.COOKIES.get('jwt')
        user = get_user_from_request(token)
        return Response({'email': user.email, 'id': user.id, 'name': user.name})

    @action(methods=["POST"], detail=False)
    def update_user(self, request):
        user = get_user_from_request(request)
        email = request.data["email"]
        phone = request.data["phone"]
        dob = request.data["dob"]
        user.email = email
        user.phone = phone
        user.dob = dob
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(methods=["POST"], detail=False)
    def verify_email(self, request):
        email = request.data['email']
        user = User.objects.filter(email=email).first()
        redirect = False
        if user is not None:
            redirect = True
        return Response({'redirect': redirect})

    @action(methods=["POST"], detail=False)
    def send_otp_to_email(self, request):
        try:
            email = request.data['email']
        except MultiValueDictKeyError:
            return Response({'msg': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email)
        if not user.exists():
            return Response({"msg": "Can't find the email"}, status=status.HTTP_401_UNAUTHORIZED)
        otp = np.random.randint(1000, 9999)
        create_time = timezone.now()
        expiry_time = create_time + datetime.timedelta(minutes=5)
        user = user.first()
        OTP.objects.create(otp=otp, fk_user_id=user.id, email=email, verified=False, create_time=create_time,
                           expiry_time=expiry_time)
        subject = f"krsp | Your OTP"
        message = f"""
            Hi, {user.name} we got a request to reset your password!
               your OTP is {otp}, this code is valid for 5 minutes.
               if you think this is a mistake contact us leapon.support@leapon.tech
        """
        msg = EmailMultiAlternatives(
            subject,
            message,
            from_email=EMAIL_HOST_USER,
            to=[email]
        )
        msg.send()
        return Response({'redirect': True}, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def verify_otp(self, request):
        try:
            email = request.data['email']
            otp = request.data['otp']
        except MultiValueDictKeyError:
            return Response({'msg': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
        otp_objects = OTP.objects.filter(email=email, otp=otp).order_by('-otp_id')
        if not otp_objects.exists():
            return Response({'msg': 'otp is not correct'}, status=status.HTTP_401_UNAUTHORIZED)
        if timezone.now() > otp_objects[0].expiry_time:
            return Response({'msg': 'otp expired'}, status=status.HTTP_403_FORBIDDEN)
        otp_object = OTP.objects.filter(email=email, otp=otp).order_by('-otp_id').first()
        otp_object.verified = True
        otp_object.save()
        return Response({'otp': 'verified'}, status=status.HTTP_202_ACCEPTED)

    @action(methods=['post'], detail=False)
    def update_password(self, request):
        try:
            email = request.data['email']
            otp = request.data['otp']
            password = request.data['password']
        except MultiValueDictKeyError:
            return Response({'msg': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({'msg': 'password length is less than eight characters'})
        password = make_password(password)
        user = User.objects.filter(email=email).first()
        otp_object = OTP.objects.filter(email=email, otp=otp).order_by('-otp_id').first()
        if not otp_object.used and timezone.now() < otp_object.expiry_time:
            otp_object.used = True
            otp_object.save()
            user.password = password
            user.save()
            return Response({'msg': 'password changed'}, status=status.HTTP_202_ACCEPTED)
        elif timezone.now() < otp_object.expiry_time:
            return Response({'msg': 'otp expired'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'msg': 'otp already used'}, status=status.HTTP_410_GONE)

    @action(methods=["POST"], detail=False)
    def create_user(self, request):
        data = request.data
        img_base64 = request.data['profile_picture']
        user = User.objects.create(dob=data['dob'], email=data['email'], first_name=data['first_name'],
                                   gender=data['gender'], last_name=data['last_name'], name=data['name'],
                                   password=make_password(data['password']), phone=data['phone'],
                                   profile_picture=get_image_from_base64(img_base64), username=data['username'],
                                   is_doctor=data['is_doctor'] == "true")
        return Response({"id": user.id}, status=status.HTTP_201_CREATED)

    @action(methods=['GET'], detail=False, permission_classes=[AllowAny])
    def get_token(self, request):
        user = User.objects.filter(name="Guest User").first()
        token = f'{RefreshToken.for_user(user).access_token}'
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        if user.profile_picture:
            dp = user.profile_picture.url
        else:
            dp = "/no_image"
        response.data = {'jwt': token, 'name': user.name, 'email': user.email, 'profile_picture': dp,
                         'is_doctor': user.is_doctor}
        return response

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def verify_token(self, request):
        auth_obj = JWTAuthentication()
        user, _ = auth_obj.authenticate(request)
        if user is not None and user.name == "Guest User":
            return Response({"token": "verified"}, status=status.HTTP_200_OK)
        return Response({"token": "Not verified"}, status=status.HTTP_200_OK)
