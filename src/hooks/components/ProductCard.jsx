import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductImage from './ProductImage';
import { useCart } from '../hooks/useCart';
import { discountPct, money } from '../utils/format';

export default function ProductCard({ product }) {
  const { add, favorites, toggleFav } = useCart();
  const [size, setSize] = useState('');
  const [hint, setHint] = useState(false);
  const fav = favorites.includes(product.id);
  const pct = discountPct(product);
  const available = Object.values(product.sizes).some((n) => n > 0);

  const handleAdd = () => {
    if (!size) {
      setHint(true);
      setTimeout(() => setHint(false), 1800);
      return;
    }
    add(product.id, size, 1);
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden bg-ink-800">
        <Link to={`/product/${product.id}`} aria-label={`Ver ${product.name}`} className="block aspect-[4/5]">
          <ProductImage
            product={product}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
              Nuevo
            </span>
          )}
          {pct > 0 && (
            <span className="bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
              -{pct}%
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleFav(product.id)}
          aria-pressed={fav}
          aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-black/50 text-white backdrop-blur transition hover:bg-black"
        >
          <Heart size={16} className={fav ? 'fill-gold text-gold' : ''} />
        </button>
        <span className="pointer-events-none absolute bottom-2 right-3 text-[9px] uppercase tracking-[0.2em] text-white/40">
          Demo
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug text-white">
          <Link to={`/product/${product.id}`} className="hover:text-gold-soft">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-white">{money(product.price)}</span>
          {pct > 0 && <span className="text-neutral-500 line-through">{money(product.oldPrice)}</span>}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Tallas disponibles">
          {Object.entries(product.sizes).map(([s, stock]) => (
            <button
              key={s}
              type="button"
              disabled={stock <= 0}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={`min-w-[2.25rem] border px-2 py-1 text-[11px] transition ${
                size === s
                  ? 'border-gold bg-gold/10 text-white'
                  : 'border-white/15 text-neutral-400 hover:border-white/50'
              } disabled:cursor-not-allowed disabled:text-neutral-700 disabled:line-through disabled:hover:border-white/15`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          className="btn-solid mt-4 w-full !px-3 !py-3 !text-[11px]"
        >
          {!available ? 'Agotado' : hint ? 'Elige una talla' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
