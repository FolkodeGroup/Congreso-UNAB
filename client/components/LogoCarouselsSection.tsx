import * as React from "react";
import LogoMarquee from "@/components/LogoMarquee";
import { useEmpresas } from "@/hooks/use-empresas";
import { chunk } from "@/components/data/logos";

export default function LogoCarouselsSection() {
  const { logosForCarousel, loading, error } = useEmpresas();

  if (loading) {
    return (
      <section className="bg-white py-10">
        <div className="w-full px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Empresas e Instituciones Participantes
          </h2>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-10">
        <div className="w-full px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Empresas e Instituciones Participantes
          </h2>
          <div className="text-center text-red-600 py-4">
            Error al cargar las empresas: {error}
          </div>
        </div>
      </section>
    );
  }

  if (logosForCarousel.length === 0) {
    return (
      <section className="bg-white py-10">
        <div className="w-full px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Empresas e Instituciones Participantes
          </h2>
          <div className="text-center text-gray-600 py-4">
            No hay empresas disponibles en este momento.
            <br />
            Las empresas se mostrarán una vez que sean cargadas desde el panel de administración.
          </div>
        </div>
      </section>
    );
  }

  // Dividir logos en tres grupos para los carruseles
  const chunkSize = Math.ceil(logosForCarousel.length / 3);
  const logoGroups = chunk(logosForCarousel, chunkSize);
  const firstCarouselLogos = logoGroups[0] || [];
  const secondCarouselLogos = logoGroups[1] || [];
  const thirdCarouselLogos = logoGroups[2] || [];

  return (
    <section className="bg-white py-10">
      <div className="w-full px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Empresas e Instituciones Participantes
        </h2>
        <div className="space-y-6">
          {firstCarouselLogos.length > 0 && (
            <LogoMarquee
              direction="rtl"
              logos={firstCarouselLogos}
              startDelaySec={0}
              durationSec={32.76}
            />
          )}
          {secondCarouselLogos.length > 0 && (
            <LogoMarquee
              direction="ltr"
              logos={secondCarouselLogos}
              startDelaySec={1.2}
              durationSec={28.275}
            />
          )}
          {thirdCarouselLogos.length > 0 && (
            <LogoMarquee
              direction="rtl"
              logos={thirdCarouselLogos}
              startDelaySec={2.4}
              durationSec={23.4}
            />
          )}
        </div>
      </div>
    </section>
  );
}