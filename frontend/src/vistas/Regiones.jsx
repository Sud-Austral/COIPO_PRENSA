import { useMemo } from 'react'
import { useDatos } from '../contexto/ProveedorDatos.jsx'
import { etiquetaRegion, etiquetaCategoria } from '../utilidades/etiquetas.js'

export default function Regiones() {
  const { noticias, cargando, error } = useDatos()

  const regiones = useMemo(() => {
    if (!noticias?.length) return []
    const grupos = {}
    noticias.forEach(n => {
      if (n.analisis?.regiones) {
        n.analisis.regiones.forEach(region => {
          if (!grupos[region]) {
            grupos[region] = {
              region,
              noticias: [],
              categorias: {},
            }
          }
          grupos[region].noticias.push(n)
          if (n.analisis.categorias) {
            n.analisis.categorias.forEach(cat => {
              grupos[region].categorias[cat] = (grupos[region].categorias[cat] || 0) + 1
            })
          }
        })
      }
    })
    return Object.values(grupos)
      .sort((a, b) => b.noticias.length - a.noticias.length)
  }, [noticias])

  if (cargando) return <div className="estado">Cargando…</div>
  if (error) return <div className="estado estado-error">No se pudieron cargar las noticias: {error}</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Regiones ({regiones.length})</h1>

      {regiones.length === 0 && (
        <p style={{ color: 'var(--gris-tenue)', marginTop: '2rem' }}>
          Aún no hay noticias con región identificada. Las regiones se poblarán a
          medida que el análisis geográfico procese las noticias.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {regiones.map(region => {
          const topCats = Object.entries(region.categorias)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
          return (
            <div
              key={region.region}
              style={{
                background: 'var(--tarjeta)',
                border: '1px solid var(--linea)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
                {etiquetaRegion(region.region)}
              </h3>

              <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <div style={{ color: 'var(--gris-tenue)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Noticias</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{region.noticias.length}</div>
              </div>

              {topCats.length > 0 && (
                <div>
                  <div style={{ color: 'var(--gris-tenue)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Categorías frecuentes</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {topCats.map(([cat, count]) => (
                      <li
                        key={cat}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.35rem 0',
                          borderBottom: '1px solid var(--linea)',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{etiquetaCategoria(cat)}</span>
                        <strong>{count}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
