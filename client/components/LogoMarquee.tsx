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
  const animationDirection: React.CSSProperties['animationDirection'] = direction === 'ltr' ? 'reverse' : 'normal';

  return (
    <div className="relative w-full overflow-hidden py-4 bg-white rounded-xl border border-congress-cyan/40 shadow-sm ring-1 ring-inset ring-congress-cyan/10">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />

      <div
        className="marquee-track"
        style={{
          ['--marquee-duration' as any]: `${durationSec}s`,
          ['--marquee-delay' as any]: `${startDelaySec}s`,
          ['--marquee-gap' as any]: `${gapPx}px`,
          animationDirection,
        }}
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
      </div>
    </div>
  );
}
