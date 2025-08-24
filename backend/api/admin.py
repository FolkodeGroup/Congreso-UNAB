
from django.contrib import admin
from .models import Company, Attendee, Registration, Certificate

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
	list_display = ('name', 'contact_email', 'contact_phone', 'created_at')
	search_fields = ('name', 'contact_email', 'contact_phone')
	list_filter = ('created_at',)

@admin.register(Attendee)
class AttendeeAdmin(admin.ModelAdmin):
	list_display = ('first_name', 'last_name', 'email', 'company', 'registered_at', 'qr_code')
	search_fields = ('first_name', 'last_name', 'email')
	list_filter = ('company', 'registered_at')

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
	list_display = ('attendee', 'event_name', 'status', 'registered_at', 'attended_at', 'certified_at')
	search_fields = ('attendee__first_name', 'attendee__last_name', 'attendee__email', 'event_name')
	list_filter = ('status', 'event_name', 'registered_at')
	actions = ['mark_as_attended', 'mark_as_certified']

	def mark_as_attended(self, request, queryset):
		updated = queryset.update(status='attended')
		self.message_user(request, f"{updated} registros marcados como 'Asistió'.")
	mark_as_attended.short_description = "Marcar como Asistió"

	def mark_as_certified(self, request, queryset):
		updated = queryset.update(status='certified')
		self.message_user(request, f"{updated} registros marcados como 'Certificado Enviado'.")
	mark_as_certified.short_description = "Marcar como Certificado Enviado"

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
	list_display = ('registration', 'pdf', 'sent', 'sent_at', 'created_at')
	search_fields = ('registration__attendee__email', 'registration__event_name')
	list_filter = ('sent', 'created_at')
