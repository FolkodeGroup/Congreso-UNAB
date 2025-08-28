import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contacto() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Información de Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. No dudes en contactarnos para cualquier consulta o información adicional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Mail className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Correo Electrónico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">info@congresounab.cl</p>
              <p className="text-sm text-gray-500">Respondemos en 24-48 horas hábiles.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Teléfono</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">+56 2 2XXX XXXX</p>
              <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 - 17:00 hrs.</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">Av. Bellavista 0121, Providencia, Región Metropolitana, Chile</p>
              <p className="text-sm text-gray-500">Campus Bellavista, Universidad Andrés Bello</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Tienes alguna pregunta?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Si necesitas asistencia inmediata o tienes consultas específicas, por favor, utiliza el formulario de contacto en nuestra página principal o envíanos un correo directamente.
          </p>
          {/* Aquí podrías integrar un formulario de contacto si fuera necesario */}
        </div>
      </div>
    </Layout>
  );
}
