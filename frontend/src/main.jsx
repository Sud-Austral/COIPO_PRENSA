import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos.css'
import App from './App.jsx'

// Aplicar tema antes de renderizar para evitar flash
const tema = localStorage.getItem('tema') ||
  (window.matchMedia('(prefers-color-scheme: oscuro)').matches ? 'oscuro' : 'claro')
if (tema === 'oscuro') {
  document.documentElement.setAttribute('data-theme', 'oscuro')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
