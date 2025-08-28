import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { inscribirGrupal } from '../lib/api';

export default function RegistroGrupal() {
  const [company, setCompany] = useState({
    name: '',
    contact_email: '',
    contact_phone: ''
  });
  const [attendees, setAttendees] = useState([
    { first_name: '', last_name: '', email: '', phone: '', position: '', participant_type: '' }
  ]);
  const [mensaje, setMensaje] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendeeChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttendees(prev => prev.map((a, i) => i === idx ? { ...a, [name]: value } : a));
  };

  const addAttendee = () => {
    setAttendees(prev => [...prev, { first_name: '', last_name: '', email: '', phone: '', position: '', participant_type: '' }]);
  };

  const removeAttendee = (idx: number) => {
    setAttendees(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    try {
      const resp = await inscribirGrupal({ company, attendees });
      if (resp.message) {
        setMensaje('¡Inscripción grupal exitosa!');
      } else if (resp.error) {
        let detalle = '';
        if (resp.missing_fields) {
          detalle = ': ' + resp.missing_fields.join(', ');
        } else if (resp.details) {
          detalle = ': ' + Object.entries(resp.details).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ');
        }
        setError(resp.error + detalle);
      } else {
        setError('Error desconocido.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registro Grupal de Empresa
            </h1>
            <p className="text-xl text-gray-600">
              Registra tu empresa y a los asistentes que participarán en el Congreso
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Datos de la Empresa</CardTitle>
              <CardDescription>Completa los datos de la empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre de la Empresa *</Label>
                    <Input id="name" name="name" required value={company.name} onChange={handleCompanyChange} />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email de Contacto *</Label>
                    <Input id="contact_email" name="contact_email" type="email" required value={company.contact_email} onChange={handleCompanyChange} />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                    <Input id="contact_phone" name="contact_phone" value={company.contact_phone} onChange={handleCompanyChange} />
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-2">Asistentes</h2>
                  {attendees.map((a, idx) => (
                    <div key={idx} className="border p-4 rounded mb-4 relative bg-gray-50">
                      <button type="button" className="absolute top-2 right-2 text-red-500" onClick={() => removeAttendee(idx)} disabled={attendees.length === 1}>✕</button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nombre *</Label>
                          <Input name="first_name" required value={a.first_name} onChange={e => handleAttendeeChange(idx, e)} />
                        </div>
                        <div>
                          <Label>Apellido *</Label>
                          <Input name="last_name" required value={a.last_name} onChange={e => handleAttendeeChange(idx, e)} />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input name="email" type="email" required value={a.email} onChange={e => handleAttendeeChange(idx, e)} />
                        </div>
                        <div>
                          <Label>Teléfono</Label>
                          <Input name="phone" value={a.phone} onChange={e => handleAttendeeChange(idx, e)} />
                        </div>
                        <div>
                          <Label>Cargo/Posición</Label>
                          <Input name="position" value={a.position} onChange={e => handleAttendeeChange(idx, e)} />
                        </div>
                        <div>
                          <Label>Tipo de Participante *</Label>
                          <Input name="participant_type" required value={a.participant_type} onChange={e => handleAttendeeChange(idx, e)} placeholder="estudiante, gerente, etc." />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={addAttendee} className="mt-2">Agregar Asistente</Button>
                </div>

                {mensaje && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{mensaje}</div>}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

                <Button type="submit" className="w-full bg-congress-blue hover:bg-congress-blue-dark" size="lg">
                  Registrar Empresa y Asistentes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
