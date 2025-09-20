import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FiUsers,
  FiClock,
  FiHome,
  FiTrendingUp,
  FiStar,
  FiMail,
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import LargeLogoCarousel from "@/components/LargeLogoCarousel";

// Constantes para mejorar mantenibilidad
const CONTACT_EMAIL = "congresologisticaytransporte@unab.edu.ar";
const EVENT_DATE = "15 de Noviembre 2025";
const EVENT_LOCATION = "Campus UNaB Blas Parera 132, Burzaco";
const EXPECTED_ATTENDEES = "más de 500 asistentes";

// Datos estructurados para los beneficios
const BENEFITS = [
  {
    id: "visibility",
    icon: FiTrendingUp,
    title: "Visibilidad de Marca",
    description: `Posiciona tu empresa frente a ${EXPECTED_ATTENDEES} especializados en logística y transporte, incluyendo tomadores de decisión.`,
    gradient: "from-congress-blue/90 to-congress-cyan/80",
    iconGradient: "from-congress-blue to-congress-cyan",
  },
  {
    id: "networking",
    icon: FaHandshake,
    title: "Networking Estratégico",
    description:
      "Conecta con empresas del sector, proveedores, clientes potenciales y líderes de la industria en un ambiente propicio para los negocios.",
    gradient: "from-congress-cyan/90 to-congress-blue/80",
    iconGradient: "from-congress-cyan to-congress-cyan-light",
  },
  {
    id: "leadership",
    icon: FiStar,
    title: "Liderazgo de Pensamiento",
    description:
      "Posiciona a tu empresa como líder de innovación compartiendo conocimientos y experiencias con la comunidad profesional.",
    gradient: "from-congress-blue-dark/90 to-congress-cyan/80",
    iconGradient: "from-congress-blue-dark to-congress-blue",
  },
  {
    id: "business",
    icon: FiHome,
    title: "Desarrollo de Negocio",
    description:
      "Genera nuevas oportunidades comerciales y fortalece relaciones con clientes actuales en un contexto académico y profesional.",
    gradient: "from-congress-cyan-light/90 to-congress-blue-dark/80",
    iconGradient: "from-congress-cyan-light to-congress-blue",
    showContact: true,
  },
];

// Datos para las cards de información
const INFO_CARDS = [
  {
    id: "date",
    icon: FiClock,
    title: "Fecha",
    description: EVENT_DATE,
    gradient: "from-congress-blue to-congress-cyan",
  },
  {
    id: "location",
    icon: FiHome,
    title: "Ubicación",
    description: EVENT_LOCATION,
    gradient: "from-congress-cyan to-congress-blue",
    link: "/#mapa",
  },
  {
    id: "contact",
    icon: FiUsers,
    title: "Contacto",
    description: CONTACT_EMAIL.replace("@", "\n@"),
    gradient: "from-congress-blue-dark to-congress-cyan-light",
    link: `mailto:${CONTACT_EMAIL}`,
  },
];

// Componente para las cards de información
function InfoCard({ card }: { card: (typeof INFO_CARDS)[0] }) {
  const CardComponent = (
    <Card className="group h-full flex flex-col items-center rounded-2xl border-0 bg-white/10 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div
        className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-full flex items-center justify-center mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300`}
      >
        <card.icon className="h-8 w-8 text-white" />
      </div>
      <CardTitle className="mb-2 text-lg font-bold text-white">
        {card.title}
      </CardTitle>
      <CardDescription className="whitespace-pre-line text-center text-base text-white">
        {card.description}
      </CardDescription>
    </Card>
  );

  if (card.link) {
    return card.link.startsWith("mailto:") ? (
      <a href={card.link} className="group">
        {CardComponent}
      </a>
    ) : (
      <Link to={card.link} className="group">
        {CardComponent}
      </Link>
    );
  }

  return CardComponent;
}

// Componente para las cards de beneficios
function BenefitCard({ benefit }: { benefit: (typeof BENEFITS)[0] }) {
  return (
    <Card
      className={`group transform border-0 bg-gradient-to-br p-6 text-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${benefit.gradient} rounded-2xl`}
    >
      <CardHeader className="mb-4 flex flex-col items-center justify-center">
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:shadow-xl ${benefit.iconGradient}`}
        >
          <benefit.icon className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white transition-colors">
          {benefit.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-lg leading-relaxed text-congress-white/90">
          {benefit.description}
          {benefit.showContact && (
            <span className="mt-4 block text-base font-semibold text-white">
              <FiMail className="inline-block mr-2 align-text-bottom h-5 w-5" />
              {CONTACT_EMAIL.replace("@", "\n@")}
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function Empresas() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-congress-blue to-congress-blue-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Participa como <span className="text-congress-cyan">Empresa</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Sumate a las más de 30 empresas líderes del sector que ya
              confirmaron su participación en el congreso más importante de
              logística y transporte del país.
            </p>
            <Link to="/contacto">
              <Button
                size="xxl"
                className="button-super-enhanced bg-congress-blue-dark hover:bg-congress-cyan-light text-congress-white font-bold px-8 py-6 text-lg md:px-16 md:py-8 md:text-xl shadow-4xl hover:shadow-4xl transform hover:scale-110 transition-all duration-300 animate-gentle-pulse hover:animate-none"
              >
                Participación 100% Gratuita
              </Button>
            </Link>
          </div>
          {/* Cards de información principal */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {INFO_CARDS.map((card) => (
              <InfoCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>
      {/* Large Logo Carousel Section */}
      <section className="bg-gray-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Nuestras Empresas Participantes
          </h2>
          <LargeLogoCarousel />
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Beneficios de Participar
            </h2>

            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {BENEFITS.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Participation Modalities */}
      {/* <section className="py-16 bg-gray-50">
                  </ul>
                  </ul>
                  </ul>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 bg-congress-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Sumarte al Congreso?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-congress-cyan-light">
            Nos encantaría contar con tu presencia y ofrecerte la oportunidad de
            participar en la modalidad que prefieras. Todas las modalidades son
            sin costo.
          </p>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <Link to="/contacto">
              <Button
                size="xl"
                variant="outline"
                className="w-full bg-white hover:bg-congress-cyan text-congress-blue hover:text-white font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
              >
                Contactar para Participar
              </Button>
            </Link>
            <Link to="/seleccion-registro">
              <Button
                size="xl"
                variant="outline"
                className="w-full bg-white hover:bg-congress-cyan text-congress-blue hover:text-white font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white"
              >
                Registro Individual
              </Button>
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Información de Contacto
              </h3>
              <div className="space-y-4 text-white">
                <p className="flex items-center justify-center">
                  <FiMail className="mr-3 h-5 w-5 flex-shrink-0 text-white" />
                  <span>{CONTACT_EMAIL}</span>
                </p>
                <p className="flex items-center justify-center">
                  <FiHome className="mr-3 h-5 w-5 flex-shrink-0 text-white" />
                  <span>{EVENT_LOCATION}</span>
                </p>
                <p className="flex items-center justify-center">
                  <FiClock className="mr-3 h-5 w-5 flex-shrink-0 text-white" />
                  <span>{EVENT_DATE}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
