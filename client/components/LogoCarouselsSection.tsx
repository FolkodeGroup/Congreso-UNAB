import * as React from 'react';
import TruckCarousel from '@/components/TruckCarousel';
import { FIRST_CAROUSEL_LOGOS } from '@/components/data/logos';

export default function LogoCarouselsSection() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Empresas Participantes</h2>
        <div className="space-y-6">
          <TruckCarousel direction="rtl" logos={FIRST_CAROUSEL_LOGOS} />
          <TruckCarousel direction="ltr" />
          <TruckCarousel direction="rtl" />
        </div>
      </div>
    </section>
  );
}
