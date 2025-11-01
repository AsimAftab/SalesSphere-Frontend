
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['salessphere360.com', 'www.salessphere360.com'],
  },
  define: {
    'process.env': process.env, // allows .env usage
  },
  build: {
    outDir: 'dist',
  },
})


