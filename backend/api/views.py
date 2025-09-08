from rest_framework import viewsets, mixins, status, views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import Disertante, Inscripcion, Programa, Certificado, Asistente, Empresa, MiembroGrupo
from .serializers import DisertanteSerializer, InscripcionSerializer, AsistenteSerializer, ProgramaSerializer, EmpresaSerializer, MiembroGrupoSerializer
from django.utils import timezone
from .email import send_certificate_email, send_confirmation_email

class DisertanteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver la lista de disertantes y los detalles de uno específico.
    """
    queryset = Disertante.objects.all()
    serializer_class = DisertanteSerializer
    permission_classes = [AllowAny]

class ProgramaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver el programa del congreso, ordenado por día y hora.
    """
    queryset = Programa.objects.all().order_by('dia', 'hora_inicio')
    serializer_class = ProgramaSerializer
    permission_classes = [AllowAny]

class RegistroEmpresasView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Vista para el registro de empresas.
    """
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
    """
    Vista para el registro de participantes individuales y grupales.
    """
    queryset = Asistente.objects.all()
    serializer_class = AsistenteSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                profile_type = request.data.get('profile_type')
                miembros_grupo_data = request.data.get('miembros_grupo', [])

                # Handle Asistente (main participant)
                asistente_serializer = self.get_serializer(data=request.data)
                try:
                    asistente_serializer.is_valid(raise_exception=True)
                    asistente = asistente_serializer.save()
                except serializers.ValidationError as e:
                    return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

                # Handle group members if profile_type is GROUP_REPRESENTATIVE
                if profile_type == Asistente.ProfileType.GROUP_REPRESENTATIVE:
                    if not miembros_grupo_data:
                        return Response({'status': 'error', 'message': 'Se requieren miembros del grupo para un representante de grupo.'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    for miembro_data in miembros_grupo_data:
                        miembro_data['grupo_representante'] = asistente.id # Link to the group representative
                        miembro_serializer = MiembroGrupoSerializer(data=miembro_data)
                        try:
                            miembro_serializer.is_valid(raise_exception=True)
                            miembro_serializer.save()
                        except serializers.ValidationError as e:
                            return Response({'status': 'error', 'message': {'miembros_grupo': e.detail}}, status=status.HTTP_400_BAD_REQUEST)

                return Response({'status': 'success', 'message': 'Registro de participante realizado correctamente.', 'id': asistente.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InscripcionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Un ViewSet que solo permite la creación de nuevas inscripciones (registros).
    Utiliza el InscripcionSerializer para manejar la lógica de creación, 
    incluyendo la validación de duplicados y la creación del asistente y QR asociados.
    """
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            send_confirmation_email(inscripcion)
            headers = self.get_success_headers(serializer.data)
            return Response({'status': 'success', 'message': 'Inscripción realizada correctamente. Se ha enviado un email de confirmación.'}, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            # Corregido para acceder al detalle del error correctamente
            error_detail = e.detail.get('error', ['Error desconocido'])[0]
            return Response({'status': 'error', 'message': error_detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerificarDNIView(views.APIView):
    """
    Vista para verificar si un DNI está registrado y confirmar asistencia.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        dni = request.data.get('dni')
        if not dni:
            return Response({'status': 'error', 'message': 'No se proporcionó DNI.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            asistente = Asistente.objects.get(dni=dni)
        except Asistente.DoesNotExist:
            return Response({'status': 'error', 'message': 'DNI no encontrado en el listado de registrados.'}, status=status.HTTP_404_NOT_FOUND)

        if asistente.asistencia_confirmada:
            return Response({
                'status': 'error',
                'message': f'La asistencia ya fue confirmada el {asistente.fecha_confirmacion.strftime("%d/%m/%Y a las %H:%M:%S")}.',
            }, status=status.HTTP_409_CONFLICT)

        # Confirmar asistencia
        asistente.asistencia_confirmada = True
        asistente.fecha_confirmacion = timezone.now()
        asistente.save()

        # Crear certificado de asistencia
        certificado, created = Certificado.objects.get_or_create(
            asistente=asistente,
            tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
        )
        
        # Enviar certificado por email
        send_certificate_email(certificado)

        # Preparar la respuesta con los datos del asistente
        asistente_data = AsistenteSerializer(asistente).data
        
        return Response({
            'status': 'success',
            'message': 'Asistencia confirmada con éxito. Certificado enviado por email.',
            'asistente': asistente_data
        }, status=status.HTTP_200_OK)

class RegistroRapidoView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Vista para registro rápido in-situ en el evento.
    """
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            
            # Confirmar asistencia inmediatamente para registro in-situ
            asistente = inscripcion.asistente
            asistente.asistencia_confirmada = True
            asistente.fecha_confirmacion = timezone.now()
            asistente.save()
            
            # Crear certificado de asistencia
            certificado, created = Certificado.objects.get_or_create(
                asistente=asistente,
                tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
            )
            
            # Enviar certificado por email
            send_certificate_email(certificado)
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'status': 'success', 
                'message': 'Registro completado. Asistencia confirmada y certificado enviado por email.'
            }, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            error_detail = e.detail.get('error', ['Error desconocido'])[0]
            return Response({'status': 'error', 'message': error_detail}, status=status.HTTP_400_BAD_REQUEST)