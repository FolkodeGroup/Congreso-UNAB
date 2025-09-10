from django.db import models
from django.contrib.auth.models import User
from io import BytesIO
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.utils import timezone

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
    nombre_empresa = models.CharField(max_length=255, verbose_name="Nombre de la empresa o institución")
    nombre_contacto = models.CharField(max_length=255, verbose_name="Nombre completo de la persona de contacto")
    email_contacto = models.EmailField(unique=True, verbose_name="Correo electrónico de la persona de contacto")
    celular_contacto = models.CharField(max_length=20, verbose_name="Número de celular de contacto")
    cargo_contacto = models.CharField(max_length=255, verbose_name="Cargo que cumple en la empresa / institución")
    participacion_opciones = models.JSONField(default=list, verbose_name="¿Cómo les gustaría participar?")
    participacion_otra = models.CharField(max_length=255, blank=True, null=True, verbose_name="Otra forma de participación")

    def __str__(self):
        if self.nombre_empresa:
            return self.nombre_empresa
        return f"Empresa sin nombre (ID: {self.id})"

class Institucion(models.Model):
    nombre_institucion = models.CharField(max_length=255, unique=True)
    es_unab = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_institucion

class Perfil(models.Model):
    TIPO_PERFIL_CHOICES = (
        ('Visitante', 'Visitante'),
        ('Estudiante', 'Estudiante'),
        ('Docente', 'Docente'),
        ('Profesional', 'Profesional'),
        ('Representante', 'Representante'),
    )
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    dni = models.CharField(max_length=15, unique=True)
    tipo_perfil = models.CharField(max_length=20, choices=TIPO_PERFIL_CHOICES)
    institucion = models.ForeignKey(Institucion, on_delete=models.SET_NULL, blank=True, null=True)
    asistencia_confirmada = models.BooleanField(default=False, verbose_name="Asistencia Confirmada")
    fecha_confirmacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Confirmación")

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

class DetallePerfil(models.Model):
    perfil = models.OneToOneField(Perfil, on_delete=models.CASCADE, primary_key=True)
    carrera = models.CharField(max_length=100, blank=True, null=True)
    anio_curso = models.CharField(max_length=20, blank=True, null=True)
    area_trabajo = models.CharField(max_length=100, blank=True, null=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    nombre_grupo = models.CharField(max_length=100, blank=True, null=True)
    partido_grupo = models.CharField(max_length=100, blank=True, null=True)

class MiembroGrupo(models.Model):
    representante = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='miembros_grupo')
    nombre_miembro = models.CharField(max_length=100)
    dni_miembro = models.CharField(max_length=15)

    def __str__(self):
        return self.nombre_miembro

class Certificado(models.Model):
    class TipoCertificado(models.TextChoices):
        ASISTENCIA = 'ASISTENCIA', 'Asistencia'
        DISERTANTE = 'DISERTANTE', 'Disertante'
        EMPRESA = 'EMPRESA', 'Empresa'

    asistente = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    tipo_certificado = models.CharField(max_length=10, choices=TipoCertificado.choices, verbose_name="Tipo de Certificado")
    pdf_generado = models.FileField(upload_to='certificados/', blank=True, null=True, verbose_name="PDF Generado")
    fecha_generacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Generación")

    def __str__(self):
        return f"Certificado de {self.get_tipo_certificado_display()} para {self.asistente.nombre_completo}"

    def generar_pdf(self, save=True):
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(300, 700, "Certificado de Asistencia")
        c.setFont("Helvetica", 14)
        c.drawCentredString(300, 650, f"Se certifica que {self.asistente.nombre_completo}")
        c.drawCentredString(300, 630, f"asistió a la Convención de Logística UNaB")
        c.drawCentredString(300, 610, f"Fecha de emisión: {self.fecha_generacion.strftime('%d/%m/%Y')}")
        c.setFont("Helvetica", 10)
        c.drawCentredString(300, 570, "Folkode Group - UNaB 2025")
        c.showPage()
        c.save()
        buffer.seek(0)
        file_name = f"certificado_{self.asistente.email}.pdf"
        self.pdf_generado.save(file_name, ContentFile(buffer.getvalue()), save=save)

class Inscripcion(models.Model):
    asistente = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_inscripcion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inscripción de {self.asistente} - {self.fecha_inscripcion.strftime('%Y-%m-%d')}"
