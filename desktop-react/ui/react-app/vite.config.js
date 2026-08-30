import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DJANGO_PORT = process.env.DJANGO_PORT || 8000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${DJANGO_PORT}`,
        changeOrigin: true,
        secure: false,
      },
      '/login': { target: `http://127.0.0.1:${DJANGO_PORT}`, changeOrigin: true, secure: false },
      '/logout': { target: `http://127.0.0.1:${DJANGO_PORT}`, changeOrigin: true, secure: false },
      '/contact': { target: `http://127.0.0.1:${DJANGO_PORT}`, changeOrigin: true, secure: false },
    },
  },
});
