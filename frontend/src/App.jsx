import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import BarraNavegacion from './componentes/BarraNavegacion.jsx'
import { ProveedorDatos } from './contexto/ProveedorDatos.jsx'
import Portada from './vistas/Portada.jsx'

// Fase 1
const Dashboard = lazy(() => import('./vistas/Dashboard.jsx'))
const Buscar = lazy(() => import('./vistas/Buscar.jsx'))
const Configuracion = lazy(() => import('./vistas/Configuracion.jsx'))

// Fase 2
const Eventos = lazy(() => import('./vistas/Eventos.jsx'))
const Estadisticas = lazy(() => import('./vistas/Estadisticas.jsx'))
const Medios = lazy(() => import('./vistas/Medios.jsx'))

// Fase 3
const Mapa = lazy(() => import('./vistas/Mapa.jsx'))
const Regiones = lazy(() => import('./vistas/Regiones.jsx'))

function EstadoCarga() {
  return <div className="estado">Cargando…</div>
}

function App() {
  return (
    <ProveedorDatos>
      <HashRouter basename={import.meta.env.BASE_URL}>
        <BarraNavegacion />
        <Suspense fallback={<EstadoCarga />}>
          <Routes>
            <Route path="/" element={<Portada />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/medios" element={<Medios />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/regiones" element={<Regiones />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ProveedorDatos>
  )
}

export default App
