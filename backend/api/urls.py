from rest_framework import routers
from . import views
from .viewsets import CompanyViewSet, AttendeeViewSet, RegistrationViewSet, CertificateViewSet
from django.urls import path, include
from .certificate_api import CertificateDownloadView

router = routers.DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'attendees', AttendeeViewSet)
router.register(r'registrations', RegistrationViewSet)
router.register(r'certificates', CertificateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('certificates/<int:pk>/download/', CertificateDownloadView.as_view(), name='certificate-download'),
]
