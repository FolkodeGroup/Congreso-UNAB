from django.contrib import admin
from .models import Disertante, Empresa, Asistente, Inscripcion, CodigoQR, Certificado, Programa

class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_inscripcion', 'empresa', 'fecha_inscripcion')
    list_filter = ('tipo_inscripcion', 'fecha_inscripcion')
    search_fields = ('asistente__nombre_completo', 'asistente__email', 'empresa__razon_social')
    actions = ['marcar_check_in']

    def marcar_check_in(self, request, queryset):
        # Usamos el campo 'check_in_realizado' del modelo CodigoQR
        updated_count = 0
        for inscripcion in queryset:
            qr, created = CodigoQR.objects.get_or_create(inscripcion=inscripcion)
            if not qr.check_in_realizado:
                qr.check_in_realizado = True
                # También podríamos guardar la fecha del check-in si quisiéramos
                # qr.fecha_check_in = timezone.now() 
                qr.save()
                updated_count += 1
        
        self.message_user(request, f"{updated_count} de {queryset.count()} inscripciones marcadas con check-in.")
    marcar_check_in.short_description = "Marcar Check-in como realizado"

class CodigoQRAdmin(admin.ModelAdmin):
    list_display = ('inscripcion', 'codigo', 'check_in_realizado', 'fecha_check_in')
    readonly_fields = ('codigo',)
    search_fields = ('inscripcion__asistente__nombre_completo',)

class AsistenteAdmin(admin.ModelAdmin):
    list_display = ('nombre_completo', 'email', 'dni')
    search_fields = ('nombre_completo', 'email', 'dni')

class CertificadoAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_certificado', 'fecha_generacion')
    list_filter = ('tipo_certificado',)
    search_fields = ('asistente__nombre_completo',)

class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'disertante', 'dia', 'hora_inicio', 'hora_fin')
    list_filter = ('dia',)
    search_fields = ('titulo', 'disertante__nombre')

admin.site.register(Disertante)
admin.site.register(Empresa)
admin.site.register(Asistente, AsistenteAdmin)
admin.site.register(Inscripcion, InscripcionAdmin)
admin.site.register(CodigoQR, CodigoQRAdmin)
admin.site.register(Certificado, CertificadoAdmin)
admin.site.register(Programa, ProgramaAdmin)