"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


from api import views as api_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', api_views.landing_page, name='landing_page'),
    path('admin/', admin.site.urls),
    path('inscripcion/', api_views.register_individual, name='register_individual'),
    path('inscripcion-grupal/', api_views.register_group, name='register_group'),
    path('inscripcion/exito/', api_views.registration_success, name='registration_success'),
    # Endpoints API para integración frontend
    path('api/inscripcion/', api_views.api_register_individual, name='api_register_individual'),
    path('api/inscripcion-grupal/', api_views.api_register_group, name='api_register_group'),
    path('api/registrar-asistencia/', api_views.api_registrar_asistencia, name='api_registrar_asistencia'),
    path('api/', include('api.urls')),  # Endpoints RESTful DRF
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
