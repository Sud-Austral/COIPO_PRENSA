import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos.css'
import App from './App.jsx'

// Aplicar tema antes de renderizar para evitar flash. Siempre se fija el
// atributo con el valor resuelto: 'claro' es el opt-out explícito que anula
// la media query de modo oscuro del sistema (ver estilos.css).
const tema = localStorage.getItem('tema') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro')
document.documentElement.setAttribute('data-theme', tema)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
