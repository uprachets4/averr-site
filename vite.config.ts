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
  build: {
    rollupOptions: {
      output: {
        /**
         * Rollup's automatic split is a function of the module graph, so
         * restructuring home moved React INTO the entry chunk and pulled
         * a separate `motion` chunk out — home's entry grew 14 kB for no
         * change to home's own code. The two libraries every route needs
         * are named here so the split stops moving when a page is
         * rearranged.
         */
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion'
          return undefined
        },
      },
    },
  },
})
