import { getCookie, cleanupSessionCookies } from './utils';

// Compute API base consistently: VITE_API_URL should be the host (no trailing /api)
// and we append /api here. Falls back to localhost for development.
// API URL resolver
// VITE_API_URL can be either the host (e.g. https://www.example.com) or the full /api base
// We normalize it so API_HOST = scheme://host[:port] and API_BASE = API_HOST + /api
function normalizeUrl(url: string) {
  return url.replace(/\/$/, "");
}

function resolveApiHost(): string {
  const env = (import.meta.env?.VITE_API_URL as string | undefined)?.trim();
  if (env) {
    // If env already ends with /api, strip it to get the host
    const cleaned = normalizeUrl(env);
    const host = cleaned.endsWith('/api') ? cleaned.slice(0, -4) : cleaned;
    const normalized = normalizeUrl(host);
    // If env points to localhost/127/0.0.0.0 but we're in a browser with a non-local origin, prefer window origin
    if (
      typeof window !== 'undefined' &&
      window.location?.origin &&
      !/^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(window.location.origin) &&
      /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(normalized)
    ) {
      return normalizeUrl(window.location.origin);
    }
    return normalized;
  }
  // Fallback to current site origin when running in the browser
  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeUrl(window.location.origin);
  }
  // Last resort: localhost for dev tools without a window
  return 'http://127.0.0.1:8000';
}

export const API_HOST = resolveApiHost();
export const API_BASE = `${API_HOST}/api`;

/**
 * Obtiene un token CSRF fresco del servidor
 * Esto ayuda a evitar problemas con cookies antiguas o tokens expirados
 */
async function ensureCsrfToken(): Promise<string> {
  // Primero intentar obtener el token de la cookie
  let token = getCookie('csrftoken');
  
  // Si no hay token o está vacío, hacer una petición GET para obtener uno nuevo
  if (!token) {
    try {
      // Hacer una petición GET a cualquier endpoint del API para obtener el token
      await fetch(`${API_BASE}/empresas/`, {
        method: 'GET',
        credentials: 'include',
      });
      token = getCookie('csrftoken');
    } catch (error) {
      console.warn('No se pudo obtener token CSRF del servidor:', error);
    }
  }
  
  return token || '';
}

/**
 * Wrapper para peticiones POST con manejo robusto de CSRF
 */
async function postWithCsrf(url: string, data: any, isFormData: boolean = false): Promise<Response> {
  // Obtener token CSRF fresco
  const csrfToken = await ensureCsrfToken();
  
  const headers: HeadersInit = {
    'X-CSRFToken': csrfToken,
  };
  
  // Solo agregar Content-Type si no es FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: isFormData ? data : JSON.stringify(data),
  });
  
  // Si obtenemos un error 403 de CSRF, limpiar cookies y reintentar UNA vez
  if (response.status === 403) {
    const text = await response.text();
    if (text.includes('CSRF') || text.includes('csrf')) {
      console.warn('Error CSRF detectado. Limpiando cookies y reintentando...');
      cleanupSessionCookies();
      
      // Obtener un token completamente nuevo
      const newCsrfToken = await ensureCsrfToken();
      headers['X-CSRFToken'] = newCsrfToken;
      
      // Reintentar la petición
      return await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data),
      });
    }
  }
  
  return response;
}

// Función para registrar empresa
// Función para registrar empresa con archivos
export async function registrarEmpresa(data: FormData) {
  const res = await postWithCsrf(`${API_BASE}/registro-empresas/`, data, true);
  return await res.json();
}

// Función para verificar DNI y confirmar asistencia
export async function verificarDNI(dni: string) {
  const res = await postWithCsrf(`${API_BASE}/verificar-dni/`, { dni });
  return await res.json();
}

// Función para registro rápido in-situ
export async function registroRapido(data: any) {
  const res = await postWithCsrf(`${API_BASE}/registro-rapido/`, data);
  return await res.json();
}

// Función para generar QRs estáticos
export async function generarQRsEstaticos() {
  const res = await fetch(`${API_BASE}/generar-qrs/`);
  return await res.json();
}

export async function registrarAsistencia(data: any) {
  const res = await postWithCsrf(`${API_BASE}/registrar-asistencia/`, data);
  return await res.json();
}

// Utilidades para consumir la API del backend
export async function inscribirIndividual(data: any) {
  const res = await postWithCsrf(`${API_BASE}/inscripcion/`, data);
  return await res.json();
}

export async function inscribirGrupal(data: any) {
  const res = await postWithCsrf(`${API_BASE}/inscripcion-grupal/`, data);
  return await res.json();
}

// Nueva función para el sistema mejorado de inscripción grupal
export async function inscribirParticipante(data: any) {
  const res = await postWithCsrf(`${API_BASE}/participantes/`, data);
  return await res.json();
}
