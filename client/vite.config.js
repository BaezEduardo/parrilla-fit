import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Edita SOLO esta URL si tu backend cambia de dominio:
const API_TARGET = "https://api.parrillafit.castelancarpinteyro.com";

export default defineConfig({
  plugins: [react()],
  server: {
    // El dev server de Vite escucha (por defecto) en http://localhost:5173
    proxy: {
      // Cualquier llamada a /api en desarrollo se envía a tu backend
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false, // permite HTTPS con cert no perfecto durante pruebas
        // opcional: reescritura si alguna vez tu API no tiene prefijo /api
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
