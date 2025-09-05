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
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Empresas y Universidades Participantes
        </h2>
        <div className="space-y-6">
          <LogoMarquee
            direction="rtl"
            logos={FIRST_CAROUSEL_LOGOS}
            startDelaySec={0}
            durationSec={25.2}
          />
          <LogoMarquee
            direction="ltr"
            logos={SECOND_CAROUSEL_LOGOS}
            startDelaySec={1.2}
            durationSec={21.75}
          />
          <LogoMarquee
            direction="rtl"
            logos={THIRD_CAROUSEL_LOGOS}
            startDelaySec={2.4}
            durationSec={18}
          />
        </div>
      </div>
    </section>
  );
}
