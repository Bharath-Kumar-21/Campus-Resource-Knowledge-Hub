import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://campus-resource-knowledge-hub-3.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: process.env.VITE_BACKEND_URL || 'https://campus-resource-knowledge-hub-3.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
