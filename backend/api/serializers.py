from rest_framework import serializers
from .models import (
    Disertante, Empresa, Programa, Perfil, MiembroGrupo, Inscripcion, 
    Institucion, DetallePerfil
)

class DisertanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disertante
        fields = ['nombre', 'bio', 'foto_url', 'tema_presentacion']

class ProgramaSerializer(serializers.ModelSerializer):
    disertante = DisertanteSerializer(read_only=True)

    class Meta:
        model = Programa
        fields = ['titulo', 'disertante', 'hora_inicio', 'hora_fin', 'dia', 'descripcion', 'aula']

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = [
            'nombre_empresa',
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
        fields = ['nombre_miembro', 'dni_miembro']

class DetallePerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePerfil
        exclude = ['perfil']

class PerfilSerializer(serializers.ModelSerializer):
    detalles = DetallePerfilSerializer(required=False)
    miembros_grupo = MiembroGrupoSerializer(many=True, required=False)
    institucion_nombre = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Perfil
        fields = [
            'id', 'nombre', 'apellido', 'email', 'celular', 'dni', 'tipo_perfil',
            'institucion', 'institucion_nombre', 'detalles', 'miembros_grupo'
        ]
        read_only_fields = ['id', 'institucion']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', None)
        miembros_data = validated_data.pop('miembros_grupo', [])
        institucion_nombre = validated_data.pop('institucion_nombre', None)

        institucion = None
        if institucion_nombre:
            institucion, _ = Institucion.objects.get_or_create(nombre_institucion=institucion_nombre)
            validated_data['institucion'] = institucion

        perfil = Perfil.objects.create(**validated_data)

        if detalles_data:
            DetallePerfil.objects.create(perfil=perfil, **detalles_data)

        if perfil.tipo_perfil == 'Representante':
            for miembro_data in miembros_data:
                MiembroGrupo.objects.create(representante=perfil, **miembro_data)
        
        return perfil

class InscripcionSerializer(serializers.ModelSerializer):
    asistente = PerfilSerializer()

    class Meta:
        model = Inscripcion
        fields = ['asistente', 'empresa', 'fecha_inscripcion']
        read_only_fields = ['fecha_inscripcion']

    def create(self, validated_data):
        perfil_data = validated_data.pop('asistente')
        
        dni = perfil_data.get('dni')
        email = perfil_data.get('email')

        if dni and Perfil.objects.filter(dni=dni).exists():
            raise serializers.ValidationError({'dni': ['Ya existe un perfil con este DNI.']})
        if email and perfil_data.get('email') and Perfil.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': ['Ya existe un perfil con este email.']})

        perfil_serializer = PerfilSerializer(data=perfil_data)
        if perfil_serializer.is_valid(raise_exception=True):
            perfil = perfil_serializer.save()
            inscripcion = Inscripcion.objects.create(asistente=perfil, **validated_data)
            return inscripcion
        return None
