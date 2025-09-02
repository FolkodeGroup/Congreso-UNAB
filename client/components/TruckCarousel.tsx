import { motion } from 'framer-motion';
import * as React from 'react';
import { chunk, DEFAULT_LOGOS, type LogoItem } from './data/logos';

type Direction = 'ltr' | 'rtl';

interface TruckCarouselProps {
  logos?: LogoItem[];
  direction?: Direction; // default 'rtl'
  durationSec?: number; // full cross duration
}

const Truck: React.FC<{ logos: LogoItem[]; color: 'blue' | 'cyan' }>
= ({ logos, color }) => {
  const bg = color === 'blue' ? 'from-congress-blue to-congress-blue-dark' : 'from-congress-cyan to-congress-cyan-light';
  return (
    <div className="relative w-[900px] max-w-full">
      {/* Tractor + Trailer */}
      <div className="flex items-stretch">
        {/* Tractor (cab) */}
        <div className={`relative w-[160px] h-[130px] rounded-l-md shadow-xl overflow-hidden bg-gradient-to-br ${bg}`} aria-label="Cabina del camión">
          {/* Ventana */}
          <div className="absolute top-3 right-4 w-14 h-8 bg-white/70 rounded-sm" />
          {/* Parrilla */}
          <div className="absolute bottom-6 right-6 w-10 h-3 bg-black/20 rounded-sm" />
          {/* Enganche */}
          <div className="absolute -right-2 bottom-2 w-4 h-4 bg-gray-400 rounded-full border border-black/20" />
        </div>
        {/* Semi (trailer/logos) */}
        <div className="relative flex-1">
          <div className="rounded-r-md border-2 border-congress-blue bg-white">
            <div className="h-2 bg-gradient-to-r from-congress-cyan to-congress-cyan-light rounded-t-md" />
            <div className="grid grid-cols-4 gap-4 p-4">
              {logos.map((l, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  <img src={l.src} alt={l.alt} className={`${l.heightClass ?? 'h-16'} w-auto object-contain`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Wheels */}
      <div className="absolute -bottom-5 left-10 flex gap-6">
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
      </div>
      <div className="absolute -bottom-5 left-[260px] flex gap-6">
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
        <div className="w-9 h-9 bg-black rounded-full border-2 border-black/80" />
      </div>
    </div>
  );
};

export const TruckCarousel: React.FC<TruckCarouselProps> = ({ logos = DEFAULT_LOGOS, direction = 'rtl', durationSec = 18 }) => {
  const groups = chunk(logos.slice(0, 12), 4); // 3 groups of 4
  const initialX = direction === 'rtl' ? '110%' : '-110%';
  const targetX = direction === 'rtl' ? '-130%' : '130%';

  return (
    <div className="relative w-full overflow-hidden py-10">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ x: initialX }}
          animate={{ x: targetX }}
          transition={{ duration: durationSec, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: i * (durationSec / 3) }}
          className="absolute top-0"
          style={{ left: direction === 'rtl' ? undefined : 0, right: direction === 'rtl' ? 0 : undefined }}
        >
          <Truck logos={groups[i] ?? []} color={i % 2 === 0 ? 'blue' : 'cyan'} />
        </motion.div>
      ))}
    </div>
  );
};

export default TruckCarousel;
