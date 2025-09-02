from rest_framework import serializers
from .models import Disertante, Empresa, Asistente, Inscripcion, CodigoQR, Programa
from .email import send_confirmation_email # Import the email sending function

class DisertanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disertante
        fields = ['nombre', 'bio', 'foto_url', 'tema_presentacion']

class ProgramaSerializer(serializers.ModelSerializer):
    disertante = DisertanteSerializer(read_only=True)

    class Meta:
        model = Programa
        fields = ['titulo', 'disertante', 'hora_inicio', 'hora_fin', 'dia', 'descripcion']

class AsistenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistente
        fields = ['email', 'nombre_completo', 'dni']

class InscripcionSerializer(serializers.ModelSerializer):
    asistente = AsistenteSerializer()

    class Meta:
        model = Inscripcion
        fields = ['tipo_inscripcion', 'asistente', 'empresa', 'nombre_grupo']

    def create(self, validated_data):
        asistente_data = validated_data.pop('asistente')
        # Validar si el asistente ya existe
        asistente, created = Asistente.objects.get_or_create(
            email=asistente_data['email'],
            defaults=asistente_data
        )
        # Validar si ya existe una inscripción para este asistente
        if Inscripcion.objects.filter(asistente=asistente).exists():
            raise serializers.ValidationError('Este correo electrónico ya ha sido registrado.')
        # Crear la inscripción
        inscripcion = Inscripcion.objects.create(asistente=asistente, **validated_data)
        # Crear el código QR asociado
        CodigoQR.objects.create(inscripcion=inscripcion)
        # Enviar email de confirmación
        send_confirmation_email(inscripcion)
        return inscripcion
