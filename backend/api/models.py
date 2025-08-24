
from django.db import models

class Company(models.Model):
	name = models.CharField(max_length=255)
	contact_email = models.EmailField(blank=True, null=True)
	contact_phone = models.CharField(max_length=50, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name



import qrcode
from io import BytesIO
from django.core.files.base import ContentFile


class Attendee(models.Model):
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	email = models.EmailField(unique=True)
	phone = models.CharField(max_length=30, blank=True, null=True)
	company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='attendees')
	position = models.CharField(max_length=100, blank=True, null=True)
	PARTICIPANT_TYPES = [
		('estudiante', 'Estudiante'),
		('profesor', 'Profesor'),
		('gerente', 'Gerente'),
		('ponente', 'Ponente'),
		('otro', 'Otro'),
	]
	participant_type = models.CharField(max_length=30, choices=PARTICIPANT_TYPES, blank=True, null=True)
	registered_at = models.DateTimeField(auto_now_add=True)
	qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

	def __str__(self):
		return f"{self.first_name} {self.last_name}"

	def save(self, *args, **kwargs):
		# Generar QR solo si no existe
		if not self.qr_code:
			qr_data = f"asistente:{self.pk or ''}:{self.email}"
			qr = qrcode.make(qr_data)
			buffer = BytesIO()
			qr.save(buffer, format='PNG')
			file_name = f"qr_{self.email}.png"
			self.qr_code.save(file_name, ContentFile(buffer.getvalue()), save=False)
		super().save(*args, **kwargs)


class Registration(models.Model):
	attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name='registrations')
	event_name = models.CharField(max_length=255)
	status = models.CharField(max_length=50, choices=[('registered', 'Registrado'), ('attended', 'Asistió'), ('certified', 'Certificado Enviado')], default='registered')
	registered_at = models.DateTimeField(auto_now_add=True)
	attended_at = models.DateTimeField(blank=True, null=True)
	certified_at = models.DateTimeField(blank=True, null=True)

	def __str__(self):
		return f"{self.attendee} - {self.event_name}"



from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

class Certificate(models.Model):
	registration = models.OneToOneField(Registration, on_delete=models.CASCADE, related_name='certificate')
	pdf = models.FileField(upload_to='certificates/', blank=True, null=True)
	sent = models.BooleanField(default=False)
	sent_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Certificado de {self.registration.attendee} para {self.registration.event_name}"

	def generate_pdf(self):
		buffer = BytesIO()
		c = canvas.Canvas(buffer, pagesize=letter)
		attendee = self.registration.attendee
		c.setFont("Helvetica-Bold", 20)
		c.drawCentredString(300, 700, "Certificado de Asistencia")
		c.setFont("Helvetica", 14)
		c.drawCentredString(300, 650, f"Se certifica que {attendee.first_name} {attendee.last_name}")
		c.drawCentredString(300, 630, f"asistió a la Convención de Logística UNaB")
		c.drawCentredString(300, 610, f"Fecha de registro: {attendee.registered_at.strftime('%d/%m/%Y')}")
		c.setFont("Helvetica", 10)
		c.drawCentredString(300, 570, "Folkode Group - UNaB 2025")
		c.showPage()
		c.save()
		buffer.seek(0)
		file_name = f"certificado_{attendee.email}.pdf"
		self.pdf.save(file_name, ContentFile(buffer.getvalue()), save=False)
		self.save()
