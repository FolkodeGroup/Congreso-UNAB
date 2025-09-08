from django.db import models
from django.contrib.auth.models import User
from io import BytesIO
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


class Disertante(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=200)
    bio = models.TextField(verbose_name="Biografía")
    foto_url = models.CharField(max_length=300, blank=True, verbose_name="URL de la Foto")
    tema_presentacion = models.CharField(max_length=255, verbose_name="Título de la Presentación")

    def __str__(self):
        return self.nombre

class Programa(models.Model):
    AULA_CHOICES = [
        ("Aula Magna", "Aula Magna"),
        ("Aula 1", "Aula 1"),
        ("Aula 2", "Aula 2"),
        ("Aula 3", "Aula 3"),
        ("Aula 4", "Aula 4"),
        ("Aula 5", "Aula 5"),
        ("Aula 6", "Aula 6"),
        ("Aula 7", "Aula 7"),
        ("Aula 8", "Aula 8"),
        ("Aula 9", "Aula 9"),
        ("Aula 10", "Aula 10"),
    ]
    titulo = models.CharField(max_length=255, verbose_name="Título del Evento")
    disertante = models.ForeignKey(Disertante, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Disertante")
    hora_inicio = models.TimeField(verbose_name="Hora de Inicio")
    hora_fin = models.TimeField(verbose_name="Hora de Fin")
    dia = models.DateField(verbose_name="Día del Evento")
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    aula = models.CharField(max_length=30, choices=AULA_CHOICES, verbose_name="Aula")

    def __str__(self):
        return f"{self.titulo} - {self.dia} {self.hora_inicio}"

class Empresa(models.Model):
    razon_social = models.CharField(max_length=255, verbose_name="Razón Social")
    cuit = models.CharField(max_length=13, unique=True)
    logo_url = models.URLField(max_length=300, blank=True, verbose_name="URL del Logo")
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name="Dirección")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    contact_person_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nombre Persona de Contacto")
    contact_person_email = models.EmailField(blank=True, null=True, verbose_name="Email Persona de Contacto")
    contact_person_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono Persona de Contacto")
    participation_options = models.JSONField(blank=True, null=True, verbose_name="Opciones de Participación")

    def __str__(self):
        return self.razon_social

class Asistente(models.Model):
    class ProfileType(models.TextChoices):
        VISITOR = 'VISITOR', 'Visitante'
        STUDENT = 'STUDENT', 'Estudiante'
        TEACHER = 'TEACHER', 'Docente'
        PROFESSIONAL = 'PROFESSIONAL', 'Profesional'
        GROUP_REPRESENTATIVE = 'GROUP_REPRESENTATIVE', 'Representante de Grupo'

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    dni = models.CharField(max_length=10, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    profile_type = models.CharField(
        max_length=30,
        choices=ProfileType.choices,
        default=ProfileType.VISITOR,
        verbose_name="Tipo de Perfil"
    )

    # Conditional fields based on profile_type
    university = models.CharField(max_length=255, blank=True, null=True, verbose_name="Universidad")
    student_id = models.CharField(max_length=50, blank=True, null=True, verbose_name="Número de Estudiante")
    institution = models.CharField(max_length=255, blank=True, null=True, verbose_name="Institución")
    occupation = models.CharField(max_length=255, blank=True, null=True, verbose_name="Ocupación")
    company_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nombre de la Empresa (Profesional)")

    asistencia_confirmada = models.BooleanField(default=False, verbose_name="Asistencia Confirmada")
    fecha_confirmacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Confirmación")

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Inscripcion(models.Model):
    asistente = models.ForeignKey(Asistente, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_grupo = models.CharField(max_length=100, blank=True, verbose_name="Nombre del Grupo")
    fecha_inscripcion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Inscripción")

    def __str__(self):
        return f"Inscripción de {self.asistente.first_name} {self.asistente.last_name}"

class MiembroGrupo(models.Model):
    inscripcion = models.ForeignKey(Inscripcion, on_delete=models.CASCADE, related_name='miembros_grupo')
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    dni = models.CharField(max_length=10, verbose_name="DNI")
    email = models.EmailField(verbose_name="Email")

    def __str__(self):
        return f"{self.first_name} {self.last_name} (Grupo: {self.inscripcion.nombre_grupo})"

class Certificado(models.Model):
    class TipoCertificado(models.TextChoices):
        ASISTENCIA = 'ASISTENCIA', 'Asistencia'
        DISERTANTE = 'DISERTANTE', 'Disertante'
        EMPRESA = 'EMPRESA', 'Empresa'

    asistente = models.ForeignKey(Asistente, on_delete=models.CASCADE)
    tipo_certificado = models.CharField(max_length=10, choices=TipoCertificado.choices, verbose_name="Tipo de Certificado")
    pdf_generado = models.FileField(upload_to='certificados/', blank=True, null=True, verbose_name="PDF Generado")
    fecha_generacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Generación")

    def __str__(self):
        return f"Certificado de {self.get_tipo_certificado_display()} para {self.asistente.first_name} {self.asistente.last_name}"

    def generar_pdf(self, save=True):
        """
        Genera un PDF de certificado y lo guarda en el campo 'pdf_generado'.
        """
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(300, 700, "Certificado de Asistencia")
        c.setFont("Helvetica", 14)
        c.drawCentredString(300, 650, f"Se certifica que {self.asistente.first_name} {self.asistente.last_name}")
        c.drawCentredString(300, 630, f"asistió a la Convención de Logística UNaB")
        c.drawCentredString(300, 610, f"Fecha de emisión: {self.fecha_generacion.strftime('%d/%m/%Y')}")
        c.setFont("Helvetica", 10)
        c.drawCentredString(300, 570, "Folkode Group - UNaB 2025")
        
        c.showPage()
        c.save()
        buffer.seek(0)
        
        file_name = f"certificado_{self.asistente.email}.pdf"
        self.pdf_generado.save(file_name, ContentFile(buffer.getvalue()), save=save)