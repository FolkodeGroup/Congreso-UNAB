import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, MapPin, Linkedin } from "lucide-react";

export default function Contacto() {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Información de Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. No dudes en contactarnos para cualquier
            consulta o información adicional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Mail className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Correo Electrónico</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:congresologisticaytransporte@unab.edu.ar"
                className="text-lg text-blue-500 hover:underline"
              >
                congresologisticaytransporte@unab.edu.ar
              </a>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Instagram className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Instagram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700"></p>
              <a
                href="https://www.instagram.com/congresologisticounab/"
                className="text-lg text-blue-500 hover:underline"
              >
                @congresologisticounab
              </a>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">
                <a href="/#mapa" className="text-lg text-gray-700">
                  Universidad Nacional Guillermo Brown
                </a>
              </p>
              <a href="/#mapa" className="text-sm text-gray-500">
                Blas Parera 132, Burzaco, Buenos Aires
              </a>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Linkedin className="mx-auto h-12 w-12 text-congress-blue mb-4" />
              <CardTitle>LinkedIn</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.linkedin.com/company/congresologisticounab/"
                className="text-lg text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @congresologisticounab
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Si necesitas asistencia inmediata o tienes consultas específicas,
            por favor, utiliza el formulario de contacto en nuestra página
            principal o envíanos un correo directamente.
          </p>
          {/* Aquí podrías integrar un formulario de contacto si fuera necesario */}
        </div>
      </div>
    </>
  );
}
