from django.db import models


class Order(models.Model):
    # order_product = models.CharField(max_length=100)
    order_user_name = models.CharField(max_length=100)
    order_amount = models.CharField(max_length=25)
    order_payment_id = models.CharField(max_length=100)
    isPaid = models.BooleanField(default=False)
    order_date = models.DateTimeField(auto_now=True)
    order_email = models.EmailField(max_length=100)
    order_appointment_date = models.CharField(max_length=20)
    order_appointment_time = models.CharField(max_length=20)
    order_contact = models.CharField(max_length=10)

    def __str__(self):
        return self.order_user_name
