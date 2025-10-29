import argparse
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Asistente, Disertante, Empresa, Certificado

class Command(BaseCommand):
    help = 'Genera los archivos PDF para los certificados que aún no lo tienen.'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando la generación de PDFs de certificados...'))
        
        # 1. Crear objetos de Certificado si no existen
        self.crear_objetos_certificados()

        # 2. Generar PDFs para los certificados que no lo tienen
        certificados_a_generar = Certificado.objects.filter(pdf_generado__isnull=True)
        total_a_generar = certificados_a_generar.count()
        self.stdout.write(f'Se encontraron {total_a_generar} certificados sin PDF.')

        generados_count = 0
        for certificado in certificados_a_generar:
            try:
                self.stdout.write(f' -> Generando PDF para: {certificado.destinatario_nombre} ({certificado.get_tipo_certificado_display()})')
                certificado.generar_pdf()
                generados_count += 1
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'    ERROR: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Proceso completado. Se generaron {generados_count} nuevos PDFs.'))

    def crear_objetos_certificados(self):
        self.stdout.write('Verificando y creando objetos de certificado necesarios...')
        
        # Asistentes
        asistentes = Asistente.objects.filter(asistencia_confirmada=True)
        for asistente in asistentes:
            Certificado.objects.get_or_create(
                asistente=asistente,
                defaults={'tipo_certificado': Certificado.TipoCertificado.ASISTENCIA}
            )

        # Disertantes
        for disertante in Disertante.objects.all():
            Certificado.objects.get_or_create(
                disertante=disertante,
                defaults={'tipo_certificado': Certificado.TipoCertificado.DISERTANTE}
            )

        # Empresas
        for empresa in Empresa.objects.all():
            Certificado.objects.get_or_create(
                empresa=empresa,
                defaults={'tipo_certificado': Certificado.TipoCertificado.EMPRESA}
            )
        self.stdout.write('Verificación de objetos de certificado completada.')