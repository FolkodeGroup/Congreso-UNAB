import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiCheckCircle, FiUsers, FiAward, FiClock, FiHome, FiTrendingUp, FiStar } from 'react-icons/fi';
import { FaBuilding, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LargeLogoCarousel from '@/components/LargeLogoCarousel';

export default function Empresas() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-congress-blue to-congress-blue-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Participa como <span className="text-congress-cyan">Empresa</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Únete a las más de 30 empresas líderes del sector que ya confirmaron su participación 
              en el congreso más importante de logística y transporte del país.
            </p>
            <Badge className="bg-congress-cyan text-congress-white text-lg px-4 py-2">
              Participación 100% Gratuita
            </Badge>
          </div>
        </div>
      </section>

      {/* Large Logo Carousel Section */}
      <LargeLogoCarousel />

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Beneficios de Participar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-gray-200 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-congress-blue rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Visibilidad de Marca</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Posiciona tu empresa frente a más de 500 asistentes especializados 
                    en logística y transporte, incluyendo tomadores de decisión.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-congress-cyan rounded-lg flex items-center justify-center">
                      <FaHandshake className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Networking Estratégico</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Conecta con empresas del sector, proveedores, clientes potenciales 
                    y líderes de la industria en un ambiente propicio para los negocios.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-congress-blue rounded-lg flex items-center justify-center">
                      <FiStar className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Liderazgo de Pensamiento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Posiciona a tu empresa como líder de innovación compartiendo 
                    conocimientos y experiencias con la comunidad profesional.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-congress-cyan rounded-lg flex items-center justify-center">
                      <FiHome className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Desarrollo de Negocio</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Genera nuevas oportunidades comerciales y fortalece relaciones 
                    con clientes actuales en un contexto académico y profesional.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Participation Modalities */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Modalidades de Participación
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border-2 border-congress-blue">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-congress-blue rounded-lg flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Expositor con Stand</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Más Popular</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Espacio dedicado para presentar tu empresa, servicios o proyectos.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Stand personalizado incluido
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Material promocional permitido
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Acceso a todos los asistentes
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Inclusión en material oficial
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-congress-cyan">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-congress-cyan rounded-lg flex items-center justify-center">
                      <FiAward className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Presentador de Tecnología</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">Innovación</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Presenta vehículos, maquinaria o tecnologías innovadoras.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Espacio para demostración
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Presentación técnica
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Interacción directa con público
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Destacado como innovación
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-congress-blue rounded-lg flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Coordinador de Taller</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">Educativo</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    Lidera un taller práctico o instancia demostrativa.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Aula equipada incluida
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Material técnico permitido
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Posicionamiento como experto
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Feedback directo de asistentes
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-congress-cyan rounded-lg flex items-center justify-center">
                      <FaBuilding className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Modalidad Personalizada</CardTitle>
                      <Badge className="bg-orange-100 text-orange-800">Flexible</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    ¿Tienes una propuesta diferente? Trabajemos juntos.
                  </CardDescription>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Propuesta adaptada a tu empresa
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Formato flexible
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Colaboración especial
                    </li>
                    <li className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Contacto directo con organizadores
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 bg-congress-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Sumarte al Congreso?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-congress-cyan-light">
            Nos encantaría contar con tu presencia y ofrecerte la oportunidad de participar 
            en la modalidad que prefieras. Todas las modalidades son sin costo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-semibold px-8 py-3">
                Contactar para Participar
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="lg" variant="outline" className="bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-semibold px-8 py-3">
                Registro Individual
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              <div className="text-congress-white-light">
                <p className="mb-2">📧 congresologisticaytransporte@unab.edu.ar</p>
                <p className="mb-2">📍 Campus UNaB, Blas Parera 132</p>
                <p>📅 15 de Noviembre 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
