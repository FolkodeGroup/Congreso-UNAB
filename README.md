# Congreso UNAB

Este proyecto es una plataforma web para la gestión y difusión del Congreso de Logística UNAB. Incluye un frontend moderno en React + Vite y un backend robusto en Django.

## Estructura del proyecto

- **backend/**: API y administración con Django.
- **client/**: Aplicación web en React con componentes reutilizables y estilos con TailwindCSS.
- **shared/**: Código compartido entre frontend y backend.
- **public/**: Archivos estáticos y recursos.

## Instalación y ejecución

### Backend (Django)

1. Instala las dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Aplica migraciones:
   ```bash
   python manage.py migrate ###(no correr ya esta la BBDD integrada)
   ```
3. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)

1. Instala las dependencias:
   ```bash
   pnpm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```

## Despliegue

El proyecto está listo para ser desplegado en Netlify (frontend) y cualquier servicio compatible con Django (backend).

## Contribución

Solicita acceso de escritura al repositorio para poder subir cambios. Haz tus commits en la rama `main`.

## Contacto

Para dudas o soporte, contacta al equipo FolkodeGroup.
