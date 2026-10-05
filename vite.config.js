import { defineConfig } from 'vite';

// Vite compila JSX con esbuild, sin plugins adicionales.
// Opcional: instala `@vitejs/plugin-react` si quieres Fast Refresh en desarrollo.
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
