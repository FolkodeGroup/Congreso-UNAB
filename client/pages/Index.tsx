import { useEffect} from 'react';
import { useLocation } from 'react-router-dom';
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
import { FaTrain, FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";
import LogoCarouselsSection from "@/components/LogoCarouselsSection";
import { useRef } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

export default function Index() {
  const mapRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#mapa' && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  };
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
                    size="xl"
                    className="bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
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
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-white/50 transition-all duration-300" onClick={scrollToMap}>
                <FiMapPin className="w-8 h-8 mx-auto mb-3 text-congress-blue-dark" />
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-lg">
                  Campus UNaB
                  <br />
                  Blas Parera 132, Burzaco
                </p>
              </div>
              <Link to="/contacto" className="block">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/50 transition-all duration-300">
                  <FiMail className="w-8 h-8 mx-auto mb-3 text-congress-blue-dark" />
                  <h3 className="font-semibold mb-2">Contacto</h3>
                  <p className="text-sm break-all">
                    congresologisticaytransporte@unab.edu.ar
                  </p>
                </div>
              </Link>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </div> */}
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
              <Card className="group border-2 border-congress-blue/20 hover:border-congress-blue hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-congress-blue/5 card-enhanced relative overflow-hidden">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-congress-blue to-congress-blue-dark rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                    <FiUsers className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-congress-blue-dark group-hover:text-congress-blue transition-colors">Expositor con Stand</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Presenta tu empresa, servicios o proyectos en un espacio
                    dedicado. Conecta directamente con profesionales del sector
                    y genera nuevas oportunidades de negocio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group border-2 border-congress-cyan/20 hover:border-congress-cyan hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-congress-cyan/5 card-enhanced relative overflow-hidden">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-congress-cyan to-congress-cyan-light rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                    <FiAward className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-congress-blue-dark group-hover:text-congress-cyan transition-colors">
                    Presentador de Tecnología
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Muestra vehículos, maquinaria o tecnologías innovadoras.
                    Demuestra las últimas innovaciones que están transformando
                    el sector logístico y de transporte.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group border-2 border-congress-blue/20 hover:border-congress-blue hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-congress-blue/5 card-enhanced relative overflow-hidden">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-congress-blue to-congress-blue-dark rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                    <FiClock className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-congress-blue-dark group-hover:text-congress-blue transition-colors">
                    Coordinador de Taller
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    Lidera un taller práctico o instancia demostrativa. Comparte
                    tu expertise y conocimientos prácticos con otros
                    profesionales del sector.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group border-2 border-congress-cyan/20 hover:border-congress-cyan hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-congress-cyan/5 card-enhanced relative overflow-hidden">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-congress-cyan to-congress-cyan-light rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 icon-float">
                    <FiUsers className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-congress-blue-dark group-hover:text-congress-cyan transition-colors">Otras Modalidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    ¿Tienes una propuesta diferente? Nos encantaría conocer
                    otras modalidades que consideres relevantes y de interés
                    para el sector. Contáctanos para conversarlo.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="relative bg-gradient-to-br from-congress-blue to-congress-blue-dark rounded-2xl p-8 border-2 border-congress-cyan shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* Efecto de brillo decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-congress-cyan/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-congress-cyan-light/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <span className="text-3xl">💡</span>
                    ¿Interesado en Participar como Empresa?
                  </h3>
                  <p className="text-congress-cyan-light mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
                    Únete a las más de 30 empresas que ya confirmaron su
                    participación. Es una excelente oportunidad para networking,
                    visibilidad y desarrollo de negocio.
                  </p>
                  <Link to="/contacto">
                    <Button 
                      size="xl" 
                      className="bg-congress-cyan hover:bg-congress-cyan-light text-congress-blue-dark hover:text-congress-blue font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-congress-cyan-light"
                    >
                      Contactar para Participar
                    </Button>
                  </Link>
                </div>
                {/* <Link to="/registro">
                  <Button
                    variant="outline"
                    className="border-congress-blue text-congress-blue hover:bg-congress-blue hover:text-white"
                  >
                    Registro Individual
                  </Button>
                </Link> */}
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
          <p className="text-xl mb-8 max-w-2xl mx-auto text-congress-white">
            Únete a nosotros en este importante evento que marcará el rumbo de
            la logística y el transporte en Argentina y Latinoamérica.
          </p>
          <Link to="/registro">
            <Button
              size="xxl"
              className="button-super-enhanced bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-bold px-16 py-8 text-xl shadow-4xl hover:shadow-4xl transform hover:scale-110 transition-all duration-300 animate-gentle-pulse hover:animate-none"
            >
              Registrarse Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Mapa Section */}
      <section id="mapa" ref={mapRef} className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Cómo llegar?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              El congreso se realizará en el Campus de la Universidad Nacional Guillermo Brown,
              ubicado en Blas Parera 132. Te esperamos!
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Acordeón para opciones de transporte con estilos personalizados */}
            <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow border border-congress-cyan">
              <AccordionItem value="caba" className="border-b border-congress-cyan">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  Desde CABA (Obelisco)
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <ul className="space-y-2">
                    <li><strong>Transporte Público:</strong> Tomar Subte hasta Constitución, luego Tren Roca (ramales A. Korn, Glew) hasta la estación Burzaco. Desde allí, colectivos locales o 15 min a pie.</li>
                    <li><strong>En Auto:</strong> Tomar Au. 25 de Mayo, luego Au. Riccheri y Camino de Cintura (Ruta 4) hasta Av. Espora. El viaje dura aprox. 45-60 min.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="adrogue" className="border-b border-congress-cyan">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  Desde Adrogué
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <ul className="space-y-2">
                    <li><strong>506 (Gendarmería - Por Bynnon):</strong> Av Espora - esq. Ricardo Rojas</li>
                    <li><strong>79 (Constitución - San Vicente):</strong> Av Espora (Colegio Nacional de Adrogué)</li>
                    <li><strong>74 (A):</strong> Av Espora (Colegio Nacional de Adrogué)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="burzaco" className="border-b border-congress-cyan">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  Desde Burzaco
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <ul className="space-y-2">
                    <li><strong>506 (Gendarmería - Por Bynnon):</strong> Av Espora - esq. Ricardo Rojas</li>
                    <li><strong>266 (A):</strong> Estación Burzaco</li>
                    <li><strong>74 (A):</strong> Av Espora - esq. Ricardo Rojas</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="longchamps" className="border-b border-congress-cyan">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  Desde Longchamps
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <ul className="space-y-2">
                    <li><strong>79 (San Vicente):</strong> Constitución (Chiesa y Francia)</li>
                    <li><strong>506 (San Jose, Por Bynnon):</strong> Alsina y Magdalena Motti de Tieghi</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tren" className="border-b border-congress-cyan">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  En Tren (Línea Roca)
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <p>Las estaciones más cercanas son <strong>Adrogué</strong>, <strong>Burzaco</strong> y <strong>Longchamps</strong>.<br />
                  Desde ambas, puedes tomar un colectivo o servicio de auto hasta el campus.</p>
                  <p className="mt-2 text-xs text-gray-500">Nota: Se está construyendo la nueva estación "Universidad Guillermo Brown". Verifica su estado para la fecha del evento.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="auto">
                <AccordionTrigger className="px-6 py-4 text-congress-blue font-semibold hover:bg-congress-cyan/20 data-[state=open]:bg-congress-cyan/10 transition-colors">
                  En Auto
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 bg-congress-cyan/5">
                  <p><strong>Acceso principal:</strong> Por Av. Espora, a 3 cuadras de la Ruta Provincial 4 (Camino de Cintura).</p>
                  <p><strong>GPS:</strong> Blas Parera 132, Burzaco.</p>
                  <p><strong>Estacionamiento:</strong> Habrá estacionamiento disponible en un predio alejado para los asistentes al congreso.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          

          <div className="flex justify-center mt-12">
            <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3274.70762014795!2d-58.38742082408727!3d-34.838443069932694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd5aebf3ce8ad%3A0x61e0dc504088584!2sUniversidad%20Nacional%20Guillermo%20Brown%20(UNAB)!5e0!3m2!1ses-419!2sar!4v1756827211940!5m2!1ses-419!2sar"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del Congreso - Universidad Nacional Guillermo Brown"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-congress-blue mb-4">Dirección</h3>
              <p className="text-lg text-gray-700 mb-2">
                <strong>Universidad Nacional Guillermo Brown</strong>
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Blas Parera 132, Burzaco, Buenos Aires
              </p>
              <Button
                size="xl"
                className="bg-congress-blue-dark hover:bg-congress-cyan-light text-white font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <a
                  href="https://maps.google.com/?q=Universidad+Nacional+Guillermo+Brown+Blas+Parera+132+Adrogué+Buenos+Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>


    </Layout>
  );
}

