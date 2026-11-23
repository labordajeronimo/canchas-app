import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En local, /api se redirige al backend (igual que el rewrite de Render en producción)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: false },
    },
  },
});
