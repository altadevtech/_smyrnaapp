import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Configuração SEM esbuild para Render.com
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser', // Forçar terser
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
  // Remover completamente esbuild
  esbuild: false,
  define: {
    // Garantir que não há referências ao esbuild
    global: 'globalThis'
  }
})
