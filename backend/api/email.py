import qrcode
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import io
from xhtml2pdf import pisa
from datetime import date

def send_confirmation_email(inscripcion_instance):
    asistente = inscripcion_instance.asistente
    qr_code = inscripcion_instance.codigoqr.codigo # Corrected related_name

    # Generar el código QR
    qr_img = qrcode.make(str(qr_code))
    qr_img_bytes = io.BytesIO()
    qr_img.save(qr_img_bytes, format='PNG')
    qr_img_bytes.seek(0)

    # Contexto para la plantilla de email
    context = {
        'asistente_nombre': asistente.nombre_completo,
        'asistente_email': asistente.email,
        'tipo_inscripcion': inscripcion_instance.get_tipo_inscripcion_display(),
        'empresa': inscripcion_instance.empresa.razon_social if inscripcion_instance.empresa else None,
        'nombre_grupo': inscripcion_instance.nombre_grupo,
        'year': 2025, # Puedes hacerlo dinámico si lo necesitas
    }

    # Renderizar la plantilla HTML
    html_content = render_to_string('api/email/confirmacion.html', context)
    text_content = strip_tags(html_content) # Versión de texto plano

    # Crear el email
    email = EmailMultiAlternatives(
        subject='Confirmación de Inscripción al Congreso de Logística UNAB',
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[asistente.email],
    )
    email.attach_alternative(html_content, "text/html")

    # Adjuntar el QR como imagen embebida (Content-ID)
    from email.mime.image import MIMEImage
    qr_img_bytes.seek(0)
    qr_image = MIMEImage(qr_img_bytes.read(), _subtype="png")
    qr_image.add_header('Content-ID', '<qr_code_image>')
    qr_image.add_header('Content-Disposition', 'inline', filename='qr_code.png')
    email.attach(qr_image)

    # Adjuntar el QR como archivo descargable (opcional, para que el usuario lo tenga)
    qr_img_bytes.seek(0)
    email.attach('qr_code.png', qr_img_bytes.read(), 'image/png')

    email.send()

def send_certificate_email(certificado_instance):
    asistente = certificado_instance.asistente

    # Contexto para la plantilla del certificado
    context = {
        'asistente_nombre': asistente.nombre_completo,
        'fecha_emision': date.today().strftime("%d de %B de %Y"),
    }

    # Renderizar la plantilla HTML del certificado
    html_string = render_to_string('api/certificate/asistencia.html', context)

    # Generar el PDF con xhtml2pdf
    pdf_file_buffer = io.BytesIO()
    pisa.CreatePDF(html_string, dest=pdf_file_buffer)
    pdf_file = pdf_file_buffer.getvalue()

    # Crear el email
    email = EmailMultiAlternatives(
        subject='Certificado de Asistencia al Congreso de Logística UNAB',
        body='Adjuntamos tu certificado de asistencia al Congreso de Logística UNAB.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[asistente.email],
    )
    email.attach(
        f'Certificado_{asistente.nombre_completo.replace(" ", "_")}.pdf',
        pdf_file,
        'application/pdf'
    )
    email.send()
