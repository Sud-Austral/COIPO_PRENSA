import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useDatos } from '../contexto/ProveedorDatos.jsx'
import { etiquetaRegion } from '../utilidades/etiquetas.js'

// Coordenadas aproximadas por región de Chile
const REGIONES_COORDS = {
  'arica-parinacota': [-18.48, -70.3],
  'tarapaca': [-20.27, -70.15],
  'antofagasta': [-23.63, -70.4],
  'atacama': [-27.37, -70.33],
  'coquimbo': [-29.9, -71.25],
  'valparaiso': [-33.05, -71.55],
  'metropolitana': [-33.45, -70.67],
  'ohiggins': [-34.17, -70.75],
  'maule': [-35.42, -71.65],
  'nuble': [-36.6, -72.1],
  'biobio': [-36.82, -73.05],
  'araucania': [-38.74, -72.59],
  'los-rios': [-39.81, -73.24],
  'los-lagos': [-41.31, -72.77],
  'aysen': [-45.59, -72.07],
  'magallanes': [-53.16, -70.92],
}

const icono = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMGE3LjcxIDcuNzEgMCAwIDAgLTcuNzEgNy43MUMzLjMgMTIuOSAxMiAyNSAxMiAyNXMxMC4wNi0xMS4yNiAxMS41Ny0xMi43MUMxOS43IDcuNyAxNi4xIDAgMTIgMHptMCAuODJhNi44OSA2LjkgMCAxIDEgMCAxMy43OCA2Ljg5IDYuOSAwIDAgMSAwIC0xMy43OHoiIGZpbGw9IiMwNTgzM2YiIi8+PC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

export default function Mapa() {
  const { noticias, cargando, error } = useDatos()

  const marcadores = useMemo(() => {
    if (!noticias?.length) return []
    const grouped = {}
    noticias.forEach(n => {
      if (n.analisis?.regiones?.length) {
        n.analisis.regiones.forEach(region => {
          if (!grouped[region]) {
            grouped[region] = {
              region,
              noticias: [],
            }
          }
          grouped[region].noticias.push(n)
        })
      }
    })
    return Object.values(grouped).map(g => ({
      ...g,
      coords: REGIONES_COORDS[g.region] || [-33.45, -70.67],
    }))
  }, [noticias])

  if (cargando) return <div className="estado">Cargando…</div>
  if (error) return <div className="estado estado-error">No se pudieron cargar las noticias: {error}</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Mapa de noticias</h1>

      {marcadores.length === 0 && (
        <p style={{ color: 'var(--gris-tenue)', marginTop: '1rem' }}>
          Aún no hay noticias con región detectada. El mapa se poblará a medida que el
          análisis geográfico procese la ventana de noticias.
        </p>
      )}

      <div style={{ marginTop: '2rem', height: '500px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--linea)' }}>
        <MapContainer center={[-33.45, -70.67]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marcadores.map(m => (
            <Marker key={m.region} position={m.coords} icon={icono}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong>{etiquetaRegion(m.region)}</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                    {m.noticias.length} noticia{m.noticias.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Por región</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {marcadores
            .sort((a, b) => b.noticias.length - a.noticias.length)
            .map(m => (
              <div
                key={m.region}
                style={{
                  background: 'var(--tarjeta)',
                  border: '1px solid var(--linea)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {etiquetaRegion(m.region)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gris-tenue)' }}>
                  {m.noticias.length} noticia{m.noticias.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
