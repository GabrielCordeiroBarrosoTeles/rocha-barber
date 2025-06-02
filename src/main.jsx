import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Agendamento from './components/Agendamento.jsx'
import Admin from './components/Admin.jsx'

// Renderiza a aplicação diretamente
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)

// Inicializa o banco de dados em segundo plano
setTimeout(() => {
  try {
    import('./lib/api.js')
      .then(module => {
        if (module && typeof module.initializeDatabase === 'function') {
          module.initializeDatabase().catch(error => {
            console.error('Erro ao inicializar banco de dados:', error)
          })
        }
      })
      .catch(error => {
        console.error('Erro ao importar api.js:', error)
      })
  } catch (error) {
    console.error('Erro ao carregar módulo api:', error)
  }
}, 1000)