import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // IMPORTANT for Vercel
  base: '/',

  // Dev-only proxy (safe)
  server: mode === 'development' ? {
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  } : undefined
}))