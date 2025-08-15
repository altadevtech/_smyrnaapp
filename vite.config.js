import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Configuração sem esbuild para evitar problemas no Render.com
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Usar terser em vez de esbuild
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Completamente desabilitar esbuild
  esbuild: false
})
