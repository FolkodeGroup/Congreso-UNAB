import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FiCalendar,
  FiMapPin,
  FiMail,
  FiUsers,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import LogoCarouselsSection from "@/components/LogoCarouselsSection";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-congress-blue to-congress-blue-dark text-white py-20 degradado-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                CONGRESO DE LOGÍSTICA
                <span className="block text-congress-cyan">Y TRANSPORTE</span>
              </h1>
              <div className="w-24 h-1 bg-congress-cyan mx-auto mb-10"></div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-congress-white">
                MOVIENDO EL FUTURO
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-4">
                Innovación y desafíos en la logística y el transporte
              </p>
              <div className="mb-6">
                <Link to="/historia-campus">
                  <Button
                    variant="secondary"
                    className="bg-congress-cyan text-white font-semibold px-6 py-2 rounded shadow hover:bg-congress-cyan-dark transition-colors text-lg"
                  >
                    Conocé la historia del campus y la casona
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-3 opacity-80 mb-10">
                <div className="mb-4 lg:mb-0">
                  <img
                    src="/images/Logo_unab2.png"
                    alt="UNaB Logo"
                    className="h-28 w-auto"
                  />
                </div>
                <span className="text-lg font-medium">
                  Universidad Nacional Guillermo Brown
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiCalendar className="w-8 h-8 mx-auto mb-3 text-congress-blue-dark" />
                <h3 className="font-semibold mb-2">Fecha</h3>
                <p className="text-lg">15 de Noviembre 2025</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiMapPin className="w-8 h-8 mx-auto mb-3 text-congress-blue-dark" />
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-lg">
                  Campus UNaB
                  <br />
                  Blas Parera 132
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiMail className="w-8 h-8 mx-auto mb-3 text-congress-blue-dark" />
                <h3 className="font-semibold mb-2">Contacto</h3>
                <p className="text-sm break-all">
                  congresologisticaytransporte@unab.edu.ar
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registro">
                <Button
                  size="lg"
                  className="bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-semibold px-8 py-3"
                >
                  Registrarse Ahora
                </Button>
              </Link>
              <Link to="/programa">
                <Button
                  size="lg"
                  className="bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-semibold px-8 py-3"
                >
                  Ver Programa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LogoCarouselsSection />

      {/* Participation Modalities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Modalidades de Participación
              </h2>
              <p className="text-lg text-gray-600">
                Te invitamos a participar en la modalidad que prefieras.
                <span className="font-semibold text-congress-blue">
                  {" "}
                  Todas las modalidades son sin costo
                </span>
                para instituciones y empresas que deseen sumarse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-congress-blue rounded-lg flex items-center justify-center mb-4">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Expositor con Stand</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Presenta tu empresa, servicios o proyectos en un espacio
                    dedicado. Conecta directamente con profesionales del sector
                    y genera nuevas oportunidades de negocio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-congress-cyan rounded-lg flex items-center justify-center mb-4">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Presentador de Tecnología
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Muestra vehículos, maquinaria o tecnologías innovadoras.
                    Demuestra las últimas innovaciones que están transformando
                    el sector logístico y de transporte.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-congress-blue rounded-lg flex items-center justify-center mb-4">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Coordinador de Taller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Lidera un taller práctico o instancia demostrativa. Comparte
                    tu expertise y conocimientos prácticos con otros
                    profesionales del sector.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-congress-cyan rounded-lg flex items-center justify-center mb-4">
                    <FiUsers className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Otras Modalidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    ¿Tienes una propuesta diferente? Nos encantaría conocer
                    otras modalidades que consideres relevantes y de interés
                    para el sector. Contáctanos para conversarlo.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-white rounded-lg p-8 border-2 border-congress-cyan">
                <h3 className="text-2xl font-bold text-congress-blue mb-4">
                  💡 ¿Interesado en Participar como Empresa?
                </h3>
                <p className="text-gray-600 mb-6">
                  Únete a las más de 30 empresas que ya confirmaron su
                  participación. Es una excelente oportunidad para networking,
                  visibilidad y desarrollo de negocio.
                </p>
                <Link to="/contacto">
                  <Button className="bg-congress-blue hover:bg-congress-blue-dark mr-4">
                    Contactar para Participar
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button
                    variant="outline"
                    className="border-congress-blue text-congress-blue hover:bg-congress-blue hover:text-white"
                  >
                    Registro Individual
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-congress-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para ser parte del futuro?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-congress-cyan-light">
            Únete a nosotros en este importante evento que marcará el rumbo de
            la logística y el transporte en Argentina y Latinoamérica.
          </p>
          <Link to="/registro">
            <Button
              size="lg"
              className="bg-congress-cyan hover:bg-congress-cyan-light text-congress-white font-semibold px-8 py-3"
            >
              Registrarse Gratis
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}