#!/usr/bin/env python
"""
Script para limpiar y validar el campo DNI de los asistentes en la base de datos.

Funcionalidades:
1.  Elimina caracteres no numéricos (puntos, letras, etc.).
2.  Si un DNI tiene más de 8 dígitos y termina en '0', elimina ese último cero.
3.  Muestra los asistentes sin DNI.
4.  Pide confirmación antes de aplicar los cambios.
"""
import os
import sys
import django
import re

# Forzar el modo de desarrollo para usar la base de datos SQLite local
os.environ.setdefault('DJANGO_ENV', 'development')

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Añadir la ruta del backend al path de Python para poder importar los modelos
# Asegúrate de que esta ruta sea correcta para tu estructura de proyecto
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from api.models import Asistente

def clean_dni_script(list_only=False):
    """
    Función principal que limpia los DNIs y lista los asistentes sin DNI.
    
    Args:
        list_only (bool): Si es True, solo lista los asistentes sin DNI y termina.
    """
    print("--- Limpieza y Validación de DNIs de Asistentes ---")

    # 1. Encontrar asistentes sin DNI
    asistentes_sin_dni = Asistente.objects.filter(dni__isnull=True) | Asistente.objects.filter(dni='')
    count_sin_dni = asistentes_sin_dni.count()
    
    print(f"\n[INFO] Se encontraron {count_sin_dni} asistentes sin DNI:")
    if count_sin_dni > 0:
        for asistente in asistentes_sin_dni:
            print(f"  - ID: {asistente.id}, Nombre: {asistente.first_name} {asistente.last_name}, Email: {asistente.email}")
    else:
        print("  (No se encontraron asistentes sin DNI)")

    print("\n" + "="*50 + "\n")

    # 2. Encontrar y proponer correcciones para DNIs inválidos
    asistentes_a_corregir = []
    todos_los_asistentes = Asistente.objects.exclude(dni__isnull=True).exclude(dni='')

    print("[INFO] Buscando DNIs para corregir...")
    for asistente in todos_los_asistentes:
        dni_original = asistente.dni

        # Eliminar cualquier caracter que no sea un dígito
        dni_limpio = re.sub(r'\D', '', dni_original)

        # Un DNI válido en Argentina tiene exactamente 8 dígitos.
        # Si después de limpiar no tiene 8 dígitos, se considera inválido y se establece como nulo.
        if len(dni_limpio) == 8:
            dni_corregido = dni_limpio
        else:
            # Si no tiene 8 dígitos, no es un DNI válido, se borra.
            dni_corregido = None

        if dni_corregido != dni_original:
            asistentes_a_corregir.append({
                'asistente': asistente,
                'dni_original': dni_original,
                'dni_corregido': dni_corregido
            })

    if not asistentes_a_corregir:
        print("\n[SUCCESS] No se encontraron DNIs que necesiten corrección. ¡Todo en orden!")
        return

    print(f"\n[ATENCIÓN] Se encontraron {len(asistentes_a_corregir)} DNIs para corregir:")
    for item in asistentes_a_corregir:
        print(f"  - ID: {item['asistente'].id}, Nombre: {item['asistente'].first_name}, DNI Original: '{item['dni_original']}' -> DNI Corregido: '{item['dni_corregido']}'")

    # 3. Pedir confirmación para aplicar los cambios
    print("\n" + "="*50)
    confirmacion = input("¿Deseas aplicar estos cambios en la base de datos? (s/n): ").lower()

    if confirmacion == 's':
        print("\n[INFO] Aplicando cambios...")
        count = 0
        for item in asistentes_a_corregir:
            asistente = item['asistente']
            asistente.dni = item['dni_corregido']
            asistente.save()
            count += 1
        print(f"\n[SUCCESS] Se corrigieron {count} registros de DNI en la base de datos.")
    else:
        print("\n[CANCELADO] No se realizó ningún cambio en la base de datos.")

if __name__ == "__main__":
    # Comprobar si se pasó el argumento --list-only
    if '--list-only' in sys.argv:
        print("Ejecutando en modo de solo listado...")
        clean_dni_script(list_only=True)
    else:
        clean_dni_script(list_only=False)
