from rest_framework import viewsets, mixins, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Disertante, Inscripcion, CodigoQR, Programa, Certificado # Import Certificado model
from .serializers import DisertanteSerializer, InscripcionSerializer, AsistenteSerializer, ProgramaSerializer
from django.utils import timezone
from .email import send_certificate_email # Import the certificate sending function

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

class CheckInView(views.APIView):
    """
    Vista para manejar el proceso de check-in a través de un código QR.
    """
    permission_classes = [AllowAny] # En un caso real, debería ser IsAuthenticated

    def post(self, request, *args, **kwargs):
        codigo_qr = request.data.get('codigo')
        if not codigo_qr:
            return Response({'status': 'error', 'message': 'No se proporcionó código QR.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            qr = CodigoQR.objects.select_related('inscripcion__asistente').get(codigo=codigo_qr)
        except CodigoQR.DoesNotExist:
            return Response({'status': 'error', 'message': 'Código QR no válido o no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if qr.check_in_realizado:
            return Response({
                'status': 'error',
                'message': f'Este código ya fue utilizado el {qr.fecha_check_in.strftime("%d/%m/%Y a las %H:%M:%S")}.',
            }, status=status.HTTP_409_CONFLICT)

        # Realizar el check-in
        qr.check_in_realizado = True
        qr.fecha_check_in = timezone.now()
        qr.save()

        # Create Certificado instance
        certificado, created = Certificado.objects.get_or_create(
            asistente=qr.inscripcion.asistente,
            tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
        )
        # Send certificate email
        send_certificate_email(certificado)

        # Preparar la respuesta con los datos del asistente
        asistente_data = AsistenteSerializer(qr.inscripcion.asistente).data
        
        return Response({
            'status': 'success',
            'message': 'Check-in realizado con éxito. Certificado enviado por email.',
            'asistente': asistente_data
        }, status=status.HTTP_200_OK)
