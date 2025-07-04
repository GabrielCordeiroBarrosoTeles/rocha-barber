import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Importação do Supabase para garantir inicialização antes de qualquer componente
import './lib/supabase-direct'
import App from './App.jsx'
import Admin from './components/Admin.jsx'
import Agendamento from './components/Agendamento.jsx'
import NotFound from './components/NotFound.jsx'
import './index.css'

// Função para lidar com erros de renderização
const handleRenderError = (error) => {
  console.error('Erro na renderização:', error);
  // Você pode adicionar aqui um fallback UI se desejar
};

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/agendamento" element={<Agendamento />} />
          {/* Rota de fallback para capturar qualquer caminho não definido */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (error) {
  handleRenderError(error);
}