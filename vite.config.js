import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows external access (e.g., from your domain)
    allowedHosts: ['salessphere360.com', 'www.salessphere360.com'],
    port: 5173, // your current dev port
  },
  build: {
    outDir: 'dist', // folder where the build output goes
  },
})
