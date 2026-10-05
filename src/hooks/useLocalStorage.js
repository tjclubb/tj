import { useEffect, useState } from 'react';

const resolve = (initial) => (typeof initial === 'function' ? initial() : initial);

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : resolve(initial);
    } catch {
      return resolve(initial);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento lleno o bloqueado: la tienda sigue funcionando sin guardar */
    }
  }, [key, value]);

  return [value, setValue];
}
