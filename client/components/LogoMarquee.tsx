import { motion } from 'framer-motion';
import * as React from 'react';
import type { LogoItem } from '@/components/data/logos';

type Direction = 'ltr' | 'rtl';

interface LogoMarqueeProps {
  logos: LogoItem[];
  direction?: Direction; // default 'rtl'
  durationSec?: number; // full loop duration
  startDelaySec?: number; // initial delay
  gapPx?: number; // space between logos
}

export default function LogoMarquee({
  logos,
  direction = 'rtl',
  durationSec = 18,
  startDelaySec = 0,
  gapPx = 32,
}: LogoMarqueeProps) {
  const track = React.useMemo(() => [...logos, ...logos], [logos]);
  const animate = direction === 'rtl' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div className="relative w-full overflow-hidden py-6 bg-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />

      <motion.div
        className="flex min-w-fit items-center"
        style={{ gap: `${gapPx}px` }}
        animate={{ x: animate }}
        transition={{ duration: durationSec, ease: 'linear', repeat: Infinity, delay: startDelaySec }}
      >
        {track.map((l, idx) => (
          <div key={`${l.src}-${idx}`} className="flex items-center justify-center shrink-0">
            <img
              src={l.src}
              alt={l.alt}
              loading="lazy"
              className={`${l.heightClass ?? 'h-16'} w-auto object-contain grayscale-0 opacity-90 hover:opacity-100 transition-opacity`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
