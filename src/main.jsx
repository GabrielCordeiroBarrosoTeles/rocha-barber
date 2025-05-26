import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Agendamento from './components/Agendamento.jsx'
import Admin from './components/Admin.jsx'
import { initializeDatabase } from './lib/api.js'

// Inicializa o banco de dados
initializeDatabase().catch(error => {
  console.error('Erro ao inicializar banco de dados:', error);
});

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