export async function registrarAsistencia(data: any) {
  const res = await fetch('http://127.0.0.1:8000/api/registrar-asistencia/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
// Utilidades para consumir la API del backend
export async function inscribirIndividual(data: any) {
  const res = await fetch('http://127.0.0.1:8000/api/inscripcion/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function inscribirGrupal(data: any) {
  const res = await fetch('http://127.0.0.1:8000/api/inscripcion-grupal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}
