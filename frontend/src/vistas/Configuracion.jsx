import { useState, useEffect } from 'react'

export default function Configuracion() {
  const [tema, setTema] = useState('claro')

  useEffect(() => {
    // El atributo del <html> es la verdad (main.jsx ya resolvió localStorage + sistema)
    setTema(document.documentElement.getAttribute('data-theme') || 'claro')
  }, [])

  const cambiarTema = (nuevoTema) => {
    setTema(nuevoTema)
    localStorage.setItem('tema', nuevoTema)
    // 'claro' debe quedar explícito: es el opt-out de la media query oscura del sistema
    document.documentElement.setAttribute('data-theme', nuevoTema)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1080px', margin: '0 auto' }}>
      <h1>Configuración</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>Tema</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => cambiarTema('claro')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: tema === 'claro' ? '2px solid var(--verde)' : '1px solid var(--linea)',
              background: tema === 'claro' ? 'var(--verde-muy-claro)' : 'var(--tarjeta)',
              cursor: 'pointer',
            }}
          >
            Claro
          </button>
          <button
            onClick={() => cambiarTema('oscuro')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: tema === 'oscuro' ? '2px solid var(--verde)' : '1px solid var(--linea)',
              background: tema === 'oscuro' ? 'var(--verde-muy-claro)' : 'var(--tarjeta)',
              cursor: 'pointer',
            }}
          >
            Oscuro
          </button>
        </div>
      </section>
    </div>
  )
}
