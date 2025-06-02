import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Agendamento from './components/Agendamento.jsx'
import Admin from './components/Admin.jsx'

// Função para renderizar a aplicação de forma segura
function renderApp() {
  try {
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
  } catch (error) {
    console.error('Erro ao renderizar a aplicação:', error)
    // Fallback para erro de renderização
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: sans-serif;">
          <h1>Erro ao carregar a aplicação</h1>
          <p>Por favor, tente novamente mais tarde ou contate o suporte.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px; cursor: pointer;">
            Tentar novamente
          </button>
        </div>
      `
    }
  }
}

// Renderiza a aplicação
renderApp()

// Inicializa o banco de dados em segundo plano com tratamento de erros
setTimeout(() => {
  try {
    import('./lib/api.js')
      .then(module => {
        if (module && typeof module.initializeDatabase === 'function') {
          module.initializeDatabase().catch(error => {
            console.error('Erro ao inicializar banco de dados:', error)
          })
        } else {
          console.warn('Função initializeDatabase não encontrada ou não é uma função')
        }
      })
      .catch(error => {
        console.error('Erro ao importar api.js:', error)
      })
  } catch (error) {
    console.error('Erro ao carregar módulo api:', error)
  }
}, 1000)