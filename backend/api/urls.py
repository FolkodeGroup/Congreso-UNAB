from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisertanteViewSet, VerificarDNIView, ProgramaViewSet, RegistroEmpresasView, RegistroParticipantesView
from .qr_views import GenerateStaticQRView

# Se crea un router para registrar los ViewSets
router = DefaultRouter()
router.register(r'disertantes', DisertanteViewSet, basename='disertante')
router.register(r'programa', ProgramaViewSet, basename='programa')

# Las URLs de la API son determinadas automáticamente por el router
urlpatterns = [
    path('', include(router.urls)),
    path('verificar-dni/', VerificarDNIView.as_view(), name='verificar-dni'),
    path('generar-qrs/', GenerateStaticQRView.as_view(), name='generar-qrs'),
    path('registro-empresas/', RegistroEmpresasView.as_view({'post': 'create'}), name='registro-empresas'),
    path('registro-participantes/', RegistroParticipantesView.as_view({'post': 'create'}), name='registro-participantes'),
]
