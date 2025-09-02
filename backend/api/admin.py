from django.contrib import admin
from django.utils import timezone
from .models import Disertante, Empresa, Asistente, Inscripcion, Certificado, Programa
from .email import send_certificate_email

class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_inscripcion', 'empresa', 'fecha_inscripcion')
    list_filter = ('tipo_inscripcion', 'fecha_inscripcion')
    search_fields = ('asistente__nombre_completo', 'asistente__email', 'empresa__razon_social')

class AsistenteAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'email', 'dni', 'asistencia_confirmada', 'fecha_confirmacion')
    list_filter = ('asistencia_confirmada', 'fecha_confirmacion')
    search_fields = ('nombre_completo', 'email', 'dni')
    actions = ['confirmar_asistencia', 'enviar_certificados']

    def confirmar_asistencia(self, request, queryset):
        updated_count = 0
        for asistente in queryset:
            if not asistente.asistencia_confirmada:
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
                updated_count += 1
        
        self.message_user(request, f"{updated_count} asistencias confirmadas y certificados enviados.")
    confirmar_asistencia.short_description = "Confirmar asistencia y enviar certificado"

    def enviar_certificados(self, request, queryset):
        sent_count = 0
        for asistente in queryset.filter(asistencia_confirmada=True):
            certificado, created = Certificado.objects.get_or_create(
                asistente=asistente,
                tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
            )
            send_certificate_email(certificado)
            sent_count += 1
        
        self.message_user(request, f"{sent_count} certificados enviados.")
    enviar_certificados.short_description = "Enviar certificados a asistentes confirmados"

class CertificadoAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_certificado', 'fecha_generacion')
    list_filter = ('tipo_certificado', 'fecha_generacion')
    search_fields = ('asistente__nombre_completo', 'asistente__email')

class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'disertante', 'dia', 'hora_inicio', 'hora_fin')
    list_filter = ('dia',)
    search_fields = ('titulo', 'disertante__nombre')

admin.site.register(Disertante)
admin.site.register(Empresa)
admin.site.register(Asistente, AsistenteAdmin)
admin.site.register(Inscripcion, InscripcionAdmin)
admin.site.register(Certificado, CertificadoAdmin)
admin.site.register(Programa, ProgramaAdmin)