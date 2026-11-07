import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración básica de Vite para React.
// Puedes extender esta configuración si lo necesitas durante el examen.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
