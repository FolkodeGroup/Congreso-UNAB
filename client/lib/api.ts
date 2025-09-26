import { getCookie } from './utils';
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

// Función para registrar empresa
// Función para registrar empresa con archivos
export async function registrarEmpresa(data: FormData) {
  const res = await fetch(`${API_BASE}/registro-empresas/`, {
    method: "POST",
    body: data,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
  });
  return await res.json();
}

// Función para verificar DNI y confirmar asistencia
export async function verificarDNI(dni: string) {
  const res = await fetch(`${API_BASE}/verificar-dni/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify({ dni }),
  });
  return await res.json();
}

// Función para registro rápido in-situ
export async function registroRapido(data: any) {
  const res = await fetch(`${API_BASE}/registro-rapido/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Función para generar QRs estáticos
export async function generarQRsEstaticos() {
  const res = await fetch(`${API_BASE}/generar-qrs/`);
  return await res.json();
}

export async function registrarAsistencia(data: any) {
  const res = await fetch(`${API_BASE}/registrar-asistencia/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Utilidades para consumir la API del backend
export async function inscribirIndividual(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function inscribirGrupal(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion-grupal/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Nueva función para el sistema mejorado de inscripción grupal
export async function inscribirParticipante(data: any) {
  const res = await fetch(`${API_BASE}/participantes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': getCookie('csrftoken') || '',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return await res.json();
}
