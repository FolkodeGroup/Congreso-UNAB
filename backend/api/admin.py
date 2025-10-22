from django.contrib import admin
from django.utils import timezone
from .models import Disertante, Empresa, Asistente, Inscripcion, Certificado, Programa
from .email import send_certificate_email

class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'empresa', 'fecha_inscripcion')
    list_filter = ('fecha_inscripcion',)
    search_fields = ('asistente__first_name', 'asistente__last_name', 'asistente__email', 'empresa__razon_social')

class AsistenteAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'dni', 'asistencia_confirmada', 'fecha_confirmacion')
    list_filter = ('asistencia_confirmada', 'fecha_confirmacion')
    search_fields = ('first_name', 'last_name', 'email', 'dni')
    actions = ['confirmar_asistencia', 'enviar_certificados']

    def confirmar_asistencia(self, request, queryset):
        updated_count = 0
        for asistente in queryset:
            if not asistente.asistencia_confirmada:
                asistente.asistencia_confirmada = True
                asistente.fecha_confirmacion = timezone.now()
                asistente.save()
                updated_count += 1
        
        self.message_user(request, f"{updated_count} asistencias confirmadas.")
    confirmar_asistencia.short_description = "Confirmar asistencia (sin enviar certificado)"

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

    def get_actions(self, request):
        actions = super().get_actions(request)
        # Solo mostrar la acción de enviar certificados si se está filtrando por asistencia_confirmada=True
        if 'asistencia_confirmada__exact' not in request.GET or request.GET['asistencia_confirmada__exact'] != '1':
            if 'enviar_certificados' in actions:
                del actions['enviar_certificados']
        return actions

class CertificadoAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_certificado', 'fecha_generacion')
    list_filter = ('tipo_certificado', 'fecha_generacion')
    search_fields = ('asistente__first_name', 'asistente__last_name', 'asistente__email')

class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'disertante', 'categoria', 'aula', 'dia', 'hora_inicio', 'hora_fin')
    list_filter = ('dia', 'categoria', 'aula')
    search_fields = ('titulo', 'disertante__nombre')
    list_editable = ('categoria',)

@admin.register(Disertante)
class DisertanteAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': ('nombre', 'foto', 'foto_url', 'tema_presentacion', 'linkedin')
        }),
        ('Información opcional', {
            'classes': ('collapse',),
            'fields': ('bio',),
        }),
    )
    list_display = ('nombre', 'tema_presentacion', 'linkedin')
@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
            'fields': ('nombre_empresa', 'logo')
        }),
        ('Información opcional', {
            'classes': ('collapse',),
            'fields': (
                'cuit', 'direccion', 'telefono_empresa', 'email_empresa', 'sitio_web', 'descripcion',
                'nombre_contacto', 'email_contacto', 'celular_contacto', 'cargo_contacto',
                'participacion_opciones', 'participacion_otra',
            ),
        }),
    )
    list_display = ('nombre_empresa', 'logo')
admin.site.register(Asistente, AsistenteAdmin)
admin.site.register(Inscripcion, InscripcionAdmin)
admin.site.register(Certificado, CertificadoAdmin)
admin.site.register(Programa, ProgramaAdmin)