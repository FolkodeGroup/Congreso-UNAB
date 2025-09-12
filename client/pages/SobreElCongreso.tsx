import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiUsers, FiClock, FiAward } from "react-icons/fi";

export default function SobreElCongreso() {
  return (
    <>
      <section className="py-16 bg-gray-50 degradado-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sobre el Congreso
            </h2>
            <p className="text-lg text-white leading-relaxed">
              El Congreso de Logística y Transporte 2025 de la Universidad
              Nacional Guillermo Brown es un evento académico de alcance
              nacional e internacional que reúne a más de 30 empresas del sector
              y más de 25 disertantes de primer nivel. Nuestro objetivo es crear
              un espacio de reflexión y debate sobre los principales desafíos y
              oportunidades en la logística y el transporte, promoviendo el
              intercambio de conocimientos entre especialistas, profesionales y
              académicos.
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
                  Conecta con profesionales, académicos y líderes de la
                  industria logística y de transporte
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
                  Descubre las últimas tecnologías y metodologías que están
                  transformando el sector
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
                  Participa en conferencias magistrales y talleres dirigidos por
                  expertos reconocidos
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Moviendo el futuro
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Este congreso reunirá a los principales actores del sector
                  logístico y de transporte para reflexionar y debatir sobre los
                  desafíos y oportunidades tanto a nivel nacional como
                  internacional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-congress-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">30+</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Empresas
                  </h3>
                  <p className="text-gray-600">
                    Empresas líderes del sector participando
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-congress-cyan text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">25+</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Disertantes
                  </h3>
                  <p className="text-gray-600">
                    Especialistas y académicos de primer nivel
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-congress-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Alcances
                  </h3>
                  <p className="text-gray-600">Nacional e internacional</p>
                </div>

                <div className="text-center">
                  <div className="bg-congress-cyan text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Costo
                  </h3>
                  <p className="text-gray-600">Participación gratuita</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
