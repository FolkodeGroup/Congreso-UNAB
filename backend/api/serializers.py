from rest_framework import serializers
from .models import Disertante, Empresa, Asistente, Inscripcion, Programa, MiembroGrupo

class DisertanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disertante
        fields = ['nombre', 'bio', 'foto_url', 'tema_presentacion']

class ProgramaSerializer(serializers.ModelSerializer):
    disertante = DisertanteSerializer(read_only=True)

    class Meta:
        model = Programa
        fields = ['titulo', 'disertante', 'hora_inicio', 'hora_fin', 'dia', 'descripcion', 'aula']

class AsistenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistente
        fields = [
            'email', 'first_name', 'last_name', 'dni', 'phone', 'profile_type',
            'university', 'student_id', 'institution', 'occupation', 'company_name'
        ]
        extra_kwargs = {
            'university': {'required': False, 'allow_null': True},
            'student_id': {'required': False, 'allow_null': True},
            'institution': {'required': False, 'allow_null': True},
            'occupation': {'required': False, 'allow_null': True},
            'company_name': {'required': False, 'allow_null': True},
            'phone': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        profile_type = data.get('profile_type')

        if profile_type == Asistente.ProfileType.STUDENT:
            if not data.get('university'):
                raise serializers.ValidationError({"university": "La universidad es requerida para estudiantes."})
            if not data.get('student_id'):
                raise serializers.ValidationError({"student_id": "El número de estudiante es requerido para estudiantes."})
        elif profile_type == Asistente.ProfileType.TEACHER:
            if not data.get('institution'):
                raise serializers.ValidationError({"institution": "La institución es requerida para docentes."})
        elif profile_type == Asistente.ProfileType.PROFESSIONAL:
            if not data.get('occupation'):
                raise serializers.ValidationError({"occupation": "La ocupación es requerida para profesionales."})
            if not data.get('company_name'):
                raise serializers.ValidationError({"company_name": "El nombre de la empresa es requerido para profesionales."})
        
        return data

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = [
            'razon_social', 'cuit', 'direccion', 'telefono',
            'nombre_contacto', 'email_contacto', 'telefono_contacto',
            'opciones_participacion'
        ]
        extra_kwargs = {
            'direccion': {'required': False, 'allow_null': True},
            'telefono': {'required': False, 'allow_null': True},
            'nombre_contacto': {'required': False, 'allow_null': True},
            'email_contacto': {'required': False, 'allow_null': True},
            'telefono_contacto': {'required': False, 'allow_null': True},
            'opciones_participacion': {'required': False, 'allow_null': True},
        }

class MiembroGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiembroGrupo
        fields = ['first_name', 'last_name', 'dni', 'email']

class InscripcionSerializer(serializers.ModelSerializer):
    asistente = AsistenteSerializer()

    class Meta:
        model = Inscripcion
        fields = ['asistente', 'empresa', 'nombre_grupo'] # Removed tipo_inscripcion

    def create(self, validated_data):
        asistente_data = validated_data.pop('asistente')
        
        # Validar si el asistente ya existe
        asistente, created = Asistente.objects.get_or_create(
            email=asistente_data['email'], 
            defaults=asistente_data
        )

        # Validar si ya existe una inscripción para este asistente
        if Inscripcion.objects.filter(asistente=asistente).exists():
            raise serializers.ValidationError({'error': 'Este correo electrónico ya ha sido registrado.'})

        # Crear la inscripción
        inscripcion = Inscripcion.objects.create(asistente=asistente, **validated_data)
        
        # No se crea QR ni se envía email de confirmación según nuevos requerimientos
        
        return inscripcion