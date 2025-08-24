from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import AttendeeForm, CompanyForm, AttendeeFormSet
from .models import Attendee, Company, Registration
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import AttendeeSerializer, CompanySerializer

@api_view(['POST'])
def api_registrar_asistencia(request):
	"""
	Marca la asistencia de un participante usando email, id o datos del QR.
	Espera: { "email": "..." } o { "attendee_id": 1 }
	"""
	email = request.data.get('email')
	attendee_id = request.data.get('attendee_id')
	if not email and not attendee_id:
		return Response({'error': 'Debe enviar email o attendee_id'}, status=status.HTTP_400_BAD_REQUEST)
	try:
		if attendee_id:
			attendee = Attendee.objects.get(id=attendee_id)
		else:
			attendee = Attendee.objects.get(email=email)
	except Attendee.DoesNotExist:
		return Response({'error': 'Asistente no encontrado'}, status=status.HTTP_404_NOT_FOUND)
	try:
		reg = Registration.objects.get(attendee=attendee, event_name='Convención Logística UNaB')
	except Registration.DoesNotExist:
		return Response({'error': 'Registro de inscripción no encontrado'}, status=status.HTTP_404_NOT_FOUND)
	if reg.attended_at:
		return Response({'message': 'Asistencia ya registrada', 'attended_at': reg.attended_at}, status=status.HTTP_200_OK)
	from django.utils import timezone
	reg.attended_at = timezone.now()
	reg.save()
	return Response({'message': 'Asistencia registrada', 'attended_at': reg.attended_at}, status=status.HTTP_200_OK)



def landing_page(request):
	return render(request, 'api/landing.html')

@api_view(['POST'])
def api_register_individual(request):
	required_fields = ['first_name', 'last_name', 'email', 'participant_type']
	missing = [f for f in required_fields if not request.data.get(f)]
	if missing:
		return Response({
			'error': 'Faltan campos obligatorios',
			'missing_fields': missing
		}, status=status.HTTP_400_BAD_REQUEST)
	# Solo tomar company_name, nunca company (que es para grupal)
	data = dict(request.data)
	data['company'] = None
	if 'company_name' not in data:
		data['company_name'] = request.data.get('company_name') or ''
	serializer = AttendeeSerializer(data=data)
	if serializer.is_valid():
		attendee = serializer.save()
		Registration.objects.create(attendee=attendee, event_name='Convención Logística UNaB')
		return Response({
			'message': 'Inscripción exitosa',
			'attendee': AttendeeSerializer(attendee).data
		}, status=status.HTTP_201_CREATED)
	return Response({'error': 'Datos inválidos', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def api_register_group(request):
	company_data = request.data.get('company')
	attendees_data = request.data.get('attendees', [])
	if not company_data:
		return Response({'error': 'Faltan los datos de la empresa (company)'}, status=status.HTTP_400_BAD_REQUEST)
	if not isinstance(attendees_data, list) or not attendees_data:
		return Response({'error': 'Debe enviar una lista de asistentes (attendees)'}, status=status.HTTP_400_BAD_REQUEST)
	company_required = ['name', 'contact_email']
	missing_company = [f for f in company_required if not company_data.get(f)]
	if missing_company:
		return Response({'error': 'Faltan campos obligatorios en la empresa', 'missing_fields': missing_company}, status=status.HTTP_400_BAD_REQUEST)
	company_serializer = CompanySerializer(data=company_data)
	if company_serializer.is_valid():
		company = company_serializer.save()
		created_attendees = []
		for idx, attendee_data in enumerate(attendees_data):
			attendee_data['company'] = company.id
			attendee_required = ['first_name', 'last_name', 'email', 'participant_type']
			missing_att = [f for f in attendee_required if not attendee_data.get(f)]
			if missing_att:
				return Response({'error': f'Faltan campos en asistente #{idx+1}', 'missing_fields': missing_att}, status=status.HTTP_400_BAD_REQUEST)
			attendee_serializer = AttendeeSerializer(data=attendee_data)
			if attendee_serializer.is_valid():
				attendee = attendee_serializer.save()
				Registration.objects.create(attendee=attendee, event_name='Convención Logística UNaB')
				created_attendees.append(AttendeeSerializer(attendee).data)
			else:
				return Response({'error': f'Datos inválidos en asistente #{idx+1}', 'details': attendee_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
		return Response({
			'message': 'Inscripción grupal exitosa',
			'company': CompanySerializer(company).data,
			'attendees': created_attendees
		}, status=status.HTTP_201_CREATED)
	return Response({'error': 'Datos inválidos en la empresa', 'details': company_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def register_individual(request):
	if request.method == 'POST':
		form = AttendeeForm(request.POST)
		if form.is_valid():
			attendee = form.save()
			# Crear registro de inscripción
			Registration.objects.create(attendee=attendee, event_name='Convención Logística UNaB')
			return redirect('registration_success')
	else:
		form = AttendeeForm()
	return render(request, 'api/register_individual.html', {'form': form})


def register_group(request):
	if request.method == 'POST':
		company_form = CompanyForm(request.POST)
		formset = AttendeeFormSet(request.POST, queryset=Attendee.objects.none())
		if company_form.is_valid() and formset.is_valid():
			company = company_form.save()
			for form in formset:
				if form.cleaned_data and not form.cleaned_data.get('DELETE', False):
					attendee = form.save(commit=False)
					attendee.company = company
					attendee.save()
					Registration.objects.create(attendee=attendee, event_name='Convención Logística UNaB')
			return redirect('registration_success')
	else:
		company_form = CompanyForm()
		formset = AttendeeFormSet(queryset=Attendee.objects.none())
	return render(request, 'api/register_group.html', {'company_form': company_form, 'formset': formset})


def registration_success(request):
	return render(request, 'api/registration_success.html')
