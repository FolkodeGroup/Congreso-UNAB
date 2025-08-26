from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisertanteViewSet, InscripcionViewSet, CheckInView, ProgramaViewSet

# Se crea un router para registrar los ViewSets
router = DefaultRouter()
router.register(r'disertantes', DisertanteViewSet, basename='disertante')
router.register(r'inscripcion', InscripcionViewSet, basename='inscripcion')
router.register(r'programa', ProgramaViewSet, basename='programa')

# Las URLs de la API son determinadas automáticamente por el router
urlpatterns = [
    path('', include(router.urls)),
    path('checkin/', CheckInView.as_view(), name='checkin'),
]
