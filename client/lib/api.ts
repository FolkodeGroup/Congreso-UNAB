const API_BASE = "http://192.168.1.101:8000/api";

export async function registrarAsistencia(data: any) {
  // Ahora apunta al endpoint correcto de checkin
  const res = await fetch(`${API_BASE}/checkin/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
// Utilidades para consumir la API del backend
export async function inscribirIndividual(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function inscribirGrupal(data: any) {
  const res = await fetch(`${API_BASE}/inscripcion-grupal/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
