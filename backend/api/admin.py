from django.contrib import admin
from .models import Disertante, Empresa, Asistente, Inscripcion, CodigoQR, Certificado, Programa

class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('asistente', 'tipo_inscripcion', 'empresa', 'fecha_inscripcion')
    list_filter = ('tipo_inscripcion', 'fecha_inscripcion')
    search_fields = ('asistente__nombre_completo', 'asistente__email', 'empresa__razon_social')

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