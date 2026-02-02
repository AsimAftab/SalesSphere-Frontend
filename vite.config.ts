import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    allowedHosts: ["staging.salessphere360.com","salessphere360.com", "www.salessphere360.com"],
  },

  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 500,
    sourcemap: true,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["@react-pdf/renderer"],
          excel: ["exceljs"],
          html2canvas: ["html2canvas"],
          recharts: ["recharts"],
          "framer-motion": ["framer-motion"],
          mui: ["@mui/material"],
        },
      },
    },
  },
});
