from rest_framework import viewsets, mixins, status, views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import Disertante, Inscripcion, Programa, Certificado, Asistente, Empresa, MiembroGrupo
from .serializers import DisertanteSerializer, InscripcionSerializer, AsistenteSerializer, ProgramaSerializer, EmpresaSerializer, MiembroGrupoSerializer, EmpresaLogoSerializer
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from .email import send_certificate_email, send_confirmation_email, send_bulk_confirmation_email
import pandas as pd
import re


class GetCSRFTokenView(views.APIView):
    """
    Vista simple para obtener un token CSRF.
    Esto es útil para aplicaciones frontend que necesitan obtener
    el token antes de hacer peticiones POST.
    
    IMPORTANTE: No usar @ensure_csrf_cookie ya que fuerza HTTPOnly=True
    En su lugar, llamamos manualmente get_token() que respeta CSRF_COOKIE_HTTPONLY=False
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Forzar la creación del token CSRF
        csrf_token = get_token(request)
        return Response({
            'detail': 'CSRF cookie set',
            'csrfToken': csrf_token  # También lo devolvemos en la respuesta por si acaso
        }, status=status.HTTP_200_OK)

class DisertanteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver la lista de disertantes y los detalles de uno específico.
    """
    queryset = Disertante.objects.all()
    serializer_class = DisertanteSerializer
    permission_classes = [AllowAny]

class ProgramaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Un ViewSet para ver el programa del congreso, ordenado por día y hora.
    """
    queryset = Programa.objects.all().order_by('dia', 'hora_inicio')
    serializer_class = ProgramaSerializer
    permission_classes = [AllowAny]

class RegistroEmpresasView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Vista para el registro de empresas.
    """
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            empresa = serializer.save()
            # Enviar email de confirmación al contacto de la empresa
            from .email import send_empresa_confirmation_email
            try:
                send_empresa_confirmation_email(empresa)
            except Exception as e:
                print(f"[ERROR] No se pudo enviar el email de confirmación a la empresa: {e}")
            return Response({'status': 'success', 'message': 'Registro de empresa realizado correctamente.', 'id': empresa.id}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            # Formatear errores de validación de manera legible
            error_messages = {}
            if isinstance(e.detail, dict):
                for field, errors in e.detail.items():
                    if isinstance(errors, list):
                        error_messages[field] = [str(err) for err in errors]
                    else:
                        error_messages[field] = str(errors)
            else:
                error_messages = {'detail': str(e.detail)}
            return Response({'status': 'error', 'message': error_messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegistroParticipantesView(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Vista para el registro de participantes individuales y grupales.
    También permite listar asistentes con información de grupos.
    """
    queryset = Asistente.objects.all()
    serializer_class = AsistenteSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                profile_type = request.data.get('profile_type')
                miembros_grupo_data = request.data.get('miembros_grupo', [])

                asistente_serializer = self.get_serializer(data=request.data)
                asistente_serializer.is_valid(raise_exception=True)
                asistente = asistente_serializer.save() # This will handle MiembroGrupo creation

                return Response({'status': 'success', 'message': 'Registro de participante realizado correctamente.', 'id': asistente.id}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            # Formatear errores de validación de manera legible
            error_messages = {}
            if isinstance(e.detail, dict):
                for field, errors in e.detail.items():
                    if isinstance(errors, list):
                        error_messages[field] = [str(err) for err in errors]
                    else:
                        error_messages[field] = str(errors)
            else:
                error_messages = {'detail': str(e.detail)}
            return Response({'status': 'error', 'message': error_messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InscripcionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Un ViewSet que solo permite la creación de nuevas inscripciones (registros).
    Utiliza el InscripcionSerializer para manejar la lógica de creación, 
    incluyendo la validación de duplicados y la creación del asistente y QR asociados.
    """
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            send_confirmation_email(inscripcion) # Commented out for testing
            headers = self.get_success_headers(serializer.data)
            return Response({'status': 'success', 'message': 'Inscripción realizada correctamente. Se ha enviado un email de confirmación.'}, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            # Formatear errores de validación de manera legible
            error_messages = {}
            if isinstance(e.detail, dict):
                for field, errors in e.detail.items():
                    if isinstance(errors, list):
                        error_messages[field] = [str(err) for err in errors]
                    else:
                        error_messages[field] = str(errors)
            else:
                error_messages = {'detail': str(e.detail)}
            return Response({'status': 'error', 'message': error_messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerificarDNIView(views.APIView):
    """
    Vista para verificar si un DNI está registrado y confirmar asistencia.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        dni = request.data.get('dni')
        if not dni:
            return Response({'status': 'error', 'message': 'No se proporcionó DNI.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            asistente = Asistente.objects.get(dni=dni)
            print(f"DEBUG: Asistente {asistente.dni} asistencia_confirmada: {asistente.asistencia_confirmada}")
        except Asistente.DoesNotExist:
            return Response({'status': 'error', 'message': 'DNI no encontrado en el listado de registrados.'}, status=status.HTTP_404_NOT_FOUND)

        if asistente.asistencia_confirmada:
            # Ensure fecha_confirmacion is not None before calling strftime
            fecha_confirmacion_str = asistente.fecha_confirmacion.strftime("%d/%m/%Y a las %H:%M:%S") if asistente.fecha_confirmacion else "fecha desconocida"
            return Response({
                'status': 'error',
                'message': f'La asistencia ya fue confirmada el {fecha_confirmacion_str}.',
            }, status=status.HTTP_409_CONFLICT)

        # Confirmar asistencia
        asistente.asistencia_confirmada = True
        asistente.fecha_confirmacion = timezone.now()
        asistente.save()

        # Crear certificado de asistencia
        certificado, created = Certificado.objects.get_or_create(
            asistente=asistente,
            tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
        )
        
        # send_certificate_email(certificado) # Commented out for testing

        # Preparar la respuesta con los datos del asistente
        asistente_data = AsistenteSerializer(asistente).data
        
        return Response({
            'status': 'success',
            'message': 'Asistencia confirmada con éxito. Certificado enviado por email.',
            'asistente': asistente_data
        }, status=status.HTTP_200_OK)

class RegistroRapidoView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Vista para registro rápido in-situ en el evento.
    """
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            inscripcion = serializer.save()
            
            # Confirmar asistencia inmediatamente para registro in-situ
            asistente = inscripcion.asistente
            asistente.asistencia_confirmada = True
            asistente.fecha_confirmacion = timezone.now()
            asistente.save()
            
            # Crear certificado de asistencia
            certificado, created = Certificado.objects.get_or_create(
                asistente=asistente,
                tipo_certificado=Certificado.TipoCertificado.ASISTENCIA
            )
            
            # send_certificate_email(certificado) # Commented out for testing
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'status': 'success', 
                'message': 'Registro completado. Asistencia confirmada y certificado enviado por email.'
            }, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response({'status': 'error', 'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': f'Ha ocurrido un error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmpresaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para ver la lista de empresas participantes.
    Solo permite lectura (GET) para mostrar logos en carrusel/slider.
    """
    queryset = Empresa.objects.filter(logo__isnull=False).exclude(logo='').order_by('nombre_empresa')  # Solo empresas con logo
    serializer_class = EmpresaLogoSerializer
    permission_classes = [AllowAny]


class EnvioMasivoEmailsView(views.APIView):
    """
    Vista para envío masivo de emails a todos los asistentes registrados.
    Envía emails de confirmación con la fecha correcta del evento: 15 de noviembre de 2025.
    """
    permission_classes = [AllowAny]  # En producción, cambiar por permisos de administrador

    def get(self, request, *args, **kwargs):
        """Método GET para mostrar estadísticas de emails"""
        total_asistentes = Asistente.objects.count()
        sin_dni = Asistente.objects.filter(dni__isnull=True).count()
        con_dni = Asistente.objects.filter(dni__isnull=False).count()
        
        return Response({
            'status': 'info',
            'message': 'Endpoint para envío masivo de emails',
            'estadisticas': {
                'total_asistentes': total_asistentes,
                'con_dni': con_dni,
                'sin_dni': sin_dni,
                'fecha_evento': '15 de noviembre de 2025'
            },
            'parametros_post': {
                'tipo_email': 'confirmacion/recordatorio - OPCIONAL (default: confirmacion)',
                'solo_sin_dni': 'true/false - OPCIONAL (default: false)',
                'fecha_evento_override': 'YYYY-MM-DD - OPCIONAL (default: 2025-11-15)'
            }
        })

    def post(self, request, *args, **kwargs):
        """Envío masivo de emails a los asistentes"""
        tipo_email = request.data.get('tipo_email', 'confirmacion')
        solo_sin_dni = request.data.get('solo_sin_dni', 'false').lower() == 'true'
        fecha_evento = request.data.get('fecha_evento_override', '2025-11-15')
        
        # Filtrar asistentes según parámetros
        if solo_sin_dni:
            asistentes = Asistente.objects.filter(dni__isnull=True)
            descripcion = "asistentes sin DNI"
        else:
            asistentes = Asistente.objects.all()
            descripcion = "todos los asistentes"
        
        total_asistentes = asistentes.count()
        
        if total_asistentes == 0:
            return Response({
                'status': 'warning',
                'message': f'No hay {descripcion} para enviar emails.'
            }, status=status.HTTP_200_OK)
        
        # Inicializar contadores
        resultados = {
            'total_procesados': 0,
            'emails_enviados': 0,
            'emails_fallidos': 0,
            'tipo_email': tipo_email,
            'fecha_evento': fecha_evento,
            'filtro_aplicado': descripcion,
            'detalles': []
        }
        
        # Enviar emails
        for asistente in asistentes:
            try:
                # Aquí puedes personalizar el email según el tipo
                if tipo_email == 'recordatorio':
                    # Email de recordatorio del evento
                    email_enviado = send_bulk_confirmation_email(
                        asistente, 
                        es_recordatorio=True,
                        fecha_evento=fecha_evento
                    )
                else:
                    # Email de confirmación estándar
                    email_enviado = send_bulk_confirmation_email(
                        asistente, 
                        es_carga_masiva=True,
                        fecha_evento=fecha_evento
                    )
                
                if email_enviado:
                    resultados['emails_enviados'] += 1
                    resultados['detalles'].append({
                        'email': asistente.email,
                        'nombre': f"{asistente.first_name} {asistente.last_name}",
                        'estado': 'enviado'
                    })
                else:
                    resultados['emails_fallidos'] += 1
                    resultados['detalles'].append({
                        'email': asistente.email,
                        'nombre': f"{asistente.first_name} {asistente.last_name}",
                        'estado': 'error'
                    })
            
            except Exception as e:
                resultados['emails_fallidos'] += 1
                resultados['detalles'].append({
                    'email': asistente.email,
                    'nombre': f"{asistente.first_name} {asistente.last_name}",
                    'estado': 'error',
                    'error': str(e)
                })
            
            resultados['total_procesados'] += 1
        
        # Preparar mensaje de respuesta
        if resultados['emails_enviados'] > 0:
            status_code = status.HTTP_200_OK
            status_msg = 'success'
            message = f"Envío masivo completado. {resultados['emails_enviados']} emails enviados, {resultados['emails_fallidos']} errores."
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR  
            status_msg = 'error'
            message = f"Error en envío masivo. {resultados['emails_fallidos']} emails fallidos."
        
        return Response({
            'status': status_msg,
            'message': message,
            'resultados': resultados
        }, status=status_code)


class CargaMasivaAsistentesCompletaView(views.APIView):
    """
    Vista para carga masiva de asistentes desde archivo Excel/CSV.
    Maneja DNIs nulos y asigna perfil 'OTRO' por defecto cuando el tipo de perfil está vacío.
    """
    permission_classes = [AllowAny]  # En producción, cambiar por permisos de administrador

    def get(self, request, *args, **kwargs):
        """Método GET para mostrar información sobre el endpoint"""
        return Response({
            'status': 'info',
            'message': 'Endpoint para carga masiva de asistentes',
            'metodo': 'POST',
            'parametros': {
                'archivo': 'Archivo Excel (.xlsx, .xls) o CSV (.csv) - REQUERIDO',
                'enviar_emails': 'true/false - OPCIONAL (default: true)'
            },
            'estructura_archivo': {
                'columnas_requeridas': ['NOMBRE', 'Apellido', 'CORREO ELECTRONICO'],
                'columnas_opcionales': [
                    'NUMERO DE CELULAR (con codigo de area)',
                    'DNI',
                    'TIPO DE PERFIL',
                    'Columna1'
                ]
            },
            'tipos_perfil_validos': [
                'VISITOR (Visitante)',
                'STUDENT (Estudiante)', 
                'TEACHER (Docente)',
                'PROFESSIONAL (Profesional)',
                'GROUP_REPRESENTATIVE (Representante de Grupo)',
                'GRADUADO',
                'OTRO (Por defecto)'
            ]
        })

    def post(self, request, *args, **kwargs):
        if 'archivo' not in request.FILES:
            return Response({
                'status': 'error',
                'message': 'No se proporcionó archivo para cargar. Use el parámetro "archivo".'
            }, status=status.HTTP_400_BAD_REQUEST)

        archivo = request.FILES['archivo']
        enviar_emails = request.data.get('enviar_emails', 'true').lower() == 'true'
        
        try:
            # Validar tipo de archivo
            if not (archivo.name.endswith('.xlsx') or archivo.name.endswith('.xls') or archivo.name.endswith('.csv')):
                return Response({
                    'status': 'error',
                    'message': 'Tipo de archivo no soportado. Use Excel (.xlsx, .xls) o CSV.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Leer el archivo
            try:
                import pandas as pd
                if archivo.name.endswith('.csv'):
                    df = pd.read_csv(archivo)
                else:
                    df = pd.read_excel(archivo)
            except ImportError:
                return Response({
                    'status': 'error',
                    'message': 'pandas no está instalado. Instale pandas para procesar archivos Excel/CSV.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({
                    'status': 'error',
                    'message': f'Error al leer el archivo: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Mapear columnas esperadas (basado en la imagen proporcionada)
            columnas_esperadas = {
                'NOMBRE': ['nombre', 'first_name', 'primer_nombre'],
                'Apellido': ['apellido', 'last_name'],
                'CORREO ELECTRONICO': ['correo', 'email', 'correo_electronico', 'correo electrónico', 'correo_electrónico'],
                'NUMERO DE CELULAR (con código de área)': ['telefono', 'phone', 'celular', 'numero_celular', 'número de celular (con código de área)', 'numero de celular (con codigo de area)'],
                'DNI': ['dni', 'documento'],
                'TIPO DE PERFIL': ['tipo_perfil', 'profile_type', 'tipo_de_perfil', 'tipo de perfil'],
                'Columna1': ['columna1', 'rol_especifico', 'rol', 'column1']
            }

            # Normalizar nombres de columnas
            df.columns = df.columns.str.strip()
            columnas_mapeadas = {}
            
            for col_esperada, variantes in columnas_esperadas.items():
                for col in df.columns:
                    if col == col_esperada or col.lower() in [v.lower() for v in variantes]:
                        columnas_mapeadas[col_esperada] = col
                        break

            # Verificar columnas mínimas requeridas
            columnas_requeridas = ['NOMBRE', 'Apellido', 'CORREO ELECTRONICO']
            columnas_faltantes = []
            for col in columnas_requeridas:
                if col not in columnas_mapeadas:
                    columnas_faltantes.append(col)

            if columnas_faltantes:
                return Response({
                    'status': 'error',
                    'message': f'Faltan columnas requeridas: {", ".join(columnas_faltantes)}',
                    'columnas_disponibles': list(df.columns),
                    'columnas_esperadas': list(columnas_esperadas.keys())
                }, status=status.HTTP_400_BAD_REQUEST)

            # Procesar registros
            resultados = {
                'total_procesados': 0,
                'exitosos': 0,
                'errores': 0,
                'emails_enviados': 0,
                'emails_fallidos': 0,
                'detalles': []
            }

            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        # Extraer datos de la fila
                        first_name = str(row[columnas_mapeadas['NOMBRE']]).strip() if pd.notna(row[columnas_mapeadas['NOMBRE']]) else ''
                        last_name = str(row[columnas_mapeadas['Apellido']]).strip() if pd.notna(row[columnas_mapeadas['Apellido']]) else ''
                        email = str(row[columnas_mapeadas['CORREO ELECTRONICO']]).strip() if pd.notna(row[columnas_mapeadas['CORREO ELECTRONICO']]) else ''
                        
                        # Validar datos mínimos
                        if not first_name or not last_name or not email:
                            resultados['errores'] += 1
                            resultados['detalles'].append({
                                'fila': index + 2,  # +2 porque empezamos en 0 y hay header
                                'error': 'Faltan datos básicos (nombre, apellido, email)',
                                'datos': {'nombre': first_name, 'apellido': last_name, 'email': email}
                            })
                            continue

                        # Validar formato de email
                        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
                            resultados['errores'] += 1
                            resultados['detalles'].append({
                                'fila': index + 2,
                                'error': 'Formato de email inválido',
                                'datos': {'email': email}
                            })
                            continue

                        # Verificar si ya existe el email
                        if Asistente.objects.filter(email=email).exists():
                            resultados['errores'] += 1
                            resultados['detalles'].append({
                                'fila': index + 2,
                                'error': 'Email ya registrado',
                                'datos': {'email': email}
                            })
                            continue

                        # Procesar DNI (puede ser nulo)
                        dni = None
                        if 'DNI' in columnas_mapeadas and pd.notna(row[columnas_mapeadas['DNI']]):
                            dni_raw = str(row[columnas_mapeadas['DNI']]).strip()
                            # Limpiar DNI (remover puntos, guiones, etc.)
                            dni = re.sub(r'[^\d]', '', dni_raw)
                            if dni and len(dni) > 0:
                                # Verificar si ya existe el DNI
                                if Asistente.objects.filter(dni=dni).exists():
                                    resultados['errores'] += 1
                                    resultados['detalles'].append({
                                        'fila': index + 2,
                                        'error': 'DNI ya registrado',
                                        'datos': {'dni': dni}
                                    })
                                    continue
                            else:
                                dni = None

                        # Procesar teléfono (puede ser vacío)
                        phone = ''
                        if 'NUMERO DE CELULAR (con código de área)' in columnas_mapeadas and pd.notna(row[columnas_mapeadas['NUMERO DE CELULAR (con código de área)']]):
                            phone = str(row[columnas_mapeadas['NUMERO DE CELULAR (con código de área)']]).strip()

                        # Procesar tipo de perfil
                        profile_type = Asistente.ProfileType.OTRO  # Por defecto OTRO
                        if 'TIPO DE PERFIL' in columnas_mapeadas and pd.notna(row[columnas_mapeadas['TIPO DE PERFIL']]):
                            tipo_perfil_raw = str(row[columnas_mapeadas['TIPO DE PERFIL']]).strip().upper()
                            
                            # Mapear tipos de perfil
                            mapeo_perfiles = {
                                'VISITANTE': Asistente.ProfileType.VISITOR,
                                'ESTUDIANTE': Asistente.ProfileType.STUDENT,
                                'DOCENTE': Asistente.ProfileType.TEACHER,
                                'PROFESIONAL': Asistente.ProfileType.PROFESSIONAL,
                                'GRADUADO': Asistente.ProfileType.GRADUADO,
                                'OTRO': Asistente.ProfileType.OTRO,
                                'VISITOR': Asistente.ProfileType.VISITOR,
                                'STUDENT': Asistente.ProfileType.STUDENT,
                                'TEACHER': Asistente.ProfileType.TEACHER,
                                'PROFESSIONAL': Asistente.ProfileType.PROFESSIONAL
                            }
                            
                            if tipo_perfil_raw in mapeo_perfiles:
                                profile_type = mapeo_perfiles[tipo_perfil_raw]

                        # Procesar rol específico (Columna1)
                        rol_especifico = None
                        if 'Columna1' in columnas_mapeadas and pd.notna(row[columnas_mapeadas['Columna1']]):
                            rol_especifico = str(row[columnas_mapeadas['Columna1']]).strip()

                        # Crear asistente
                        asistente = Asistente.objects.create(
                            first_name=first_name,
                            last_name=last_name,
                            email=email,
                            phone=phone,
                            dni=dni,
                            profile_type=profile_type,
                            rol_especifico=rol_especifico
                        )

                        resultados['exitosos'] += 1
                        resultados['detalles'].append({
                            'fila': index + 2,
                            'success': 'Registro creado exitosamente',
                            'id': asistente.id,
                            'datos': {
                                'nombre': first_name,
                                'apellido': last_name,
                                'email': email,
                                'dni': dni,
                                'perfil': profile_type,
                                'rol_especifico': rol_especifico
                            }
                        })

                        # Enviar email de confirmación si está habilitado
                        if enviar_emails:
                            try:
                                if send_bulk_confirmation_email(asistente, es_carga_masiva=True):
                                    resultados['emails_enviados'] += 1
                                else:
                                    resultados['emails_fallidos'] += 1
                            except Exception as e:
                                resultados['emails_fallidos'] += 1
                                print(f"[ERROR] Error enviando email a {email}: {e}")

                    except Exception as e:
                        resultados['errores'] += 1
                        resultados['detalles'].append({
                            'fila': index + 2,
                            'error': f'Error procesando fila: {str(e)}'
                        })

                    resultados['total_procesados'] += 1

            return Response({
                'status': 'success',
                'message': f'Carga masiva completada. {resultados["exitosos"]} registros exitosos, {resultados["errores"]} errores.',
                'resultados': resultados
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Error procesando archivo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CargaMasivaAsistentesView(views.APIView):
    """
    Vista para carga masiva de asistentes desde archivo Excel.
    Permite subir un archivo Excel con datos de asistentes y procesarlos en lote.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """Método GET para mostrar información sobre la carga masiva"""
        return Response({
            'status': 'info',
            'message': 'Endpoint para carga masiva de asistentes desde Excel',
            'instrucciones': {
                'metodo': 'POST',
                'contenido': 'multipart/form-data',
                'parametros': {
                    'archivo': 'Archivo Excel (.xlsx o .xls) con datos de asistentes',
                    'enviar_emails': 'true/false - OPCIONAL (default: false)'
                }
            },
            'formato_excel': {
                'columnas_requeridas': [
                    'Nombre',
                    'Apellido', 
                    'Email',
                    'Institucion',
                    'Tipo de Perfil',
                    'DNI (opcional)',
                    'Columna1 (rol específico)'
                ],
                'tipos_perfil_validos': ['VISITOR', 'STUDENT', 'TEACHER', 'PROFESSIONAL', 'GRADUADO', 'OTRO']
            }
        })

    def post(self, request, *args, **kwargs):
        """Procesar archivo Excel para carga masiva"""
        if 'archivo' not in request.FILES:
            return Response({
                'status': 'error',
                'message': 'No se proporcionó ningún archivo'
            }, status=status.HTTP_400_BAD_REQUEST)

        archivo = request.FILES['archivo']
        enviar_emails = request.data.get('enviar_emails', 'false').lower() == 'true'

        try:
            # Leer archivo Excel
            if archivo.name.endswith('.xlsx'):
                df = pd.read_excel(archivo, engine='openpyxl')
            elif archivo.name.endswith('.xls'):
                df = pd.read_excel(archivo, engine='xlrd')
            else:
                return Response({
                    'status': 'error',
                    'message': 'Formato de archivo no soportado. Use .xlsx o .xls'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Mapear nombres de columnas en español a inglés
            column_mapping = {
                'Nombre': 'first_name',
                'Apellido': 'last_name', 
                'Email': 'email',
                'Institucion': 'institution',
                'Tipo de Perfil': 'profile_type',
                'DNI': 'dni',
                'Columna1': 'rol_especifico'
            }

            # Renombrar columnas
            df.rename(columns=column_mapping, inplace=True)

            resultados = {
                'total_procesados': 0,
                'exitosos': 0,
                'errores': 0,
                'emails_enviados': 0,
                'emails_fallidos': 0,
                'detalles': []
            }

            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        # Validar email
                        email = row.get('email', '').strip()
                        if not email or not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
                            resultados['errores'] += 1
                            resultados['detalles'].append({
                                'fila': index + 2,
                                'email': email,
                                'error': 'Email inválido o vacío'
                            })
                            continue

                        # Verificar si ya existe
                        if Asistente.objects.filter(email=email).exists():
                            resultados['errores'] += 1
                            resultados['detalles'].append({
                                'fila': index + 2,
                                'email': email,
                                'error': 'Email ya registrado'
                            })
                            continue

                        # Mapear tipo de perfil
                        profile_type_map = {
                            'VISITOR': Asistente.ProfileType.VISITOR,
                            'STUDENT': Asistente.ProfileType.STUDENT,
                            'TEACHER': Asistente.ProfileType.TEACHER,
                            'PROFESSIONAL': Asistente.ProfileType.PROFESSIONAL,
                            'GRADUADO': Asistente.ProfileType.GRADUADO,
                            'OTRO': Asistente.ProfileType.OTRO
                        }

                        profile_type_str = str(row.get('profile_type', 'VISITOR')).upper()
                        profile_type = profile_type_map.get(profile_type_str, Asistente.ProfileType.VISITOR)

                        # Crear asistente
                        dni = row.get('dni')
                        if pd.isna(dni) or dni == '':
                            dni = None

                        asistente = Asistente.objects.create(
                            first_name=str(row.get('first_name', '')).strip(),
                            last_name=str(row.get('last_name', '')).strip(),
                            email=email,
                            institution=str(row.get('institution', '')).strip() or None,
                            profile_type=profile_type,
                            dni=dni,
                            rol_especifico=str(row.get('rol_especifico', '')).strip() or None
                        )

                        resultados['exitosos'] += 1
                        resultados['detalles'].append({
                            'fila': index + 2,
                            'email': email,
                            'nombre': f"{asistente.first_name} {asistente.last_name}",
                            'profile_type': asistente.get_profile_type_display(),
                            'estado': 'creado'
                        })

                        # Enviar email si está habilitado
                        if enviar_emails:
                            try:
                                if send_bulk_confirmation_email(asistente, es_carga_masiva=True, fecha_evento='2025-11-15'):
                                    resultados['emails_enviados'] += 1
                                else:
                                    resultados['emails_fallidos'] += 1
                            except Exception as e:
                                resultados['emails_fallidos'] += 1
                                print(f"[ERROR] Error enviando email a {email}: {e}")

                    except Exception as e:
                        resultados['errores'] += 1
                        resultados['detalles'].append({
                            'fila': index + 2,
                            'error': f'Error procesando fila: {str(e)}'
                        })

                    resultados['total_procesados'] += 1

            return Response({
                'status': 'success',
                'message': f'Carga masiva completada. {resultados["exitosos"]} registros exitosos, {resultados["errores"]} errores.',
                'resultados': resultados
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Error procesando archivo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ActualizarDNIView(views.APIView):
    """
    Vista para actualizar el DNI de un asistente usando un token único.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Verifica si el token es válido y devuelve la información del asistente.
        """
        token = request.query_params.get('token')
        
        if not token:
            return Response({
                'status': 'error',
                'message': 'Token no proporcionado.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            asistente = Asistente.objects.get(dni_update_token=token)
            return Response({
                'status': 'success',
                'asistente': {
                    'nombre_completo': asistente.nombre_completo,
                    'email': asistente.email
                }
            }, status=status.HTTP_200_OK)
        except Asistente.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Token inválido o expirado.'
            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        """
        Actualiza el DNI del asistente y elimina el token.
        """
        token = request.data.get('token')
        nuevo_dni = request.data.get('dni')
        
        if not token or not nuevo_dni:
            return Response({
                'status': 'error',
                'message': 'Token y DNI son requeridos.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            asistente = Asistente.objects.get(dni_update_token=token)
            
            # Validar el DNI usando el serializer
            from .serializers import AsistenteSerializer
            serializer = AsistenteSerializer()
            try:
                dni_validado = serializer.validate_dni(nuevo_dni)
            except serializers.ValidationError as e:
                return Response({
                    'status': 'error',
                    'message': str(e.detail[0]) if isinstance(e.detail, list) else str(e.detail)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar si el DNI ya existe
            if Asistente.objects.filter(dni=dni_validado).exclude(id=asistente.id).exists():
                return Response({
                    'status': 'error',
                    'message': 'Este DNI ya está registrado en el sistema.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Actualizar el DNI y eliminar el token
            asistente.dni = dni_validado
            asistente.dni_update_token = None
            asistente.save()
            
            return Response({
                'status': 'success',
                'message': 'DNI actualizado correctamente.'
            }, status=status.HTTP_200_OK)
            
        except Asistente.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Token inválido o expirado.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Error actualizando el DNI: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
