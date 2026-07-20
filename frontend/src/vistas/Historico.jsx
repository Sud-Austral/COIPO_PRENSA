import { useMemo } from 'react'
import { obtenerHistoricoLocal } from '../servicios/historico-local.js'
import { formatoFechaCorta } from '../utilidades/fechas.js'
import { etiquetaCategoria } from '../utilidades/etiquetas.js'

const COLORES_SENTIMIENTO = {
  positiva: 'var(--sent-positiva)',
  neutra: 'var(--sent-neutra)',
  negativa: 'var(--sent-negativa)',
  mixta: 'var(--sent-mixta)',
}

const COLORES_IMPORTANCIA = {
  bajo: '#5B6B66',
  medio: '#C08A2D',
  alto: '#B3402A',
}

export default function Historico() {
  const noticias = useMemo(() => obtenerHistoricoLocal(), [])

  if (!noticias.length) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Histórico de noticias</h1>
        <p style={{ color: 'var(--gris-tenue)', textAlign: 'center', marginTop: '2rem' }}>
          Aún no hay noticias en el histórico
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Histórico de noticias</h1>
      <p style={{ color: 'var(--gris-tenue)', marginBottom: '2rem' }}>
        {noticias.length} noticias guardadas localmente
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      }}>
        {noticias.map(noticia => (
          <article key={noticia.id} title={noticia.sentimiento ? `Cobertura ${noticia.sentimiento}` : 'Sin análisis'} style={{
            border: '1px solid var(--linea)',
            borderLeft: `4px solid ${COLORES_SENTIMIENTO[noticia.sentimiento] || COLORES_SENTIMIENTO.neutra}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            background: 'var(--tarjeta)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--gris)', textTransform: 'uppercase' }}>
                {noticia.medioNombre}
              </span>
            </div>

            <a
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--verde-institucional)',
                textDecoration: 'none',
                marginBottom: '0.5rem',
                lineHeight: '1.4',
              }}
              title={noticia.titular}
            >
              {noticia.titular.length > 100 ? noticia.titular.slice(0, 100) + '…' : noticia.titular}
            </a>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--gris-tenue)' }}>
              <span>{formatoFechaCorta(noticia.fecha)}</span>
              {Number.isFinite(noticia.importancia) && (
                <span style={{
                  background: COLORES_IMPORTANCIA[
                    noticia.importancia > 70 ? 'alto' : noticia.importancia > 40 ? 'medio' : 'bajo'
                  ],
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                }}>
                  Importancia: {Math.round(noticia.importancia)}%
                </span>
              )}
            </div>

            {noticia.categorias?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {noticia.categorias.slice(0, 2).map(cat => (
                  <span key={cat} style={{
                    fontSize: '0.65rem',
                    background: 'var(--linea)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '0.2rem',
                  }}>
                    {etiquetaCategoria(cat)}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
