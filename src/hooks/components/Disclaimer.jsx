import useSite from '../hooks/useSite';

// Aviso de tienda independiente. Se muestra en varias partes del sitio.
export default function Disclaimer({ className = '' }) {
  const site = useSite();
  return (
    <p className={`text-xs leading-relaxed text-neutral-500 ${className}`}>
      {site.name} es una tienda independiente que comercializa productos de distintas marcas. No somos la tienda
      oficial de ninguna marca ni estamos afiliados a ellas. Los nombres de marca pertenecen a sus propietarios y se
      usan solo para identificar los productos.
    </p>
  );
}
