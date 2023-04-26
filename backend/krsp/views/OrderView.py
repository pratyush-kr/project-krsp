import datetime
import json
import razorpay
from rest_framework.authentication import get_authorization_header
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from krsp.models.Order import Order
from krsp.models import Order as OrderModel
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from krsp.models import Scheme, Appointment
from krsp.serializers import OrderSerializer
from krsp.views.Services import get_user_from_request, get_user_implementation_from_user

PUBLIC_KEY = "rzp_test_8zqflSyFkDEX6n"
SECRET_KEY = "w5MHyGSepMSgAZ3DcL7vXPwN"


class OrderView(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = OrderModel.objects.all()

    @action(methods=["POST"], detail=False)
    def start_payment(self, request):
        user, _ = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        # request.data is coming from frontend
        amount = request.data['amount']
        # name = request.data['name']
        user_name = request.data['userName']
        email = request.data['email']
        appointment_date = request.data['appointment_date']
        appointment_time = request.data['appointment_time']
        contact = request.data['contact']

        # setup razorpay client this is the client to whom user is paying money that's you
        client = razorpay.Client(auth=(PUBLIC_KEY, SECRET_KEY))

        # create razorpay order
        # the amount will come in 'paise' that means if we pass 50 amount will become
        # 0.5 rupees that means 50 paise, so we have to convert it in rupees. So, we will
        # multiply it by 100, so it will be 50 rupees.
        payment = client.order.create({"amount": int(amount.replace("₹", "")) * 100,
                                       "currency": "INR",
                                       "payment_capture": "1"})

        # we are saving an order with isPaid=False because we've just initialized the order
        # we haven't received the money we will handle the payment success in next
        # function
        order = Order.objects.create(order_user_name=user_name,
                                     order_amount=amount,
                                     order_payment_id=payment['id'],
                                     order_email=email,
                                     order_appointment_date=appointment_date,
                                     order_contact=contact,
                                     order_appointment_time=appointment_time
                                     )

        serializer = OrderSerializer(order)

        """order response will be 
        {'id': 17, 
        'order_date': '23 January 2021 03:28 PM', 
        'order_product': '**product name from frontend**', 
        'order_amount': '**product amount from frontend**', 
        'order_payment_id': 'order_G3NhfSWWh5UfjQ', # it will be unique everytime
        'isPaid': False}"""

        data = {
            "payment": payment,
            "order": serializer.data
        }
        return Response(data)

    @action(methods=["POST"], detail=False)
    def handle_payment_success(self, request):
        # request.data is coming from frontend
        res = json.loads(request.data["response"])
        user, token = JWTAuthentication().authenticate(request)
        if user.name == "Guest User":
            return Response({"message": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        print("token", token)

        print(res)

        """res will be:
        {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e', 
        'razorpay_order_id': 'order_G3NhfSWWh5UfjQ', 
        'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
        this will come from frontend which we will use to validate and confirm the payment
        """

        razorpay_order_id = ""
        razorpay_payment_id = ""
        razorpay_signature = ""

        # res.keys() will give us list of keys in res
        for key in res.keys():
            if key == 'razorpay_order_id':
                razorpay_order_id = res[key]
            elif key == 'razorpay_payment_id':
                razorpay_payment_id = res[key]
            elif key == 'razorpay_signature':
                razorpay_signature = res[key]

        # get order by payment_id which we've created earlier with isPaid=False
        order = Order.objects.get(order_payment_id=razorpay_order_id)

        print("---------->", order)

        # we will pass this whole data in razorpay client to verify the payment
        data = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        client = razorpay.Client(auth=(PUBLIC_KEY, SECRET_KEY))

        # checking if the transaction is valid or not by passing above data dictionary in
        # razorpay client if it is "valid" then check will return None
        check = client.utility.verify_payment_signature(data)

        print("<----------------", check)

        if check is False:
            print("Redirect to error url or error page")
            return Response({'error': 'Something went wrong'})

        # if payment is successful that means check is None then we will turn isPaid=True

        order.isPaid = True
        print(order.order_payment_id)
        order.save()
        res_data = {
            'message': 'payment successfully received!'
        }
        user_implementation, user_type = get_user_implementation_from_user(user)
        scheme = Scheme.objects.filter(cost=order.order_amount.replace("₹", "")).first()
        if user_type.__name__ != "Doctor":
            Appointment.objects.create(fk_doctor_id=request.data['doctor_id'], fk_patient_id=user_implementation.patient_id,
                                       fk_scheme_id=scheme.scheme_id, done=False, is_canceled=False,
                                       date=order.order_appointment_date, time=order.order_appointment_time,
                                       create_date=datetime.datetime.now(), create_time=datetime.datetime.now(),
                                       update_date=datetime.datetime.now(), update_time=datetime.datetime.now())
        return Response(res_data)
