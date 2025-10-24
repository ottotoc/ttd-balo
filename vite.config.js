import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static HTML site: keep current structure and serve from project root
export default defineConfig({
  root: '.',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  }
})

