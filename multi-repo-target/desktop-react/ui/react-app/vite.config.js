import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Réutilise les mêmes CSS/JS que le dashboard MVT (pas de styles inventés)
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/login': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/logout': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/contact': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
    },
  },
});
