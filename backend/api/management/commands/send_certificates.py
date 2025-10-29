from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Certificado
from api.email import send_certificate_email

class Command(BaseCommand):
    help = 'Envía por email los certificados que ya tienen un PDF generado y no han sido enviados.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando el envío de certificados por email...'))

        certificados_a_enviar = Certificado.objects.filter(
            pdf_generado__isnull=False,
            fecha_envio__isnull=True
        )
        
        total_a_enviar = certificados_a_enviar.count()
        self.stdout.write(f'Se encontraron {total_a_enviar} certificados listos para enviar.')

        enviados_count = 0
        fallidos_count = 0

        for certificado in certificados_a_enviar:
            try:
                self.stdout.write(f' -> Enviando a: {certificado.destinatario_email}...')
                send_certificate_email(certificado)
                enviados_count += 1
            except Exception as e:
                fallidos_count += 1
                self.stderr.write(self.style.ERROR(f'    ERROR al enviar a {certificado.destinatario_email}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Proceso completado.'))
        self.stdout.write(f' -> Enviados exitosamente: {enviados_count}')
        self.stdout.write(f' -> Envíos fallidos: {fallidos_count}')
