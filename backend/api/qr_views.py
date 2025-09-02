import qrcode
from io import BytesIO
import base64
from django.http import JsonResponse
from django.views import View
from django.conf import settings
import os

class GenerateStaticQRView(View):
    """
    Vista para generar QRs estáticos:
    1. QR para confirmar asistencia (redirige a verificación de DNI)
    2. QR para inscripción in-situ (redirige a registro rápido)
    """
    
    def get(self, request):
        # URLs base del frontend
        frontend_base = "http://localhost:8081"  # Puerto actualizado según Vite
        
        # URLs para los QRs estáticos
        checkin_url = f"{frontend_base}/verificar-dni"
        registro_url = f"{frontend_base}/registro-rapido"
        
        # Generar QR para check-in
        checkin_qr = qrcode.QRCode(version=1, box_size=10, border=5)
        checkin_qr.add_data(checkin_url)
        checkin_qr.make(fit=True)
        checkin_img = checkin_qr.make_image(fill_color="black", back_color="white")
        
        # Generar QR para registro
        registro_qr = qrcode.QRCode(version=1, box_size=10, border=5)
        registro_qr.add_data(registro_url)
        registro_qr.make(fit=True)
        registro_img = registro_qr.make_image(fill_color="black", back_color="white")
        
        # Convertir a base64 para enviar como respuesta
        checkin_buffer = BytesIO()
        checkin_img.save(checkin_buffer, format='PNG')
        checkin_b64 = base64.b64encode(checkin_buffer.getvalue()).decode()
        
        registro_buffer = BytesIO()
        registro_img.save(registro_buffer, format='PNG')
        registro_b64 = base64.b64encode(registro_buffer.getvalue()).decode()
        
        return JsonResponse({
            'checkin_qr': {
                'url': checkin_url,
                'image_base64': f"data:image/png;base64,{checkin_b64}",
                'description': 'QR para confirmar asistencia (verificación de DNI)'
            },
            'registro_qr': {
                'url': registro_url, 
                'image_base64': f"data:image/png;base64,{registro_b64}",
                'description': 'QR para inscripción in-situ en el evento'
            }
        })
