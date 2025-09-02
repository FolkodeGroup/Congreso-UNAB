import * as React from 'react';
import type { LogoItem } from '@/components/data/logos';

type Direction = 'ltr' | 'rtl';

interface LogoMarqueeProps {
  logos: LogoItem[];
  direction?: Direction; // default 'rtl'
  durationSec?: number; // seconds to move one half-track
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
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const halfRef = React.useRef(0);
  const offsetRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const measure = () => {
      // total width is duplicated list; half is a single sequence
      const half = el.scrollWidth / 2;
      halfRef.current = half;
      // initialize offset based on direction
      offsetRef.current = direction === 'rtl' ? 0 : -half;
      el.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      const prevHalf = halfRef.current;
      measure();
      // keep offset within [-half, 0]
      const half = halfRef.current;
      if (direction === 'rtl') {
        if (offsetRef.current <= -half) offsetRef.current += half;
        if (offsetRef.current > 0) offsetRef.current = 0;
      } else {
        if (offsetRef.current >= 0) offsetRef.current -= half;
        if (offsetRef.current < -half) offsetRef.current = -half;
      }
      el.style.transform = `translate3d=${offsetRef.current}px, 0, 0`;
    });
    resizeObserver.observe(el);

    let prev = performance.now();
    let started = false;

    const speedPxPerSec = () => {
      const half = Math.max(1, halfRef.current);
      return half / Math.max(0.001, durationSec);
    };

    const loop = (now: number) => {
      if (!trackRef.current) return;
      // wait for start delay without drifting time
      if (!started) {
        if (now - prev < startDelaySec * 1000) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        started = true;
        prev = now;
      }

      const dt = (now - prev) / 1000;
      prev = now;

      const dir = direction === 'rtl' ? -1 : 1;
      const delta = dir * speedPxPerSec() * dt;

      let next = offsetRef.current + delta;
      const half = halfRef.current;

      if (dir < 0) {
        // moving left
        if (next <= -half) next += half;
      } else {
        // moving right
        if (next >= 0) next -= half;
      }

      offsetRef.current = next;
      trackRef.current.style.transform = `translate3d(${next}px, 0, 0)`;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [direction, durationSec, startDelaySec, logos]);

  return (
    <div className="relative w-full overflow-hidden py-4 bg-white rounded-xl border border-congress-cyan/40 shadow-sm ring-1 ring-inset ring-congress-cyan/10">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />

      <div
        ref={trackRef}
        className="marquee-track no-anim"
        style={{
          ['--marquee-gap' as any]: `${gapPx}px`,
          willChange: 'transform',
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
