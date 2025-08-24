
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import AttendeeForm, CompanyForm, AttendeeFormSet
from .models import Attendee, Company, Registration

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
