import qrcode
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import io
from xhtml2pdf import pisa
from datetime import date
def send_empresa_confirmation_email(empresa_instance):
    # Contexto para la plantilla de email
    context = {
        'empresa_nombre': empresa_instance.nombre_empresa,
        'contacto_nombre': empresa_instance.nombre_contacto,
        'contacto_email': empresa_instance.email_contacto,
        'year': 2025,
        'evento_nombre': 'Congreso de Logística UNAB',
        'evento_fecha': '25 de Octubre de 2025',
        'evento_hora': '09:00',
        'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
        'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251025T120000Z/20251025T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
    }

    # Renderizar la plantilla HTML
    html_content = render_to_string('api/email/confirmacion.html', context)
    text_content = strip_tags(html_content)

    import os
    from email.mime.image import MIMEImage
    logo_env = os.getenv('LOGO_CONGRESO_PATH', 'media/logo.png')
    logo_path = os.path.join(settings.BASE_DIR, logo_env)

    email = EmailMultiAlternatives(
        subject='Confirmación de Registro Empresarial - Congreso de Logística UNAB',
        body=text_content,
        from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
        to=[empresa_instance.email_contacto],
    )
    email.attach_alternative(html_content, "text/html")
    if os.path.exists(logo_path):
        with open(logo_path, 'rb') as f:
            logo_img = MIMEImage(f.read(), _subtype="png")
            logo_img.add_header('Content-ID', '<logo_congreso>')
            logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
            email.attach(logo_img)
    email.send()

def send_confirmation_email(inscripcion_instance):
    asistente = inscripcion_instance.asistente
    # Contexto para la plantilla de email
    context = {
        'asistente_nombre': asistente.nombre_completo,
        'asistente_email': asistente.email,
        'tipo_inscripcion': "Individual", # inscripcion_instance.get_tipo_inscripcion_display(),
        'empresa': inscripcion_instance.empresa.nombre_empresa if inscripcion_instance.empresa else None,
        'year': 2025, # Puedes hacerlo dinámico si lo necesitas
        'evento_nombre': 'Congreso de Logística UNAB',
        'evento_fecha': '25 de Octubre de 2025', # Actualiza según corresponda
        'evento_hora': '09:00', # Actualiza según corresponda
        'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires', # Actualiza según corresponda
    'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251025T120000Z/20251025T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
    }

    # Renderizar la plantilla HTML
    html_content = render_to_string('api/email/confirmacion.html', context)
    text_content = strip_tags(html_content) # Versión de texto plano

    import os
    from email.mime.image import MIMEImage

    logo_env = os.getenv('LOGO_CONGRESO_PATH', 'media/logo.png')
    logo_path = os.path.join(settings.BASE_DIR, logo_env)

    # Crear el email con HTML y texto plano
    email = EmailMultiAlternatives(
        subject='Confirmación de Inscripción al Congreso de Logística UNAB',
        body=text_content,
        from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
        to=[asistente.email],
    )
    email.attach_alternative(html_content, "text/html")

    # Adjuntar el logo embebido
    if os.path.exists(logo_path):
        with open(logo_path, 'rb') as f:
            logo_img = MIMEImage(f.read(), _subtype="png")
            logo_img.add_header('Content-ID', '<logo_congreso>')
            logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
            email.attach(logo_img)
        print(f"[INFO] Logo embebido correctamente: {logo_path}")
    else:
        print(f"[ERROR] No se encontró el logo en {logo_path}")

    email.send()

def send_certificate_email(certificado_instance):
    asistente = certificado_instance.asistente

    # Contexto para la plantilla del certificado
    context = {
        'asistente_nombre': asistente.nombre_completo,
        'fecha_emision': date.today().strftime("%d de %B de %Y"),
    }

    try:
        # Renderizar la plantilla HTML del certificado
        html_string = render_to_string('api/certificate/asistencia.html', context)

        # Generar el PDF con xhtml2pdf
        pdf_file_buffer = io.BytesIO()
        result = pisa.CreatePDF(html_string, dest=pdf_file_buffer)
        
        if result.err:
            raise Exception(f"Error generando PDF: {result.err}")
        
        pdf_file = pdf_file_buffer.getvalue()

        # Guardar el PDF en el modelo Certificado
        from django.core.files.base import ContentFile
        certificado_instance.pdf_generado.save(
            f'certificado_{asistente.nombre_completo.replace(" ", "_")}_{asistente.dni}.pdf',
            ContentFile(pdf_file),
            save=True
        )

        # Crear el email
        email = EmailMultiAlternatives(
            subject='Certificado de Asistencia al Congreso de Logística UNAB',
            body='Adjuntamos tu certificado de asistencia al Congreso de Logística UNAB.',
            from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[asistente.email],
        )
        email.attach(
            f'Certificado_{asistente.nombre_completo.replace(" ", "_")}.pdf',
            pdf_file,
            'application/pdf'
        )
        
        # Enviar el email
        email.send(fail_silently=False)
        print(f"Certificado enviado exitosamente a {asistente.email}")
        
    except Exception as e:
        print(f"Error enviando certificado a {asistente.email}: {e}")
        # Re-raise para que el error se propague
        raise Exception(f"Error enviando certificado: {e}")