import { useEffect, useRef, useState } from 'react';

// Aparece al entrar en pantalla. variant: 'up' (por defecto), 'fade' o 'scale'.
// Si el navegador no soporta IntersectionObserver, se muestra directo.
export default function Reveal({ children, className = '', delay = 0, variant = 'up', as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-v={variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
