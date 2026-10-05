import { Link } from 'react-router-dom';
import useSite from '../hooks/useSite';

export default function Logo({ className = '' }) {
  const site = useSite();
  const [first, ...rest] = site.name.trim().split(' ');
  return (
    <Link
      to="/"
      aria-label={`${site.name}, ir al inicio`}
      className={`font-display text-lg font-extrabold uppercase tracking-[0.28em] text-white ${className}`}
    >
      {first}
      {rest.length > 0 && (
        <>
          <span className="px-1 text-gold">·</span>
          {rest.join(' ')}
        </>
      )}
    </Link>
  );
}
