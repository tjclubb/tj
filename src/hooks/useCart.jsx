import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { useCatalog } from './useCatalog';

// Carrito y favoritos. El carrito guarda { id, size, qty } y se enlaza con el catálogo.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { products } = useCatalog();
  const [items, setItems] = useLocalStorage('ns_cart_v1', []);
  const [favorites, setFavorites] = useLocalStorage('ns_favs_v1', []);
  const [toast, setToast] = useState(null);

  const clearToast = useCallback(() => setToast(null), []);

  const add = useCallback(
    (id, size, qty = 1) => {
      const product = products.find((p) => p.id === id);
      const stock = product?.sizes?.[size] ?? 0;
      if (!product || stock <= 0) return false;
      setItems((list) => {
        const found = list.find((i) => i.id === id && i.size === size);
        if (found) {
          return list.map((i) => (i === found ? { ...i, qty: Math.min(stock, i.qty + qty) } : i));
        }
        return [...list, { id, size, qty: Math.min(stock, qty) }];
      });
      setToast({ key: Date.now(), text: `${product.name} · talla ${size}` });
      return true;
    },
    [products, setItems]
  );

  const setQty = useCallback(
    (id, size, qty) =>
      setItems((list) =>
        list
          .map((i) => {
            if (i.id !== id || i.size !== size) return i;
            const stock = products.find((p) => p.id === id)?.sizes?.[size] ?? 0;
            return { ...i, qty: Math.max(1, Math.min(stock || 1, qty)) };
          })
      ),
    [products, setItems]
  );

  const remove = useCallback(
    (id, size) => setItems((list) => list.filter((i) => !(i.id === id && i.size === size))),
    [setItems]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  const toggleFav = useCallback(
    (id) => setFavorites((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])),
    [setFavorites]
  );

  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.id === i.id);
          return product ? { ...i, key: `${i.id}|${i.size}`, product, stock: product.sizes?.[i.size] ?? 0 } : null;
        })
        .filter(Boolean),
    [items, products]
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);

  const value = useMemo(
    () => ({ lines, count, subtotal, add, setQty, remove, clear, favorites, toggleFav, toast, clearToast }),
    [lines, count, subtotal, add, setQty, remove, clear, favorites, toggleFav, toast, clearToast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
