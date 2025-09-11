const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Función para verificar DNI y confirmar asistencia
export async function verificarDNI(dni: string) {
  const res = await fetch(`${API_BASE}/verificar-dni/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni }),
  });
  return await res.json();
}

// Función para registro rápido in-situ
export async function registroRapido(data: any) {
  const res = await fetch(`${API_BASE}/registro-rapido/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Utilidades para consumir la API del backend
export async function inscribirIndividual(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function inscribirGrupal(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion-grupal/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
