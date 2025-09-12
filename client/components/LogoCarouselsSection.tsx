import * as React from "react";
import LogoMarquee from "@/components/LogoMarquee";
import {
  FIRST_CAROUSEL_LOGOS,
  SECOND_CAROUSEL_LOGOS,
  THIRD_CAROUSEL_LOGOS,
} from "@/components/data/logos";

export default function LogoCarouselsSection() {
  return (
    <section className="bg-white py-10">
      <div className="w-full px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Empresas e Instituciones Participantes
        </h2>
        <div className="space-y-6">
          <LogoMarquee
            direction="rtl"
            logos={FIRST_CAROUSEL_LOGOS}
            startDelaySec={0}
            durationSec={32.76}
          />
          <LogoMarquee
            direction="ltr"
            logos={SECOND_CAROUSEL_LOGOS}
            startDelaySec={1.2}
            durationSec={28.275}
          />
          <LogoMarquee
            direction="rtl"
            logos={THIRD_CAROUSEL_LOGOS}
            startDelaySec={2.4}
            durationSec={23.4}
          />
        </div>
      </div>
    </section>
  );
}
