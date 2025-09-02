from rest_framework import viewsets, mixins, status, views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Disertante, Inscripcion, Programa, Certificado, Asistente
from .serializers import DisertanteSerializer, InscripcionSerializer, AsistenteSerializer, ProgramaSerializer
from django.utils import timezone
from .email import send_certificate_email

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
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({'status': 'success', 'message': 'Inscripción realizada correctamente.'}, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            # Corregido para acceder al detalle del error correctamente
            error_detail = e.detail.get('error', ['Error desconocido'])[0]
            return Response({'status': 'error', 'message': error_detail}, status=status.HTTP_400_BAD_REQUEST)

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
