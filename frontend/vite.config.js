import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://portfoliobuilder-tovo.onrender.com'
          : 'http://localhost:5000',
        changeOrigin: true,
      }
    },
    allowedHosts: ['6b80438f2c7b.ngrok-free.app'],
  },
})
