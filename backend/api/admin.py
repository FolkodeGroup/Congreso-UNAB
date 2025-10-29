from django.contrib import admin
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Disertante, Empresa, Asistente, Inscripcion, Certificado, Programa
from .email import send_certificate_email


class DNIFilter(admin.SimpleListFilter):
    """
    Filtro personalizado para filtrar asistentes según si tienen o no DNI válido.
    """
    title = 'Estado DNI'
    parameter_name = 'dni_status'

    def lookups(self, request, model_admin):
        return (
            ('sin_dni', 'Sin DNI'),
            ('con_dni', 'Con DNI'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'sin_dni':
            # Filtrar asistentes sin DNI (nulo o vacío)
            return queryset.filter(dni__isnull=True) | queryset.filter(dni='')
        if self.value() == 'con_dni':
            # Filtrar asistentes con DNI válido (no nulo y no vacío)
            return queryset.exclude(dni__isnull=True).exclude(dni='')
        return queryset


class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'empresa', 'fecha_inscripcion')
    list_filter = ('fecha_inscripcion',)
    search_fields = ('asistente__first_name', 'asistente__last_name', 'asistente__email', 'empresa__razon_social')

class AsistenteAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'dni', 'asistencia_confirmada', 'fecha_confirmacion')
    list_filter = (DNIFilter, 'asistencia_confirmada', 'fecha_confirmacion')
    search_fields = ('first_name', 'last_name', 'email', 'dni')
    actions = ['confirmar_asistencia', 'enviar_certificados', 'enviar_solicitud_actualizacion_dni']

    def enviar_solicitud_actualizacion_dni(self, request, queryset):
        """
        Envía email a los asistentes seleccionados que no tienen DNI válido,
        con un enlace para que actualicen su DNI.
        """
        # Filtrar solo asistentes sin DNI válido (con token asignado)
        asistentes_sin_dni = queryset.filter(
            dni__isnull=True
        ) | queryset.filter(dni='')
        
        if not asistentes_sin_dni.exists():
            self.message_user(request, "Los asistentes seleccionados ya tienen DNI válido.", level='warning')
            return
        
        enviados = 0
        errores = 0
        
        for asistente in asistentes_sin_dni:
            if not asistente.dni_update_token:
                self.message_user(request, f"El asistente {asistente.nombre_completo} no tiene token asignado. Ejecuta el script fix_dni.py primero.", level='error')
                continue
            
            try:
                # Construir el enlace
                base_url = getattr(settings, 'FRONTEND_URL', 'https://congresologistica.unab.edu.ar')
                enlace = f"{base_url}/actualizar-dni?token={asistente.dni_update_token}"
                
                # Renderizar el template
                html_content = render_to_string('email/dni_update.html', {
                    'nombre': asistente.first_name,
                    'enlace': enlace
                })
                
                # Crear y enviar el email
                subject = 'Actualización de DNI - Congreso de Logística UNaB 2025'
                from_email = settings.DEFAULT_FROM_EMAIL
                to_email = asistente.email
                
                email = EmailMultiAlternatives(subject, '', from_email, [to_email])
                email.attach_alternative(html_content, "text/html")
                email.send()
                
                enviados += 1
            except Exception as e:
                errores += 1
                print(f"[ERROR] Error enviando email a {asistente.email}: {e}")
        
        self.message_user(request, f"{enviados} emails enviados correctamente. {errores} errores.")
    
    enviar_solicitud_actualizacion_dni.short_description = "Enviar solicitud de actualización de DNI"

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
    search_fields = ('asistente__first_name', 'asistente__last_name', 'asistente__email')

class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'aula', 'dia', 'hora_inicio', 'hora_fin')
    list_filter = ('dia', 'categoria', 'aula')
    search_fields = ('titulo',)
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