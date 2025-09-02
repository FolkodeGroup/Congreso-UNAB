import { motion } from 'framer-motion';
import * as React from 'react';
import { chunk, LOGOS_12, type LogoItem } from './data/logos';

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
    <div className="relative w-[820px] max-w-full">
      <div className={`rounded-md shadow-xl bg-gradient-to-r ${bg} text-white flex items-center`}> 
        <div className="w-[120px] h-[120px] bg-white/10 rounded-l-md flex items-center justify-center">
          <div className="w-20 h-10 bg-white/20 rounded-sm border border-white/30" />
        </div>
        <div className="flex-1 grid grid-cols-4 gap-4 p-4 bg-white">
          {logos.map((l, idx) => (
            <div key={idx} className="flex items-center justify-center">
              <img src={l.src} alt={l.alt} className="h-16 max-h-16 w-auto object-contain" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="w-3 bg-black/10 rounded-r-md" />
      </div>
      <div className="absolute -bottom-5 left-24 flex gap-6">
        <div className="w-8 h-8 bg-black/70 rounded-full border-2 border-black/80" />
        <div className="w-8 h-8 bg-black/70 rounded-full border-2 border-black/80" />
        <div className="w-8 h-8 bg-black/70 rounded-full border-2 border-black/80" />
        <div className="w-8 h-8 bg-black/70 rounded-full border-2 border-black/80" />
      </div>
    </div>
  );
};

export const TruckCarousel: React.FC<TruckCarouselProps> = ({ logos = LOGOS_12, direction = 'rtl', durationSec = 18 }) => {
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
