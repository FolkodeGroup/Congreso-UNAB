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

    class Meta:
        ordering = ['nombre']

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
    
    CATEGORIA_CHOICES = [
        ("LOGÍSTICA", "Logística"),
        ("TRANSPORTE", "Transporte"),
        ("SUPPLY CHAIN", "Supply Chain"),
        ("TECNOLOGÍA", "Tecnología"),
        ("SOSTENIBILIDAD", "Sostenibilidad"),
        ("INNOVACIÓN", "Innovación"),
        ("GESTIÓN", "Gestión"),
        ("NETWORKING", "Networking"),
    ]
    
    titulo = models.CharField(max_length=255, verbose_name="Título del Evento")
    disertante = models.ForeignKey(Disertante, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Disertante")
    hora_inicio = models.TimeField(verbose_name="Hora de Inicio")
    hora_fin = models.TimeField(verbose_name="Hora de Fin")
    dia = models.DateField(verbose_name="Día del Evento")
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    aula = models.CharField(max_length=30, choices=AULA_CHOICES, verbose_name="Aula")
    categoria = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default="LOGÍSTICA", verbose_name="Categoría")

    def __str__(self):
        return f"{self.titulo} - {self.dia} {self.hora_inicio}"

class Empresa(models.Model):
    # Main Info
    nombre_empresa = models.CharField(max_length=255, verbose_name="Nombre de la empresa o institución")
    cuit = models.CharField(max_length=15, blank=True, null=True, verbose_name="CUIT de la empresa")
    direccion = models.CharField(max_length=500, blank=True, null=True, verbose_name="Dirección de la empresa")
    telefono_empresa = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono de la empresa")
    email_empresa = models.EmailField(blank=True, null=True, verbose_name="Email corporativo de la empresa")
    sitio_web = models.URLField(blank=True, null=True, verbose_name="Sitio web de la empresa")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción de la empresa")
    logo = models.ImageField(upload_to='logos_empresas/', blank=True, null=True, verbose_name="Logo de la empresa")

    # Contact Person
    nombre_contacto = models.CharField(max_length=255, verbose_name="Nombre completo de la persona de contacto")
    email_contacto = models.EmailField(unique=True, verbose_name="Correo electrónico de la persona de contacto")
    celular_contacto = models.CharField(max_length=20, verbose_name="Número de celular de contacto")
    cargo_contacto = models.CharField(max_length=255, verbose_name="Cargo que cumple en la empresa / institución")

    # Participation
    participacion_opciones = models.CharField(max_length=50, verbose_name="¿Cómo les gustaría participar?")
    participacion_otra = models.CharField(max_length=255, blank=True, null=True, verbose_name="Otra forma de participación")

    def __str__(self):
        if self.nombre_empresa:
            return self.nombre_empresa
        return f"Empresa sin nombre (ID: {self.id})"

class Asistente(models.Model):
    class ProfileType(models.TextChoices):
        VISITOR = 'VISITOR', 'Visitante'
        STUDENT = 'STUDENT', 'Estudiante'
        TEACHER = 'TEACHER', 'Docente'
        PROFESSIONAL = 'PROFESSIONAL', 'Profesional'
        GROUP_REPRESENTATIVE = 'GROUP_REPRESENTATIVE', 'Representante de Grupo'

    # --- Información Principal (Común a todos) ---
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    email = models.EmailField(unique=True, verbose_name="Correo electrónico")
    phone = models.CharField(max_length=20, verbose_name="Número de celular")
    dni = models.CharField(max_length=10, unique=True, verbose_name="DNI")
    profile_type = models.CharField(max_length=30, choices=ProfileType.choices, verbose_name="Tipo de Perfil")

    # --- Campos Condicionales ---
    is_unab_student = models.BooleanField(null=True, blank=True, verbose_name="¿Perteneces a la UNaB?")
    institution = models.CharField(max_length=255, blank=True, null=True, verbose_name="Institución (estudio o trabajo)")
    career = models.CharField(max_length=255, blank=True, null=True, verbose_name="Carrera que cursas")
    year_of_study = models.IntegerField(null=True, blank=True, verbose_name="Año que cursas")
    career_taught = models.CharField(max_length=255, blank=True, null=True, verbose_name="Carrera que dictas")
    work_area = models.CharField(max_length=255, blank=True, null=True, verbose_name="Área de trabajo")
    occupation = models.CharField(max_length=255, blank=True, null=True, verbose_name="Cargo")
    company_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nombre de la Empresa")
    group_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Nombre de la institución o grupo")
    group_municipality = models.CharField(max_length=255, blank=True, null=True, verbose_name="Partido al que pertenece la institución")
    group_size = models.IntegerField(null=True, blank=True, verbose_name="Cantidad de personas en el grupo")

    # --- Relación de Grupo ---
    representante_grupo = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='miembros_representados',
        verbose_name="Representante del Grupo"
    )

    # --- Campos de Estado para QR y Certificados ---
    asistencia_confirmada = models.BooleanField(default=False, verbose_name="Asistencia Confirmada")
    fecha_confirmacion = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de Confirmación")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def nombre_completo(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def es_representante_grupo(self):
        """Verifica si este asistente es representante de un grupo"""
        return self.profile_type == self.ProfileType.GROUP_REPRESENTATIVE
    
    @property
    def es_miembro_grupo(self):
        """Verifica si este asistente es miembro de un grupo"""
        return self.representante_grupo is not None
    
    def get_miembros_grupo(self):
        """Obtiene todos los miembros que representa este asistente"""
        if self.es_representante_grupo:
            return self.miembros_representados.all()
        return Asistente.objects.none()
    
    def get_cantidad_miembros_actual(self):
        """Obtiene la cantidad actual de miembros registrados"""
        if self.es_representante_grupo:
            return self.miembros_representados.count()
        return 0

class MiembroGrupo(models.Model):
    representante = models.ForeignKey(Asistente, on_delete=models.CASCADE, related_name='miembros_grupo')
    full_name = models.CharField(max_length=200, verbose_name="Nombre completo")
    dni = models.CharField(max_length=10, verbose_name="DNI")

    def __str__(self):
        return f"{self.full_name} (Grupo de {self.representante})"

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

class Inscripcion(models.Model):
    asistente = models.ForeignKey(Asistente, on_delete=models.CASCADE)
    empresa = models.ForeignKey(Empresa, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_inscripcion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inscripción de {self.asistente} - {self.fecha_inscripcion.strftime('%Y-%m-%d')}"
