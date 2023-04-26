"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from krsp import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('appointments', views.AppointmentView)
router.register('doctors', views.DoctorView)
router.register('order', views.OrderView)
router.register('patient', views.PatientView)
router.register('user', views.UserView)
router.register('ratings', views.RatingsView)
router.register('chat', views.ChatView)
router.register('info_page', views.InfoPageView)


urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
