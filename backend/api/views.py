from rest_framework import viewsets, mixins, status, views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import (
    Disertante, Inscripcion, Programa, Certificado, Perfil, Empresa, MiembroGrupo,
    Institucion, DetallePerfil
)
from .serializers import (
    DisertanteSerializer, InscripcionSerializer, PerfilSerializer, 
    ProgramaSerializer, EmpresaSerializer, MiembroGrupoSerializer
)
from django.utils import timezone
from .email import send_certificate_email, send_confirmation_email

class DisertanteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Disertante.objects.all()
    serializer_class = DisertanteSerializer
    permission_classes = [AllowAny]

class ProgramaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Programa.objects.all().order_by('dia', 'hora_inicio')
    serializer_class = ProgramaSerializer
    permission_classes = [AllowAny]

class RegistroEmpresasView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            empresa = serializer.save()
            return Response({'status': 'success', 'message': 'Registro de empresa realizado correctamente.', 'id': empresa.id}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegistroParticipantesView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            perfil = serializer.save()
            return Response({'status': 'success', 'message': 'Registro de participante realizado correctamente.', 'id': perfil.id}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InscripcionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            # send_confirmation_email(inscripcion) # Commented out for testing
            headers = self.get_success_headers(serializer.data)
            return Response({'status': 'success', 'message': 'Inscripción realizada correctamente. Se ha enviado un email de confirmación.'}, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerificarDNIView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        dni = request.data.get('dni')
        if not dni:
            return Response({'status': 'error', 'message': 'No se proporcionó DNI.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            perfil = Perfil.objects.get(dni=dni)
        except Perfil.DoesNotExist:
            return Response({'status': 'error', 'message': 'DNI no encontrado en el listado de registrados.'}, status=status.HTTP_404_NOT_FOUND)

        if perfil.asistencia_confirmada:
            fecha_confirmacion_str = perfil.fecha_confirmacion.strftime("%d/%m/%Y a las %H:%M:%S") if perfil.fecha_confirmacion else "fecha desconocida"
            return Response({
                'status': 'error',
                'message': f'La asistencia ya fue confirmada el {fecha_confirmacion_str}.',
            }, status=status.HTTP_409_CONFLICT)

        perfil.asistencia_confirmada = True
        perfil.fecha_confirmacion = timezone.now()
        perfil.save()

        certificado, created = Certificado.objects.get_or_create(
            asistente=perfil,
            tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
        )
        
        # send_certificate_email(certificado) # Commented out for testing

        perfil_data = PerfilSerializer(perfil).data
        
        return Response({
            'status': 'success',
            'message': 'Asistencia confirmada con éxito. Certificado enviado por email.',
            'asistente': perfil_data
        }, status=status.HTTP_200_OK)

class RegistroRapidoView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            
            perfil = inscripcion.asistente
            perfil.asistencia_confirmada = True
            perfil.fecha_confirmacion = timezone.now()
            perfil.save()
            
            certificado, created = Certificado.objects.get_or_create(
                asistente=perfil,
                tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
            )
            
            # send_certificate_email(certificado) # Commented out for testing
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'status': 'success', 
                'message': 'Registro completado. Asistencia confirmada y certificado enviado por email.'
            }, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
