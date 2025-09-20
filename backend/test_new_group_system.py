#!/usr/bin/env python
"""Script de prueba para el nuevo sistema de inscripción grupal."""
import os
import sys
import django
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Asistente
from django.test import RequestFactory
from django.http import JsonResponse
from api.views import RegistroParticipantesView

def test_group_registration():
    """Prueba del nuevo sistema de inscripción grupal"""
    
    # Datos de prueba para inscripción grupal
    test_data = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "dni": "12345678",
        "email": "juan.perez@empresa.com",
        "phone": "1234567890",
        "profile_type": "GROUP_REPRESENTATIVE",
        "group_name": "Empresa de Logística ABC",
        "group_municipality": "Buenos Aires",
        "group_size": 3,
        "miembros_grupo_nuevos": [
            {
                "first_name": "María",
                "last_name": "García",
                "dni": "87654321",
                "email": "maria.garcia@empresa.com"
            },
            {
                "first_name": "Carlos",
                "last_name": "López",
                "dni": "11223344",
                "email": "carlos.lopez@empresa.com"
            },
            {
                "first_name": "Ana",
                "last_name": "Martínez",
                "dni": "44332211",
                "email": "ana.martinez@empresa.com"
            }
        ]
    }
    
    print("Probando inscripción grupal con el nuevo sistema...")
    print(f"Representante: {test_data['first_name']} {test_data['last_name']}")
    print(f"Grupo: {test_data['group_name']}")
    print(f"Cantidad de miembros: {test_data['group_size']}")
    
    try:
        # Usar el serializer directamente
        from api.serializers import AsistenteSerializer
        serializer = AsistenteSerializer(data=test_data)
        
        if serializer.is_valid():
            asistente = serializer.save()
            print(f"✅ Inscripción exitosa!")
            print(f"   Representante creado: {asistente.nombre_completo} (ID: {asistente.id})")
            print(f"   Miembros representados: {asistente.get_cantidad_miembros_actual()}")
            
            # Listar miembros
            miembros = asistente.get_miembros_grupo()
            for i, miembro in enumerate(miembros, 1):
                print(f"   Miembro {i}: {miembro.nombre_completo} - {miembro.email}")
                
            return True
        else:
            print(f"❌ Error de validación: {serializer.errors}")
            return False
            
    except Exception as e:
        print(f"❌ Error durante la prueba: {str(e)}")
        return False

def check_database_state():
    """Verifica el estado de la base de datos"""
    print("\n--- Estado de la Base de Datos ---")
    
    representantes = Asistente.objects.filter(profile_type=Asistente.ProfileType.GROUP_REPRESENTATIVE)
    print(f"Representantes de grupo: {representantes.count()}")
    
    miembros = Asistente.objects.filter(representante_grupo__isnull=False)
    print(f"Miembros de grupo: {miembros.count()}")
    
    for rep in representantes:
        print(f"  {rep.nombre_completo} representa {rep.get_cantidad_miembros_actual()} miembros")

if __name__ == '__main__':
    print("=== PRUEBA DEL NUEVO SISTEMA DE INSCRIPCIÓN GRUPAL ===\n")
    
    # Limpiar datos de prueba previos
    Asistente.objects.filter(email__contains="empresa.com").delete()
    print("Datos de prueba previos eliminados.\n")
    
    success = test_group_registration()
    
    check_database_state()
    
    if success:
        print("\n✅ ¡Prueba completada exitosamente!")
    else:
        print("\n❌ La prueba falló.")
