import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionTitle({ eyebrow, title, to, cta = 'Ver todo' }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">{title}</h2>
        <span className="draw mt-3 block h-px w-16 bg-gold" aria-hidden="true" />
      </div>
      {to && (
        <Link
          to={to}
          className="group hidden shrink-0 items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white sm:flex"
        >
          {cta}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
