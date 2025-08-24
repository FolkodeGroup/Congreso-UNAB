# TODO: Congreso UNAB - Backend, Frontend y Conexión

## Backend (Django)

- [ ] **Mejorar diseño del PDF de certificado**
  - Agregar logo, colores, firmas, bordes y mejor tipografía.
  - Incluir datos adicionales (DNI, empresa, etc. si aplica).
- [ ] **Documentar la API REST**
  - Integrar Swagger/OpenAPI (drf-yasg o similar).
  - Documentar endpoints, parámetros y ejemplos de uso.
- [ ] **Agregar autenticación y permisos**
  - Proteger endpoints sensibles (descarga de certificados, panel admin, etc.).
  - Implementar JWT o token para organizadores.
- [ ] **Envío automático de certificados por email**
  - Configurar envío tras registrar asistencia.
  - Personalizar el mensaje y adjuntar el PDF.
- [ ] **Pruebas unitarias y de integración**
  - Para endpoints de inscripción, asistencia, certificados.
- [ ] **Logs y manejo de errores**
  - Mejorar feedback de errores y registrar eventos importantes.
- [ ] **Optimizar CORS y seguridad para producción**
  - Restringir orígenes permitidos.
- [ ] **(Opcional) Migrar a PostgreSQL para producción**
- [ ] **(Opcional) Panel de administración web para organizadores**
  - Dashboard, filtros, exportación, gestión de inscripciones y asistencia.

## Frontend (React)

- [ ] **Mejorar experiencia de usuario**
  - Feedback visual (spinners, mensajes claros, validaciones).
  - Manejo de errores y estados de carga.
- [ ] **Visualización y descarga de certificados**
  - Mejorar el flujo y la UI para descargar certificados.
- [ ] **Formularios de inscripción más robustos**
  - Validaciones, campos obligatorios, UX amigable.
- [ ] **Panel de administración web**
  - Listado de inscriptos, filtros, búsqueda, exportación, estado de asistencia y certificados.
- [ ] **Pruebas de integración y e2e**
  - Cypress, Playwright o similar.
- [ ] **Configurar correctamente la URL base de la API para producción**
- [ ] **(Opcional) Responsive y accesibilidad mejorada**

## Conexión Backend-Frontend

- [ ] **Asegurar CORS y CSRF correctamente configurados**
- [ ] **Documentar endpoints y ejemplos de consumo desde el frontend**
- [ ] **Probar el flujo completo en red local y desde dispositivos móviles**
- [ ] **(Opcional) Websockets o polling para actualización en tiempo real del panel admin**

---

> **Priorizar:**
> 1. Mejorar PDF y experiencia de descarga.
> 2. Documentar y proteger la API.
> 3. Panel de administración y experiencia de usuario.

