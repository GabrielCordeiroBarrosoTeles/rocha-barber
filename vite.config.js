import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Gera source maps para melhor depuração
    sourcemap: true,
    // Otimiza o tamanho do bundle
    minify: 'terser',
    // Configurações do Terser para melhor otimização
    terserOptions: {
      compress: {
        drop_console: false, // Mantém console.logs para depuração
        drop_debugger: true
      }
    }
  },
  // Configuração para garantir que os assets sejam carregados corretamente
  base: '/',
  // Configuração para lidar com erros de importação
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})