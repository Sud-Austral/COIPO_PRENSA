import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDatos } from '../contexto/ProveedorDatos.jsx'
import ChipSentimiento from '../componentes/ChipSentimiento.jsx'

export default function Eventos() {
  const { noticias } = useDatos()

  const eventos = useMemo(() => {
    if (!noticias?.length) return []
    const grupos = {}
    noticias.forEach(n => {
      if (n.eventId) {
        if (!grupos[n.eventId]) {
          grupos[n.eventId] = {
            eventId: n.eventId,
            titulo: n.titular,
            noticias: [],
            medios: new Set(),
            sentimientos: {},
            importancia: 0,
            fecha: n.fecha,
          }
        }
        grupos[n.eventId].noticias.push(n)
        grupos[n.eventId].medios.add(n.medioId)
        if (n.analisis?.sentimiento) {
          grupos[n.eventId].sentimientos[n.analisis.sentimiento] = (grupos[n.eventId].sentimientos[n.analisis.sentimiento] || 0) + 1
        }
        grupos[n.eventId].importancia = Math.max(grupos[n.eventId].importancia, n.analisis?.importancia || 0)
        if (n.fecha < grupos[n.eventId].fecha) grupos[n.eventId].fecha = n.fecha
      }
    })
    return Object.values(grupos).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }, [noticias])

  const sentimentoPromedio = (sentimientos) => {
    const total = Object.values(sentimientos).reduce((a, b) => a + b, 0) || 1
    if (sentimientos.positiva && sentimientos.positiva / total > 0.5) return 'positiva'
    if (sentimientos.negativa && sentimientos.negativa / total > 0.5) return 'negativa'
    return 'neutra'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Eventos detectados ({eventos.length})</h1>

      {eventos.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gris-tenue)' }}>
          No hay eventos agrupados
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {eventos.map(evento => (
            <div
              key={evento.eventId}
              style={{
                background: 'var(--tarjeta)',
                border: '1px solid var(--linea)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>{evento.titulo}</h3>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <ChipSentimiento sentimiento={sentimentoPromedio(evento.sentimientos)} />
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--verde-muy-claro)', color: 'var(--verde)', borderRadius: '1rem' }}>
                  Importancia: {evento.importancia}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--gris-tenue)', marginBottom: '1rem' }}>
                <div><strong>{evento.noticias.length}</strong> noticias</div>
                <div><strong>{evento.medios.size}</strong> medios</div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--gris-tenue)', marginBottom: '1rem' }}>
                {new Date(evento.fecha).toLocaleDateString('es-CL')}
              </div>

              <Link
                to={`/evento/${evento.eventId}`}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'var(--verde)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Ver detalles →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
