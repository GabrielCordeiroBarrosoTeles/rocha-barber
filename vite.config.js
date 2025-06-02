import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Gera source maps para melhor depuração
    sourcemap: true,
    // Otimiza o tamanho do bundle usando o minificador padrão (esbuild)
    minify: 'esbuild'
  },
  // Configuração para garantir que os assets sejam carregados corretamente
  base: '/',
  // Configuração para lidar com erros de importação
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})