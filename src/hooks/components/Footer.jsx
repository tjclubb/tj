import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import Disclaimer from './Disclaimer';
import Reveal from './Reveal';
import useSite from '../hooks/useSite';
import { socialLinks } from '../utils/social';

const legal = [
  ['/legal/terminos', 'Términos y condiciones'],
  ['/legal/privacidad', 'Política de privacidad'],
  ['/legal/devoluciones', 'Cambios y devoluciones'],
];

const colTitle = 'mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white';
const link = 'text-sm text-neutral-400 transition hover:text-white';

export default function Footer() {
  const site = useSite();
  const social = socialLinks(site);
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-900">
      <Reveal className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-neutral-400">
            Ropa nueva de marcas reconocidas, seleccionada para ti.
          </p>
        </div>

        {social.length > 0 && (
        <div>
          <h3 className={colTitle}>Síguenos</h3>
          <ul className="space-y-2.5">
            {social.map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1`}>
                  {name}
                  <ArrowUpRight size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        )}

        <div>
          <h3 className={colTitle}>Información</h3>
          <ul className="space-y-2.5">
            <li>
              <Link to="/contact" className={link}>
                Contacto
              </Link>
            </li>
            {legal.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={colTitle}>Métodos de pago</h3>
          <ul className="flex flex-wrap gap-2">
            {site.paymentMethods.map((m) => (
              <li key={m} className="border border-white/15 px-3 py-1.5 text-xs text-neutral-400">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="border-t border-white/10">
        <div className="container-x space-y-3 py-6">
          <Disclaimer />
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
