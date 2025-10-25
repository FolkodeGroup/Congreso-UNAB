from rest_framework import serializers
from .models import Disertante, Empresa, Programa, Asistente, MiembroGrupo, Inscripcion
from django.db import transaction
from .email import send_group_confirmation_emails, send_individual_confirmation_email

class DisertanteSerializer(serializers.ModelSerializer):
    foto = serializers.ImageField(read_only=True)

    class Meta:
        model = Disertante
        fields = ['nombre', 'bio', 'foto_url', 'foto', 'tema_presentacion', 'linkedin']

class ProgramaSerializer(serializers.ModelSerializer):
    disertantes = DisertanteSerializer(many=True, read_only=True)

    class Meta:
        model = Programa
        fields = ['titulo', 'disertantes', 'hora_inicio', 'hora_fin', 'dia', 'descripcion', 'aula', 'categoria']

class EmpresaSerializer(serializers.ModelSerializer):
    def to_internal_value(self, data):
        errors = {}
        required_fields = [
            'nombre_empresa', 'logo'
        ]
        for field in required_fields:
            value = data.get(field, None)
            if not value or (isinstance(value, str) and not value.strip()):
                errors[field] = f'Este campo es obligatorio.'
        if errors:
            raise serializers.ValidationError(errors)
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


class EmpresaLogoSerializer(serializers.ModelSerializer):
    """
    Serializador simplificado para mostrar empresas en carrusel/slider.
    Solo incluye campos necesarios para mostrar logos.
    """
    class Meta:
        model = Empresa
        fields = ['id', 'nombre_empresa', 'logo', 'sitio_web', 'descripcion']

class MiembroGrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiembroGrupo
        fields = ['full_name', 'dni']

class AsistenteGrupoSerializer(serializers.Serializer):
    """Serializer para miembros de grupo individuales"""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    dni = serializers.CharField(max_length=10)

class AsistenteSerializer(serializers.ModelSerializer):
    miembros_grupo = MiembroGrupoSerializer(many=True, required=False)  # Mantenemos compatibilidad
    miembros_grupo_nuevos = AsistenteGrupoSerializer(many=True, required=False, write_only=True)  # Nueva estructura
    miembros_representados = serializers.SerializerMethodField()  # Para lectura

    class Meta:
        model = Asistente
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'dni', 'profile_type',
            'is_unab_student', 'institution', 'career', 'year_of_study',
            'career_taught', 'work_area', 'occupation', 'company_name',
            'group_name', 'group_municipality', 'group_size', 'representante_grupo',
            'miembros_grupo', 'miembros_grupo_nuevos', 'miembros_representados', 'rol_especifico'
        ]
        read_only_fields = ['id', 'miembros_representados']
    
    def get_miembros_representados(self, obj):
        """Devuelve la información de los miembros representados"""
        if obj.es_representante_grupo:
            miembros = obj.get_miembros_grupo()
            return [{
                'id': m.id,
                'first_name': m.first_name,
                'last_name': m.last_name,
                'email': m.email,
                'dni': m.dni
            } for m in miembros]
        return []

    def create(self, validated_data):
        miembros_data = validated_data.pop('miembros_grupo', [])  # Compatibilidad con sistema anterior
        miembros_nuevos_data = validated_data.pop('miembros_grupo_nuevos', [])  # Nuevo sistema
        
        asistente = Asistente.objects.create(**validated_data)
        
        if asistente.profile_type == Asistente.ProfileType.GROUP_REPRESENTATIVE:
            # Sistema anterior (MiembroGrupo) - mantenemos compatibilidad
            for miembro_data in miembros_data:
                MiembroGrupo.objects.create(representante=asistente, **miembro_data)
            
            # Nuevo sistema - crear asistentes individuales
            for miembro_data in miembros_nuevos_data:
                # Validar que no exista DNI o email duplicado
                dni = miembro_data.get('dni')
                email = miembro_data.get('email')
                
                if dni and Asistente.objects.filter(dni=dni).exists():
                    raise serializers.ValidationError({
                        'miembros_grupo_nuevos': f'Ya existe un asistente con DNI {dni}'
                    })
                
                if email and Asistente.objects.filter(email=email).exists():
                    raise serializers.ValidationError({
                        'miembros_grupo_nuevos': f'Ya existe un asistente con email {email}'
                    })
                
                # Crear asistente miembro del grupo
                Asistente.objects.create(
                    first_name=miembro_data['first_name'],
                    last_name=miembro_data['last_name'],
                    email=miembro_data['email'],
                    dni=miembro_data['dni'],
                    phone='',  # Opcional para miembros
                    profile_type=Asistente.ProfileType.VISITOR,  # Por defecto visitante
                    representante_grupo=asistente,
                    # Heredar algunos datos del grupo
                    group_name=asistente.group_name,
                    group_municipality=asistente.group_municipality,
                )
            
            # Enviar emails de confirmación a todos los miembros del grupo
            try:
                resultado_envio = send_group_confirmation_emails(asistente)
                print(f"[INFO] Emails enviados: {resultado_envio['total_emails']}, Fallidos: {resultado_envio['total_fallidos']}")
            except Exception as e:
                print(f"[ERROR] Error enviando emails grupales: {e}")
                # No interrumpimos el proceso de registro por fallos en el email
        else:
            # Para inscripciones individuales, enviar email de confirmación
            try:
                send_individual_confirmation_email(asistente)
            except Exception as e:
                print(f"[ERROR] Error enviando email individual: {e}")
                # No interrumpimos el proceso de registro por fallos en el email
        
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

        elif profile_type == Asistente.ProfileType.PRESS:
            # No hay campos obligatorios extra para prensa
            pass
        elif profile_type == Asistente.ProfileType.GROUP_REPRESENTATIVE:
            if not data.get('group_name'):
                raise serializers.ValidationError({"group_name": "El nombre del grupo o institución es requerido."})
            if not data.get('group_size'):
                raise serializers.ValidationError({"group_size": "La cantidad de personas es requerida."})
            
            # Validar que tenga miembros (sistema anterior o nuevo)
            miembros_antiguos = data.get('miembros_grupo', [])
            miembros_nuevos = data.get('miembros_grupo_nuevos', [])
            
            if not miembros_antiguos and not miembros_nuevos:
                raise serializers.ValidationError({
                    "miembros_grupo": "Debe proporcionar la lista de miembros del grupo."
                })
            
            # Si usa el sistema nuevo, validar que la cantidad coincida
            if miembros_nuevos:
                cantidad_declarada = data.get('group_size', 0)
                cantidad_miembros = len(miembros_nuevos)
                if cantidad_declarada != cantidad_miembros:
                    raise serializers.ValidationError({
                        "group_size": f"La cantidad declarada ({cantidad_declarada}) no coincide con la cantidad de miembros proporcionados ({cantidad_miembros})."
                    })
        
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
