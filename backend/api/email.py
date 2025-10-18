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
    'evento_fecha': '15 de Noviembre de 2025',
    'evento_hora': '09:00',
    'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
    'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251115T120000Z/20251115T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
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
        'evento_fecha': '15 de Noviembre de 2025',
        'evento_hora': '09:00',
        'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
        'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251115T120000Z/20251115T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
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

def send_individual_confirmation_email(asistente):
    """
    Envía email de confirmación a un asistente individual.
    """
    try:
        # Determinar el tipo de inscripción
        tipo_inscripcion = "Individual"
        if asistente.profile_type == asistente.ProfileType.STUDENT:
            tipo_inscripcion = "Estudiante"
        elif asistente.profile_type == asistente.ProfileType.TEACHER:
            tipo_inscripcion = "Docente"
        elif asistente.profile_type == asistente.ProfileType.PROFESSIONAL:
            tipo_inscripcion = "Profesional"
        elif asistente.profile_type == asistente.ProfileType.VISITOR:
            tipo_inscripcion = "Visitante"
        elif asistente.profile_type == asistente.ProfileType.GRADUADO:
            tipo_inscripcion = "Graduado"
        elif asistente.profile_type == asistente.ProfileType.OTRO:
            tipo_inscripcion = "Otro"
        
        context = {
            'asistente_nombre': asistente.nombre_completo,
            'asistente_email': asistente.email,
            'tipo_inscripcion': tipo_inscripcion,
            'empresa': None,
            'year': 2025,
            'evento_nombre': 'Congreso de Logística UNAB',
            'evento_fecha': '15 de Noviembre de 2025',
            'evento_hora': '09:00',
            'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
            'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251115T120000Z/20251115T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
        }
        
        html_content = render_to_string('api/email/confirmacion.html', context)
        text_content = strip_tags(html_content)
        
        import os
        from email.mime.image import MIMEImage
        logo_env = os.getenv('LOGO_CONGRESO_PATH', 'media/logo.png')
        logo_path = os.path.join(settings.BASE_DIR, logo_env)
        
        email = EmailMultiAlternatives(
            subject='Confirmación de Inscripción al Congreso de Logística UNAB',
            body=text_content,
            from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[asistente.email],
        )
        email.attach_alternative(html_content, "text/html")
        
        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as f:
                logo_img = MIMEImage(f.read(), _subtype="png")
                logo_img.add_header('Content-ID', '<logo_congreso>')
                logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
                email.attach(logo_img)
        
        email.send()
        print(f"[INFO] Email de confirmación enviado a: {asistente.email}")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error enviando email a {asistente.email}: {e}")
        return False

def send_bulk_confirmation_email(asistente, es_carga_masiva=False, es_recordatorio=False, fecha_evento=None):
    """
    Envía email de confirmación específico para registros cargados masivamente.
    Incluye solicitud de datos faltantes si es necesario.
    
    Args:
        asistente: Objeto Asistente
        es_carga_masiva: Boolean - Si es parte de una carga masiva
        es_recordatorio: Boolean - Si es un email de recordatorio
        fecha_evento: String - Fecha del evento (formato YYYY-MM-DD), default usa fecha configurada
    """
    try:
        # Configurar fecha del evento
        if fecha_evento:
            from datetime import datetime
            try:
                fecha_dt = datetime.strptime(fecha_evento, '%Y-%m-%d')
                fecha_legible = fecha_dt.strftime('%d de %B de %Y')
                # Mantener formato de fecha para URL de Google Calendar
                fecha_calendar = fecha_evento.replace('-', '') + 'T120000Z/' + fecha_evento.replace('-', '') + 'T210000Z'
            except:
                fecha_legible = '15 de noviembre de 2025'
                fecha_calendar = '20251115T120000Z/20251115T210000Z'
        else:
            fecha_legible = '15 de noviembre de 2025'
            fecha_calendar = '20251115T120000Z/20251115T210000Z'
        
        # Verificar si faltan datos importantes
        datos_faltantes = []
        if not asistente.dni:
            datos_faltantes.append("DNI")
        if not asistente.phone:
            datos_faltantes.append("Teléfono")
        
        # Determinar el tipo de inscripción
        tipo_inscripcion = "Individual"
        if asistente.profile_type == asistente.ProfileType.STUDENT:
            tipo_inscripcion = "Estudiante"
        elif asistente.profile_type == asistente.ProfileType.TEACHER:
            tipo_inscripcion = "Docente"
        elif asistente.profile_type == asistente.ProfileType.PROFESSIONAL:
            tipo_inscripcion = "Profesional"
        elif asistente.profile_type == asistente.ProfileType.VISITOR:
            tipo_inscripcion = "Visitante"
        elif asistente.profile_type == asistente.ProfileType.GRADUADO:
            tipo_inscripcion = "Graduado"
        elif asistente.profile_type == asistente.ProfileType.OTRO:
            tipo_inscripcion = "Otro"
        
        context = {
            'asistente_nombre': asistente.nombre_completo,
            'asistente_email': asistente.email,
            'tipo_inscripcion': tipo_inscripcion,
            'rol_especifico': asistente.rol_especifico if asistente.rol_especifico else None,
            'empresa': None,
            'year': 2025,
            'evento_nombre': 'Congreso de Logística UNAB',
            'evento_fecha': fecha_legible,
            'evento_hora': '09:00',
            'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
            'google_calendar_url': f"https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates={fecha_calendar}&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires",
            'es_carga_masiva': es_carga_masiva,
            'es_recordatorio': es_recordatorio,
            'datos_faltantes': datos_faltantes
        }
        
        # Usar template específico para carga masiva si hay datos faltantes
        template_name = 'api/email/confirmacion_masiva.html' if es_carga_masiva and datos_faltantes else 'api/email/confirmacion.html'
        
        html_content = render_to_string(template_name, context)
        text_content = strip_tags(html_content)
        
        import os
        from email.mime.image import MIMEImage
        logo_env = os.getenv('LOGO_CONGRESO_PATH', 'media/logo.png')
        logo_path = os.path.join(settings.BASE_DIR, logo_env)
        
        subject_suffix = " - Completar datos faltantes" if datos_faltantes else ""
        email = EmailMultiAlternatives(
            subject=f'Confirmación de Inscripción al Congreso de Logística UNAB{subject_suffix}',
            body=text_content,
            from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[asistente.email],
        )
        email.attach_alternative(html_content, "text/html")
        
        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as f:
                logo_img = MIMEImage(f.read(), _subtype="png")
                logo_img.add_header('Content-ID', '<logo_congreso>')
                logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
                email.attach(logo_img)
        
        email.send()
        print(f"[INFO] Email de confirmación {'masiva' if es_carga_masiva else 'individual'} enviado a: {asistente.email}")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error enviando email a {asistente.email}: {e}")
        return False

def send_group_confirmation_emails(representante):
    """
    Envía emails de confirmación al representante del grupo y a todos sus miembros.
    """
    emails_enviados = []
    emails_fallidos = []
    
    try:
        # Enviar email al representante
        context_representante = {
            'asistente_nombre': representante.nombre_completo,
            'asistente_email': representante.email,
            'tipo_inscripcion': "Representante de Grupo",
            'empresa': None,
            'year': 2025,
            'evento_nombre': 'Congreso de Logística UNAB',
            'evento_fecha': '15 de Noviembre de 2025',
            'evento_hora': '09:00',
            'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
            'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251115T120000Z/20251115T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
        }
        
        html_content = render_to_string('api/email/confirmacion.html', context_representante)
        text_content = strip_tags(html_content)
        
        import os
        from email.mime.image import MIMEImage
        logo_env = os.getenv('LOGO_CONGRESO_PATH', 'media/logo.png')
        logo_path = os.path.join(settings.BASE_DIR, logo_env)
        
        email_representante = EmailMultiAlternatives(
            subject='Confirmación de Inscripción Grupal - Congreso de Logística UNAB',
            body=text_content,
            from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[representante.email],
        )
        email_representante.attach_alternative(html_content, "text/html")
        
        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as f:
                logo_img = MIMEImage(f.read(), _subtype="png")
                logo_img.add_header('Content-ID', '<logo_congreso>')
                logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
                email_representante.attach(logo_img)
        
        email_representante.send()
        emails_enviados.append(representante.email)
        print(f"[INFO] Email enviado al representante: {representante.email}")
        
    except Exception as e:
        emails_fallidos.append(f"{representante.email}: {str(e)}")
        print(f"[ERROR] Error enviando email al representante {representante.email}: {e}")
    
    # Enviar emails a cada miembro del grupo
    miembros = representante.get_miembros_grupo()
    for miembro in miembros:
        try:
            context_miembro = {
                'asistente_nombre': miembro.nombre_completo,
                'asistente_email': miembro.email,
                'tipo_inscripcion': f"Miembro del grupo '{representante.group_name}'",
                'empresa': None,
                'year': 2025,
                'evento_nombre': 'Congreso de Logística UNAB',
                'evento_fecha': '15 de Noviembre de 2025',
                'evento_hora': '09:00',
                'evento_ubicacion': 'Campus UNAB, Blas Parera 132, Burzaco, Buenos Aires',
                'google_calendar_url': "https://www.google.com/calendar/render?action=TEMPLATE&text=Congreso+de+Logística+UNAB&dates=20251115T120000Z/20251115T210000Z&details=Congreso+de+Logística+UNAB+2025&location=Campus+UNAB,+Buenos+Aires"
            }
            
            html_content = render_to_string('api/email/confirmacion.html', context_miembro)
            text_content = strip_tags(html_content)
            
            email_miembro = EmailMultiAlternatives(
                subject='Confirmación de Inscripción al Congreso de Logística UNAB',
                body=text_content,
                from_email=f"Congreso UNAB <{settings.EMAIL_HOST_USER}>",
                to=[miembro.email],
            )
            email_miembro.attach_alternative(html_content, "text/html")
            
            if os.path.exists(logo_path):
                with open(logo_path, 'rb') as f:
                    logo_img = MIMEImage(f.read(), _subtype="png")
                    logo_img.add_header('Content-ID', '<logo_congreso>')
                    logo_img.add_header('Content-Disposition', 'inline', filename='logo-congreso.png')
                    email_miembro.attach(logo_img)
            
            email_miembro.send()
            emails_enviados.append(miembro.email)
            print(f"[INFO] Email enviado al miembro: {miembro.email}")
            
        except Exception as e:
            emails_fallidos.append(f"{miembro.email}: {str(e)}")
            print(f"[ERROR] Error enviando email al miembro {miembro.email}: {e}")
    
    # Resumen del envío
    total_emails = len(emails_enviados)
    total_fallidos = len(emails_fallidos)
    
    print(f"[INFO] Resumen del envío grupal:")
    print(f"[INFO] - Emails enviados exitosamente: {total_emails}")
    print(f"[INFO] - Emails fallidos: {total_fallidos}")
    
    if emails_fallidos:
        print(f"[ERROR] Emails fallidos: {emails_fallidos}")
    
    return {
        'emails_enviados': emails_enviados,
        'emails_fallidos': emails_fallidos,
        'total_emails': total_emails,
        'total_fallidos': total_fallidos
    }

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

def send_new_company_notification(empresa_instance):
    """
    Envía un email de notificación interna cuando se registra una nueva empresa.
    El email se envía a una casilla fija con los datos y el logo adjunto.
    """
    try:
        context = {
            'empresa': empresa_instance,
            'evento_nombre': 'Congreso de Logística UNAB',
        }
        html_content = render_to_string('api/email/notificacion_empresa.html', context)
        text_content = strip_tags(html_content)

        notification_email = 'congresologisticaytransporte@unab.edu.ar'

        email = EmailMultiAlternatives(
            subject=f'Nueva Empresa Registrada: {empresa_instance.nombre_empresa}',
            body=text_content,
            from_email=f"Sistema Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[notification_email],
        )
        email.attach_alternative(html_content, "text/html")

        if empresa_instance.logo and hasattr(empresa_instance.logo, 'read'):
            empresa_instance.logo.seek(0)
            email.attach(
                empresa_instance.logo.name,
                empresa_instance.logo.read(),
                empresa_instance.logo.file.content_type
            )

        email.send(fail_silently=False)
        print(f"[INFO] Notificación de nueva empresa enviada a: {notification_email}")
    except Exception as e:
        print(f"[ERROR] Error enviando notificación de nueva empresa: {e}")
        # No relanzamos el error para no interrumpir el flujo principal

def send_new_attendee_notification(asistente_instance):
    """
    Envía un email de notificación interna cuando se registra un nuevo asistente.
    """
    try:
        context = {
            'asistente': asistente_instance,
            'evento_nombre': 'Congreso de Logística UNAB',
        }
        html_content = render_to_string('api/email/notificacion_asistente.html', context)
        text_content = strip_tags(html_content)
        notification_email = 'congresologisticaytransporte@unab.edu.ar'

        email = EmailMultiAlternatives(
            subject=f'Nuevo Asistente Registrado: {asistente_instance.nombre_completo}',
            body=text_content,
            from_email=f"Sistema Congreso UNAB <{settings.EMAIL_HOST_USER}>",
            to=[notification_email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        print(f"[INFO] Notificación de nuevo asistente enviada a: {notification_email}")
    except Exception as e:
        print(f"[ERROR] Error enviando notificación de nuevo asistente: {e}")