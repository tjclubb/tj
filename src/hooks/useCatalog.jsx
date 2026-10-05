import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import { SEED_PRODUCTS } from '../data/products';
import { SEED_BRANDS } from '../data/brands';
import { slugify } from '../utils/slug';

// Catálogo, marcas y pedidos. Hoy se guardan en el navegador (localStorage).
// Para una tienda real, reemplaza estas funciones por llamadas a tu backend.
const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useLocalStorage('ns_products_v1', SEED_PRODUCTS);
  const [brands, setBrands] = useLocalStorage('ns_brands_v1', SEED_BRANDS);
  const [orders, setOrders] = useLocalStorage('ns_orders_v1', []);

  const saveProduct = useCallback(
    (product) =>
      setProducts((list) =>
        list.some((p) => p.id === product.id)
          ? list.map((p) => (p.id === product.id ? product : p))
          : [product, ...list]
      ),
    [setProducts]
  );

  const deleteProduct = useCallback(
    (id) => setProducts((list) => list.filter((p) => p.id !== id)),
    [setProducts]
  );

  const addBrand = useCallback(
    (name) => {
      const clean = name.trim();
      if (!clean || brands.some((b) => slugify(b.name) === slugify(clean))) return false;
      setBrands((list) => [...list, { name: clean }]);
      return true;
    },
    [brands, setBrands]
  );

  const toggleFeatured = useCallback(
    (name) => setBrands((list) => list.map((b) => (b.name === name ? { ...b, featured: !b.featured || undefined } : b))),
    [setBrands]
  );

  const renameBrand = useCallback(
    (oldName, newName) => {
      const clean = newName.trim();
      if (!clean) return false;
      if (brands.some((b) => b.name !== oldName && slugify(b.name) === slugify(clean))) return false;
      setBrands((list) => list.map((b) => (b.name === oldName ? { ...b, name: clean } : b)));
      setProducts((list) => list.map((p) => (p.brand === oldName ? { ...p, brand: clean } : p)));
      return true;
    },
    [brands, setBrands, setProducts]
  );

  const removeBrand = useCallback((name) => setBrands((list) => list.filter((b) => b.name !== name)), [setBrands]);

  const setBrandImage = useCallback(
    (name, image) =>
      setBrands((list) => list.map((b) => (b.name === name ? { ...b, image: image || undefined } : b))),
    [setBrands]
  );

  const addOrder = useCallback((order) => setOrders((list) => [order, ...list]), [setOrders]);

  const updateOrder = useCallback(
    (id, patch) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    [setOrders]
  );

  const resetDemo = useCallback(() => {
    setProducts(SEED_PRODUCTS);
    setBrands(SEED_BRANDS);
    setOrders([]);
  }, [setProducts, setBrands, setOrders]);

  const value = useMemo(
    () => ({ products, brands, orders, saveProduct, deleteProduct, addBrand, setBrandImage, toggleFeatured, renameBrand, removeBrand, addOrder, updateOrder, resetDemo }),
    [products, brands, orders, saveProduct, deleteProduct, addBrand, setBrandImage, toggleFeatured, renameBrand, removeBrand, addOrder, updateOrder, resetDemo]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return ctx;
};
