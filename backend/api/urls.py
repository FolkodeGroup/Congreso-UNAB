from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisertanteViewSet, InscripcionViewSet, VerificarDNIView, ProgramaViewSet, RegistroRapidoView
from .qr_views import GenerateStaticQRView

# Se crea un router para registrar los ViewSets
router = DefaultRouter()
router.register(r'disertantes', DisertanteViewSet, basename='disertante')
router.register(r'inscripcion', InscripcionViewSet, basename='inscripcion')
router.register(r'programa', ProgramaViewSet, basename='programa')
router.register(r'registro-rapido', RegistroRapidoView, basename='registro-rapido')

# Las URLs de la API son determinadas automáticamente por el router
urlpatterns = [
    path('', include(router.urls)),
    path('verificar-dni/', VerificarDNIView.as_view(), name='verificar-dni'),
    path('generar-qrs/', GenerateStaticQRView.as_view(), name='generar-qrs'),
]
