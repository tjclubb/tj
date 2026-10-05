import { useMemo } from 'react';
import { useCatalog } from '../hooks/useCatalog';
import ProductImage from './ProductImage';
import { brandAsset } from '../utils/brandImages';

// Foto de la marca. Orden de prioridad:
// 1) foto subida desde /admin  2) archivo en src/assets/brands/  3) imagen de una prenda de la marca  4) inicial.
// Es decorativa (el nombre de la marca siempre aparece como texto al lado), por eso no lleva alt propio.
export default function BrandImage({ brand, className = '' }) {
  const { products } = useCatalog();
  const own = brand.image || brandAsset(brand.name);

  const sample = useMemo(() => {
    const list = products.filter((p) => p.brand === brand.name);
    return list.find((p) => p.images?.length) || list[0] || null;
  }, [products, brand.name]);

  if (own) {
    return <img src={own} alt="" loading="lazy" className={`object-cover ${className}`} />;
  }
  if (sample) {
    return <ProductImage product={sample} className={className} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`grid place-items-center bg-gradient-to-br from-ink-600 to-ink-900 font-display text-3xl font-extrabold text-gold/70 ${className}`}
    >
      {brand.name.charAt(0)}
    </div>
  );
}
