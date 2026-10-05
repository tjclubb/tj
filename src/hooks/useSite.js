import { useSyncExternalStore } from 'react';
import { getSite, subscribe, updateSite, resetSite } from '../data/siteStore';

// Ajustes de la tienda (nombre, redes, envío, textos...). Se actualiza solo cuando se guardan cambios en /admin.
export default function useSite() {
  return useSyncExternalStore(subscribe, getSite);
}

export { updateSite, resetSite };
