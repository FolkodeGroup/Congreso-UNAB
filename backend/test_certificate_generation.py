
import os
import django
import sys
from datetime import date

# Agrega la ruta del proyecto al sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Asistente, Disertante, Certificado

def run_test():
    print("--- Iniciando prueba de generación de certificados ---")

    # --- 1. Crear y generar certificado para un Asistente de prueba ---
    try:
        asistente, created = Asistente.objects.get_or_create(
            email='test.asistente@example.com',
            defaults={
                'first_name': 'Juan',
                'last_name': 'Pérez Prueba',
                'dni': '12345678',
                'profile_type': Asistente.ProfileType.VISITOR
            }
        )
        if created:
            print(f"Asistente de prueba '{asistente.nombre_completo}' creado.")
        else:
            print(f"Asistente de prueba '{asistente.nombre_completo}' ya existía.")

        cert_asistente, created = Certificado.objects.get_or_create(
            asistente=asistente,
            tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
        )
        if created:
            print("Certificado de asistencia creado. Generando PDF...")
        else:
            print("Certificado de asistencia ya existía. Regenerando PDF...")

        cert_asistente.generar_pdf()
        print(f"PDF generado para Asistente. Revisa el archivo en: backend/media/{cert_asistente.pdf_generado.name}")

    except Exception as e:
        print(f"\nERROR al generar certificado de Asistente: {e}")
        import traceback
        traceback.print_exc()


    # --- 2. Crear y generar certificado para un Disertante de prueba ---
    try:
        disertante, created = Disertante.objects.get_or_create(
            nombre='Dra. Ana García Prueba',
            defaults={'bio': 'Experta en logística internacional.'}
        )
        if created:
            print(f"\nDisertante de prueba '{disertante.nombre}' creado.")
        else:
            print(f"\nDisertante de prueba '{disertante.nombre}' ya existía.")

        cert_disertante, created = Certificado.objects.get_or_create(
            disertante=disertante,
            tipo_certificado=Certificado.TipoCertificado.DISERTANTE
        )
        if created:
            print("Certificado de disertante creado. Generando PDF...")
        else:
            print("Certificado de disertante ya existía. Regenerando PDF...")

        cert_disertante.generar_pdf()
        print(f"PDF generado para Disertante. Revisa el archivo en: backend/media/{cert_disertante.pdf_generado.name}")

    except Exception as e:
        print(f"\nERROR al generar certificado de Disertante: {e}")
        import traceback
        traceback.print_exc()

    print("\n--- Prueba finalizada ---")

if __name__ == '__main__':
    run_test()
