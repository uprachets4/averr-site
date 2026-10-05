import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import routePreload from './tools/route-preload.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), routePreload()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
})
