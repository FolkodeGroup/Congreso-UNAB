from rest_framework import serializers
from .models import Disertante, Empresa, Programa, Asistente, MiembroGrupo, Inscripcion

class DisertanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disertante
        fields = ['nombre', 'bio', 'foto_url', 'tema_presentacion']

class ProgramaSerializer(serializers.ModelSerializer):
    disertante = DisertanteSerializer(read_only=True)

    class Meta:
        model = Programa
        fields = ['titulo', 'disertante', 'hora_inicio', 'hora_fin', 'dia', 'descripcion', 'aula', 'categoria']

class EmpresaSerializer(serializers.ModelSerializer):
    def to_internal_value(self, data):
        # Convierte el campo 'participacion_opciones' a JSON si viene como string
        import json
        if 'participacion_opciones' in data:
            value = data['participacion_opciones']
            if isinstance(value, str):
                try:
                    data['participacion_opciones'] = json.loads(value)
                except Exception:
                    pass  # Deja el valor como está si no se puede parsear
        return super().to_internal_value(data)

    class Meta:
        model = Empresa
        fields = [
            'nombre_empresa',
            'cuit',
            'direccion',
            'telefono_empresa',
            'email_empresa',
            'sitio_web',
            'descripcion',
            'logo',
            'nombre_contacto',
            'email_contacto',
            'celular_contacto',
            'cargo_contacto',
            'participacion_opciones',
            'participacion_otra'
        ]

class MiembroGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiembroGrupo
        fields = ['full_name', 'dni']

class AsistenteSerializer(serializers.ModelSerializer):
    miembros_grupo = MiembroGrupoSerializer(many=True, required=False)

    class Meta:
        model = Asistente
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'dni', 'profile_type',
            'is_unab_student', 'institution', 'career', 'year_of_study',
            'career_taught', 'work_area', 'occupation', 'company_name',
            'group_name', 'group_municipality', 'group_size',
            'miembros_grupo'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        miembros_data = validated_data.pop('miembros_grupo', [])
        asistente = Asistente.objects.create(**validated_data)
        if asistente.profile_type == Asistente.ProfileType.GROUP_REPRESENTATIVE:
            for miembro_data in miembros_data:
                MiembroGrupo.objects.create(representante=asistente, **miembro_data)
        return asistente

    def validate(self, data):
        profile_type = data.get('profile_type')

        if profile_type == Asistente.ProfileType.STUDENT:
            if data.get('is_unab_student') is None:
                raise serializers.ValidationError({"is_unab_student": "Este campo es requerido para estudiantes."})
            if data.get('is_unab_student') is False and not data.get('institution'):
                raise serializers.ValidationError({"institution": "La institución es requerida si no perteneces a la UNaB."})
            if not data.get('career'):
                raise serializers.ValidationError({"career": "La carrera es requerida para estudiantes."})
            if not data.get('year_of_study'):
                raise serializers.ValidationError({"year_of_study": "El año de cursada es requerido para estudiantes."})

        elif profile_type == Asistente.ProfileType.TEACHER:
            if not data.get('institution'):
                raise serializers.ValidationError({"institution": "La institución es requerida para docentes."})
            if not data.get('career_taught'):
                raise serializers.ValidationError({"career_taught": "La carrera que dicta es requerida para docentes."})

        elif profile_type == Asistente.ProfileType.PROFESSIONAL:
            if not data.get('work_area'):
                raise serializers.ValidationError({"work_area": "El área de trabajo es requerida para profesionales."})
            if not data.get('occupation'):
                raise serializers.ValidationError({"occupation": "El cargo es requerido para profesionales."})

        elif profile_type == Asistente.ProfileType.GROUP_REPRESENTATIVE:
            if not data.get('group_name'):
                raise serializers.ValidationError({"group_name": "El nombre del grupo o institución es requerido."})
            if not data.get('group_size'):
                raise serializers.ValidationError({"group_size": "La cantidad de personas es requerida."})
            if not data.get('miembros_grupo'):
                raise serializers.ValidationError({"miembros_grupo": "La lista de miembros del grupo es requerida."})
        
        return data

class InscripcionSerializer(serializers.ModelSerializer):
    asistente = AsistenteSerializer() # Nested AsistenteSerializer

    class Meta:
        model = Inscripcion
        fields = ['asistente', 'empresa', 'fecha_inscripcion'] # Explicitly list fields
        read_only_fields = ['fecha_inscripcion'] # fecha_inscripcion is auto-generated

    def create(self, validated_data):
        asistente_data = validated_data.pop('asistente')
        # Check for duplicate DNI or email before creating Asistente
        dni = asistente_data.get('dni')
        email = asistente_data.get('email')

        if dni and Asistente.objects.filter(dni=dni).exists():
            raise serializers.ValidationError({'dni': ['Ya existe un asistente con este DNI.']})
        if email and Asistente.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': ['Ya existe un asistente con este email.']})

        asistente = Asistente.objects.create(**asistente_data)
        inscripcion = Inscripcion.objects.create(asistente=asistente, **validated_data)
        return inscripcion

    # No need for a separate validate method if validation is done in create or AsistenteSerializer
    # def validate(self, data):
    #     return data
