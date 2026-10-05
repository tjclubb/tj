import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../hooks/useCart';

const NAV = [
  ['/', 'Inicio'],
  ['/shop', 'Tienda'],
  ['/brands', 'Marcas'],
  ['/shop?sale=1', 'Ofertas'],
  ['/about', 'Nosotros'],
  ['/contact', 'Contacto'],
];

export default function Header() {
  const { count, favorites } = useCart();
  const loc = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [solid, setSolid] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearchOpen(false);
  }, [loc.pathname, loc.search]);

  const isActive = (to) => {
    const [path, qs = ''] = to.split('?');
    if (loc.pathname !== path) return false;
    if (path === '/shop') {
      const sale = new URLSearchParams(loc.search).get('sale') === '1';
      return qs ? sale : !sale;
    }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
    setQ('');
  };

  const iconBtn = 'relative grid h-10 w-10 place-items-center text-white transition hover:text-gold';

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        solid ? 'border-white/10 bg-ink-950/90 backdrop-blur' : 'border-transparent bg-ink-950'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map(([to, label]) => (
            <Link
              key={label}
              to={to}
              aria-current={isActive(to) ? 'page' : undefined}
              className={`nav-link text-xs uppercase tracking-[0.22em] transition-colors ${
                isActive(to) ? 'text-gold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <button type="button" className={iconBtn} aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
            <Search size={19} />
          </button>
          <Link to="/shop?fav=1" className={`${iconBtn} hidden sm:grid`} aria-label={`Favoritos (${favorites.length})`}>
            <Heart size={19} />
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
            )}
          </Link>
          <Link to="/cart" className={iconBtn} aria-label={`Carrito (${count})`}>
            <ShoppingBag size={19} />
            {count > 0 && (
              <span
                key={count}
                className="absolute right-0 top-0 grid h-4 min-w-[1rem] animate-pop place-items-center bg-gold px-1 text-[10px] font-bold text-black"
              >
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            aria-label={menu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold"
      />

      {searchOpen && (
        <form onSubmit={submit} className="container-x anim-drop pb-4" role="search">
          <label htmlFor="header-search" className="sr-only">
            Buscar productos
          </label>
          <div className="flex gap-2">
            <input
              id="header-search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busca por marca, prenda o nombre"
              className="input"
            />
            <button type="submit" className="btn-solid !px-5">
              Buscar
            </button>
          </div>
        </form>
      )}

      {menu && (
        <nav className="anim-drop border-t border-white/10 bg-ink-950 lg:hidden" aria-label="Menú móvil">
          <div className="container-x flex flex-col py-3">
            {NAV.map(([to, label], i) => (
              <Link
                key={label}
                to={to}
                style={{ animationDelay: `${60 + i * 45}ms` }}
                className={`anim-rise border-b border-white/5 py-3.5 text-sm uppercase tracking-[0.22em] ${
                  isActive(to) ? 'text-gold' : 'text-neutral-200'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link to="/shop?fav=1" className="py-3.5 text-sm uppercase tracking-[0.22em] text-neutral-200">
              Favoritos ({favorites.length})
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
