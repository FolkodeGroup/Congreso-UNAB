from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DisertanteViewSet, VerificarDNIView, ProgramaViewSet, RegistroEmpresasView, RegistroParticipantesView, InscripcionViewSet, RegistroRapidoView, EmpresaViewSet, CargaMasivaAsistentesView, EnvioMasivoEmailsView, ActualizarDNIView
from .qr_views import GenerateStaticQRView

# Se crea un router para registrar los ViewSets
router = DefaultRouter()
router.register(r'disertantes', DisertanteViewSet, basename='disertante')
router.register(r'programa', ProgramaViewSet, basename='programa')
router.register(r'empresas', EmpresaViewSet, basename='empresa')

# Las URLs de la API son determinadas automáticamente por el router
urlpatterns = [
    path('', include(router.urls)),
    path('verificar-dni/', VerificarDNIView.as_view(), name='verificar-dni'),
    path('generar-qrs/', GenerateStaticQRView.as_view(), name='generar-qrs'),
    path('registro-empresas/', RegistroEmpresasView.as_view({'post': 'create'}), name='registro-empresas'),
    path('inscripcion/', InscripcionViewSet.as_view({'post': 'create'}), name='inscripcion-individual'),
    path('inscripcion-grupal/', RegistroParticipantesView.as_view({'post': 'create'}), name='inscripcion-grupal'),
    path('participantes/', RegistroParticipantesView.as_view({'get': 'list', 'post': 'create'}), name='participantes'),
    path('registro-rapido/', RegistroRapidoView.as_view({'post': 'create'}), name='registro-rapido'),
    path('carga-masiva/', CargaMasivaAsistentesView.as_view(), name='carga-masiva'),
    path('envio-masivo-emails/', EnvioMasivoEmailsView.as_view(), name='envio-masivo-emails'),
    path('actualizar-dni/', ActualizarDNIView.as_view(), name='actualizar-dni'),
]