import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';

// Aviso breve cuando se agrega algo al carrito.
export default function Toast() {
  const { toast, clearToast } = useCart();

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;
  return (
    <div
      key={toast.key}
      role="status"
      className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] animate-slide-in items-start gap-3 border border-gold/40 bg-ink-900 px-5 py-4 text-sm shadow-2xl"
    >
      <Check size={16} className="mt-0.5 shrink-0 text-gold" />
      <div>
        <p className="font-semibold text-white">Agregado al carrito</p>
        <p className="text-neutral-400">{toast.text}</p>
        <Link to="/cart" onClick={clearToast} className="mt-2 inline-block text-xs uppercase tracking-[0.2em] text-gold hover:underline">
          Ver carrito
        </Link>
      </div>
    </div>
  );
}
