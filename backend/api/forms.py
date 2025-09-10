from django import forms
from .models import Perfil, DetallePerfil, MiembroGrupo, Institucion

class PerfilForm(forms.ModelForm):
    class Meta:
        model = Perfil
        fields = ['nombre', 'apellido', 'email', 'celular', 'dni', 'tipo_perfil', 'institucion']

class DetallePerfilForm(forms.ModelForm):
    class Meta:
        model = DetallePerfil
        exclude = ['perfil']

class MiembroGrupoForm(forms.ModelForm):
    class Meta:
        model = MiembroGrupo
        fields = ['nombre_miembro', 'dni_miembro']