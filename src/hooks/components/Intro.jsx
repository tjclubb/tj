import { Fragment, useEffect, useState } from 'react';
import useSite from '../hooks/useSite';
import { getSite } from '../data/siteStore';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ¿Se muestra la animación de entrada? Solo al abrir la página (no al cambiar de sección) y si no se pidió reducir movimiento.
export const introWillPlay = () => typeof window !== 'undefined' && !reduced() && getSite().intro !== false;

// Se llama antes de pintar la página: mantiene en pausa las animaciones del inicio hasta que la cortina se levante.
export const prepareIntro = () => {
  if (introWillPlay()) document.documentElement.classList.add('intro-playing');
};

export default function Intro() {
  const site = useSite();
  const [play] = useState(introWillPlay);
  const [done, setDone] = useState(false);

  const finish = () => {
    document.documentElement.classList.remove('intro-playing');
    setDone(true);
  };

  useEffect(() => {
    if (!play || done) return undefined;
    document.documentElement.classList.add('intro-playing');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const release = setTimeout(() => document.documentElement.classList.remove('intro-playing'), 2000);
    const end = setTimeout(() => setDone(true), 3100);
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(release);
      clearTimeout(end);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('intro-playing');
    };
  }, [play, done]);

  if (!play || done) return null;

  const words = site.name.trim().split(/\s+/).filter(Boolean);
  let n = 0;

  return (
    <div
      role="presentation"
      onClick={finish}
      className="intro-curtain fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center border-b border-gold/70 bg-ink-950 px-5"
    >
      <p className="sr-only">{site.name}</p>
      <div aria-hidden="true" className="flex items-center gap-[0.4em] font-display text-5xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-7xl md:text-8xl">
        {words.map((w, wi) => (
          <Fragment key={`${w}-${wi}`}>
            {wi > 0 && <span className="intro-dot h-2 w-2 rotate-45 bg-gold sm:h-3 sm:w-3" />}
            <span className="flex">
              {[...w].map((ch, ci) => {
                const delay = `${0.2 + n++ * 0.08}s`;
                return (
                  <span key={ci} className="intro-mask">
                    <span className="intro-letter" style={{ animationDelay: delay }}>
                      {ch}
                    </span>
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </div>
      <span aria-hidden="true" className="intro-line mt-8 block h-px w-40 bg-gold sm:w-64" />
      {site.tagline && (
        <p aria-hidden="true" className="anim-rise mt-5 text-[11px] uppercase tracking-[0.32em] text-neutral-400" style={{ animationDelay: '1.2s' }}>
          {site.tagline}
        </p>
      )}
    </div>
  );
}
