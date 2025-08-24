from rest_framework import serializers
from .models import Attendee, Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'contact_email', 'contact_phone']

class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'participant_type', 'registered_at', 'qr_code'
        ]
