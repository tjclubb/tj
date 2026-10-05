import { Link } from 'react-router-dom';

// Cinta continua de enlaces. items: [{ label, to }]. Se detiene al pasar el cursor.
// size 'lg' = letras grandes con contorno; 'sm' = línea fina de texto. reverse = corre en sentido contrario.
export default function BrandMarquee({ items, size = 'lg', reverse = false, label = 'Marcas disponibles', className = '' }) {
  if (!items.length) return null;
  const big = size === 'lg';

  const list = (hidden) => (
    <ul className={`flex shrink-0 items-center pr-10 ${big ? 'gap-10' : 'gap-8 pr-8'}`} aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.label} className={`flex items-center ${big ? 'gap-10' : 'gap-8'}`}>
          <Link
            to={it.to}
            tabIndex={hidden ? -1 : undefined}
            className={
              big
                ? 'stroke-text whitespace-nowrap font-display text-3xl font-extrabold uppercase tracking-wide sm:text-5xl'
                : 'whitespace-nowrap text-xs uppercase tracking-[0.3em] text-neutral-500 transition-colors duration-300 hover:text-gold-soft'
            }
          >
            {it.label}
          </Link>
          <span className={`rotate-45 bg-gold ${big ? 'h-1.5 w-1.5' : 'h-1 w-1'}`} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${
        big ? 'py-6' : 'py-4'
      } ${reverse ? 'marquee-reverse' : ''} ${className}`}
      aria-label={label}
    >
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
