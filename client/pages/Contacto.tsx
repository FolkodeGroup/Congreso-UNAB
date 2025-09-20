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

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Si necesitas asistencia inmediata o tienes consultas específicas,
            por favor, envíanos un correo directamente.
          </p>
          {/* Aquí podrías integrar un formulario de contacto si fuera necesario */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Correo Electrónico */}
          <Card className="group border-0 shadow-xl hover:shadow-2xl rounded-2xl bg-gradient-to-br from-congress-blue/90 to-congress-cyan/80 p-6 transition-all duration-300 transform hover:scale-105 text-center">
            <CardHeader className="flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-congress-blue to-congress-blue-dark rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-congress-cyan transition-colors">
                Correo Electrónico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:congresologisticaytransporte@unab.edu.ar"
                className="text-lg text-congress-white/90 leading-relaxed hover:underline"
              >
                congresologisticaytransporte
                <br />
                @unab.edu.ar
              </a>
            </CardContent>
          </Card>

          {/* Instagram */}
          <Card className="group border-0 shadow-xl hover:shadow-2xl rounded-2xl bg-gradient-to-br from-congress-cyan/90 to-congress-blue/80 p-6 transition-all duration-300 transform hover:scale-105 text-center">
            <CardHeader className="flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-congress-cyan to-congress-cyan-light rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                <Instagram className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-congress-blue transition-colors">
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.instagram.com/congresologisticounab/"
                className="text-lg text-congress-white/90 leading-relaxed hover:underline"
              >
                @congresologisticounab
              </a>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card className="group border-0 shadow-xl hover:shadow-2xl rounded-2xl bg-gradient-to-br from-congress-blue/90 to-congress-cyan/80 p-6 transition-all duration-300 transform hover:scale-105 text-center">
            <CardHeader className="flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-congress-blue to-congress-blue-dark rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-congress-cyan transition-colors">
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="/#mapa"
                className="text-lg text-congress-white/90 leading-relaxed hover:underline"
              >
                Universidad Nacional Guillermo Brown
                <br />
                Blas Parera 132, Burzaco, Buenos Aires
              </a>
            </CardContent>
          </Card>

          {/* LinkedIn */}
          <Card className="group border-0 shadow-xl hover:shadow-2xl rounded-2xl bg-gradient-to-br from-congress-cyan/90 to-congress-blue/80 p-6 transition-all duration-300 transform hover:scale-105 text-center">
            <CardHeader className="flex flex-col items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-congress-cyan to-congress-cyan-light rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                <Linkedin className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-congress-blue transition-colors">
                LinkedIn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://www.linkedin.com/company/congresologisticounab/"
                className="text-lg text-congress-white/90 leading-relaxed hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @congresologisticounab
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
