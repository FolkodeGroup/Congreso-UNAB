import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiCalendar, FiMapPin, FiMail, FiUsers, FiClock, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-congress-blue to-congress-blue-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                CONGRESO DE LOGÍSTICA
                <span className="block text-congress-cyan">Y TRANSPORTE</span>
              </h1>
              <div className="w-24 h-1 bg-congress-cyan mx-auto mb-6"></div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-congress-cyan-light">
                MOVIENDO EL FUTURO
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-4">
                Innovación y desafíos en la logística y el transporte
              </p>
              <div className="flex items-center justify-center space-x-3 opacity-80">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-congress-blue rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 border border-white rounded-sm"></div>
                  </div>
                </div>
                <span className="text-sm font-medium">Universidad Nacional Guillermo Brown</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiCalendar className="w-8 h-8 mx-auto mb-3 text-congress-cyan" />
                <h3 className="font-semibold mb-2">Fecha</h3>
                <p className="text-lg">15 de Noviembre 2025</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiMapPin className="w-8 h-8 mx-auto mb-3 text-congress-cyan" />
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-lg">Campus UNaB<br />Blas Parera 132</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <FiMail className="w-8 h-8 mx-auto mb-3 text-congress-cyan" />
                <h3 className="font-semibold mb-2">Contacto</h3>
                <p className="text-sm break-all">congresologisticaytransporte@unab.edu.ar</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registro">
                <Button size="lg" className="bg-congress-cyan hover:bg-congress-cyan-light text-congress-blue font-semibold px-8 py-3">
                  Registrarse Ahora
                </Button>
              </Link>
              <Link to="/programa">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-congress-blue px-8 py-3">
                  Ver Programa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un Evento de Alto Nivel
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Este congreso reunirá a los principales actores del sector logístico y de transporte
              para reflexionar y debatir sobre los desafíos y oportunidades tanto a nivel nacional como internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-congress-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">30+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empresas</h3>
              <p className="text-gray-600">Empresas líderes del sector participando</p>
            </div>

            <div className="text-center">
              <div className="bg-congress-cyan text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">25+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Disertantes</h3>
              <p className="text-gray-600">Especialistas y académicos de primer nivel</p>
            </div>

            <div className="text-center">
              <div className="bg-congress-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alcances</h3>
              <p className="text-gray-600">Nacional e internacional</p>
            </div>

            <div className="text-center">
              <div className="bg-congress-cyan text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">0</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Costo</h3>
              <p className="text-gray-600">Participación gratuita</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Sobre el Congreso
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              El Congreso de Logística y Transporte 2025 de la Universidad Nacional Guillermo Brown
              es un evento académico de alcance nacional e internacional que reúne a más de 30 empresas
              del sector y más de 25 disertantes de primer nivel. Nuestro objetivo es crear un espacio
              de reflexión y debate sobre los principales desafíos y oportunidades en la logística y
              el transporte, promoviendo el intercambio de conocimientos entre especialistas,
              profesionales y académicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader className="text-center">
                <FiUsers className="w-12 h-12 mx-auto mb-4 text-congress-blue" />
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Conecta con profesionales, académicos y líderes de la industria logística y de transporte
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <FiClock className="w-12 h-12 mx-auto mb-4 text-congress-blue" />
                <CardTitle>Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Descubre las últimas tecnologías y metodologías que están transformando el sector
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <FiAward className="w-12 h-12 mx-auto mb-4 text-congress-blue" />
                <CardTitle>Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Participa en conferencias magistrales y talleres dirigidos por expertos reconocidos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Temas del Congreso
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-congress-blue mb-4">Logística</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Gestión de cadenas de suministro
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Logística 4.0 y transformación digital
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Automatización de almacenes
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Sostenibilidad en la logística
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    E-commerce y última milla
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-congress-blue mb-4">Transporte</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Movilidad urbana sostenible
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Transporte multimodal
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Vehículos autónomos
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Infraestructura inteligente
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Políticas públicas de transporte
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <span className="font-semibold text-congress-blue"> Todas las modalidades son sin costo</span>
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
                    Presenta tu empresa, servicios o proyectos en un espacio dedicado.
                    Conecta directamente con profesionales del sector y genera nuevas
                    oportunidades de negocio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-congress-cyan transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-congress-cyan rounded-lg flex items-center justify-center mb-4">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Presentador de Tecnología</CardTitle>
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
                  <CardTitle className="text-xl">Coordinador de Taller</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Lidera un taller práctico o instancia demostrativa.
                    Comparte tu expertise y conocimientos prácticos con
                    otros profesionales del sector.
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
                  Únete a las más de 30 empresas que ya confirmaron su participación.
                  Es una excelente oportunidad para networking, visibilidad y desarrollo de negocio.
                </p>
                <Link to="/contacto">
                  <Button className="bg-congress-blue hover:bg-congress-blue-dark mr-4">
                    Contactar para Participar
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button variant="outline" className="border-congress-blue text-congress-blue hover:bg-congress-blue hover:text-white">
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
            Únete a nosotros en este importante evento que marcará el rumbo 
            de la logística y el transporte en Argentina y Latinoamérica.
          </p>
          <Link to="/registro">
            <Button size="lg" className="bg-congress-cyan hover:bg-congress-cyan-light text-congress-blue font-semibold px-8 py-3">
              Registrarse Gratis
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
