import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Agendamento from './components/Agendamento.jsx'
import Admin from './components/Admin.jsx'

// Renderiza a aplicação primeiro
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

// Inicializa o banco de dados em segundo plano
setTimeout(() => {
  import('./lib/api.js').then(({ initializeDatabase }) => {
    initializeDatabase().catch(error => {
      console.error('Erro ao inicializar banco de dados:', error);
    });
  });
}, 1000);