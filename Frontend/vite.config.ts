import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// El frontend (puerto 5173) reenvía las llamadas /api al backend de C# (puerto 5134).
// Así el navegador no bloquea las peticiones (CORS) y no hace falta tocar el backend.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5134',
    },
  },
})
