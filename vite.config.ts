import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";
import path from "path";

export default defineConfig(({ mode }): UserConfig => ({
  plugins: [
    react(),
    // Gzip compression for production
    compression({
      include: /\.(js|mjs|json|css|html|svg)$/,
      threshold: 1024, // Only compress files > 1KB
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    allowedHosts: ["staging.salessphere360.com", "salessphere360.com", "www.salessphere360.com"],
  },

  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 500,
    // Disable sourcemaps in production for smaller bundles
    sourcemap: mode !== "production",

    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          react: ["react", "react-dom"],
          // Routing
          router: ["react-router-dom"],
          // State management
          query: ["@tanstack/react-query"],
          // UI Libraries
          mui: ["@mui/material", "@emotion/react", "@emotion/styled"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-slider",
            "@radix-ui/react-separator",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-avatar",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-slot",
          ],
          // Keep animation/charts/socket chunks automatic so Vite can defer them
          // to route-level async boundaries instead of eagerly preloading them.
          // pdf, excel, jspdf are NOT listed here — they are dynamically imported
          // and will be automatically code-split by Vite into async chunks
        },
      },
    },
  },
}));
