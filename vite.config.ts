import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    allowedHosts: ["staging.salessphere360.com","salessphere360.com", "www.salessphere360.com"],
  },

  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["@react-pdf/renderer"],
          excel: ["exceljs"],
          html2canvas: ["html2canvas"],
        },
      },
    },
  },
});
