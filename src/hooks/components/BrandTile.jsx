import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import BrandImage from './BrandImage';
import useTilt from '../hooks/useTilt';
import { slugify } from '../utils/slug';

// Tarjeta de marca con foto: en blanco y negro hasta que pasas el cursor.
export default function BrandTile({ brand, count, delay = 0 }) {
  const ref = useRef(null);
  useTilt(ref, 5);
  return (
    <Reveal delay={delay} variant="scale">
      <Link
        ref={ref}
        to={`/shop?brand=${slugify(brand.name)}`}
        className="tilt group relative block aspect-[4/5] overflow-hidden border border-white/10 bg-ink-900 hover:border-gold/60"
      >
        <BrandImage
          brand={brand}
          className="h-full w-full scale-105 grayscale brightness-[0.55] transition duration-[900ms] ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-90"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <span className="tilt-glare" aria-hidden="true" />
        <ArrowUpRight
          size={18}
          className="absolute right-3 top-3 -translate-x-1 translate-y-1 text-white opacity-0 transition duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
        <span className="absolute inset-x-0 bottom-0 block p-4">
          <span className="block font-display text-base font-bold uppercase tracking-[0.16em] text-white sm:text-lg">
            {brand.name}
          </span>
          <span className="mt-2 block h-px w-6 bg-gold transition-all duration-500 ease-out group-hover:w-16" />
          {typeof count === 'number' && (
            <span className="mt-2 block text-xs text-neutral-300">
              {count} {count === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </span>
      </Link>
    </Reveal>
  );
}
