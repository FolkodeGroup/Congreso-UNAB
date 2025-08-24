import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useState as useStateReact } from 'react';
import { inscribirIndividual } from '../lib/api';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    institucion: '',
    cargo: '',
    tipoParticipante: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipoParticipante: value
    }));
  };

  const [mensaje, setMensaje] = useStateReact<string|null>(null);
  const [error, setError] = useStateReact<string|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    // Mapear campos frontend -> backend
    const payload: any = {
      first_name: formData.nombre,
      last_name: formData.apellido,
      email: formData.email,
      phone: formData.telefono,
      company_name: formData.institucion,
      position: formData.cargo,
      participant_type: formData.tipoParticipante
    };
    try {
      const resp = await inscribirIndividual(payload);
      if (resp.message) {
        setMensaje('¡Registro exitoso! Pronto recibirás un email de confirmación.');
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
        {mensaje && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{mensaje}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Registro al Congreso
            </h1>
            <p className="text-xl text-gray-600">
              Completa el formulario para participar en el Congreso de Logística y Transporte 2025
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información del Participante</CardTitle>
              <CardDescription>
                Proporciona tus datos para completar el registro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      type="text"
                      required
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+54 11 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="institucion">Institución/Empresa</Label>
                  <Input
                    id="institucion"
                    name="institucion"
                    type="text"
                    value={formData.institucion}
                    onChange={handleInputChange}
                    placeholder="Universidad, empresa o institución"
                  />
                </div>

                <div>
                  <Label htmlFor="cargo">Cargo/Posición</Label>
                  <Input
                    id="cargo"
                    name="cargo"
                    type="text"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    placeholder="Estudiante, Profesor, Gerente, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="tipoParticipante">Tipo de Participante *</Label>
                  <Select value={formData.tipoParticipante} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de participante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estudiante">Estudiante</SelectItem>
                      <SelectItem value="academico">Académico/Investigador</SelectItem>
                      <SelectItem value="profesional">Profesional de la Industria</SelectItem>
                      <SelectItem value="funcionario">Funcionario Público</SelectItem>
                      <SelectItem value="empresa">Representante de Empresa</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-congress-blue mb-2">Información del Evento</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>📅 <strong>Fecha:</strong> 15 de Noviembre 2025</p>
                    <p>📍 <strong>Lugar:</strong> Campus UNaB, Blas Parera 132</p>
                    <p>💰 <strong>Costo:</strong> Gratuito</p>
                    <p>✉️ <strong>Contacto:</strong> congresologisticaytransporte@unab.edu.ar</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-congress-blue hover:bg-congress-blue-dark"
                  size="lg"
                >
                  Registrarme al Congreso
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
