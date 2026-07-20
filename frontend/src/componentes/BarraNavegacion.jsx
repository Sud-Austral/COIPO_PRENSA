import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart3, Search, Settings, Zap, TrendingUp, Building2, Map, MapPin } from 'lucide-react'
import './BarraNavegacion.css'

export default function BarraNavegacion() {
  const location = useLocation()
  const ruta = location.hash.slice(1) || '/'

  const enlaces = [
    { ruta: '/', etiqueta: 'Inicio', icono: Home },
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: BarChart3 },
    { ruta: '/buscar', etiqueta: 'Buscar', icono: Search },
    { ruta: '/eventos', etiqueta: 'Eventos', icono: Zap },
    { ruta: '/estadisticas', etiqueta: 'Estadísticas', icono: TrendingUp },
    { ruta: '/medios', etiqueta: 'Medios', icono: Building2 },
    { ruta: '/mapa', etiqueta: 'Mapa', icono: Map },
    { ruta: '/regiones', etiqueta: 'Regiones', icono: MapPin },
    { ruta: '/configuracion', etiqueta: 'Configuración', icono: Settings },
  ]

  return (
    <nav className="barra-navegacion">
      <div className="barra-contenido">
        <Link to="/" className="barra-marca">
          <span>COIPO</span>
        </Link>
        <ul className="barra-enlaces">
          {enlaces.map(({ ruta: rutaEnlace, etiqueta, icono: Icono }) => (
            <li key={rutaEnlace}>
              <Link
                to={rutaEnlace}
                className={`barra-enlace ${ruta === rutaEnlace ? 'activo' : ''}`}
                title={etiqueta}
              >
                <Icono size={18} />
                <span>{etiqueta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
