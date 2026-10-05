import GarmentArt, { artTypeFor } from './GarmentArt';

// Muestra la foto subida del producto o, si no hay, la ilustración de ejemplo.
export default function ProductImage({ product, variant = 0, className = '' }) {
  const images = product.images || [];
  if (images.length > 0) {
    return (
      <img
        src={images[variant % images.length]}
        alt={product.name}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <GarmentArt
      type={artTypeFor(product)}
      color={product.color}
      variant={variant}
      label={product.name}
      className={className}
    />
  );
}
