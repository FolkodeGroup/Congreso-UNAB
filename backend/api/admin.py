from django.contrib import admin
from django.utils import timezone
from .models import (
    Disertante, Empresa, Perfil, Inscripcion, Certificado, Programa, 
    Institucion, DetallePerfil, MiembroGrupo
)
from .email import send_certificate_email

class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'empresa', 'fecha_inscripcion')
    list_filter = ('fecha_inscripcion',)
    search_fields = ('asistente__nombre', 'asistente__apellido', 'asistente__email', 'empresa__nombre_empresa')

class PerfilAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'email', 'dni', 'tipo_perfil', 'asistencia_confirmada', 'fecha_confirmacion')
    list_filter = ('tipo_perfil', 'asistencia_confirmada', 'fecha_confirmacion', 'institucion')
    search_fields = ('nombre', 'apellido', 'email', 'dni')
    actions = ['confirmar_asistencia', 'enviar_certificados']

    def confirmar_asistencia(self, request, queryset):
        updated_count = 0
        for perfil in queryset:
            if not perfil.asistencia_confirmada:
                perfil.asistencia_confirmada = True
                perfil.fecha_confirmacion = timezone.now()
                perfil.save()
                
                certificado, created = Certificado.objects.get_or_create(
                    asistente=perfil,
                    tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
                )
                
                if perfil.email:
                    send_certificate_email(certificado)
                updated_count += 1
        
        self.message_user(request, f"{updated_count} asistencias confirmadas y certificados enviados.")
    confirmar_asistencia.short_description = "Confirmar asistencia y enviar certificado"

    def enviar_certificados(self, request, queryset):
        sent_count = 0
        for perfil in queryset.filter(asistencia_confirmada=True):
            if perfil.email:
                certificado, created = Certificado.objects.get_or_create(
                    asistente=perfil,
                    tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
                )
                send_certificate_email(certificado)
                sent_count += 1
        
        self.message_user(request, f"{sent_count} certificados enviados.")
    enviar_certificados.short_description = "Enviar certificados a asistentes confirmados"

class CertificadoAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_certificado', 'fecha_generacion')
    list_filter = ('tipo_certificado', 'fecha_generacion')
    search_fields = ('asistente__nombre', 'asistente__apellido', 'asistente__email')

class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'disertante', 'dia', 'hora_inicio', 'hora_fin', 'aula')
    list_filter = ('dia', 'aula')
    search_fields = ('titulo', 'disertante__nombre')

class MiembroGrupoAdmin(admin.ModelAdmin):
    list_display = ('nombre_miembro', 'dni_miembro', 'representante')
    search_fields = ('nombre_miembro', 'dni_miembro', 'representante__nombre', 'representante__apellido')

admin.site.register(Disertante)
admin.site.register(Empresa)
admin.site.register(Perfil, PerfilAdmin)
admin.site.register(Inscripcion, InscripcionAdmin)
admin.site.register(Certificado, CertificadoAdmin)
admin.site.register(Programa, ProgramaAdmin)
admin.site.register(Institucion)
admin.site.register(DetallePerfil)
admin.site.register(MiembroGrupo, MiembroGrupoAdmin)