import { useMemo, useState } from 'react'
import { useDatos } from '../contexto/ProveedorDatos.jsx'
import Cabecera from '../componentes/Cabecera.jsx'
import Seccion from '../componentes/Seccion.jsx'
import { esHoy, esHoyOAyer } from '../utilidades/fechas.js'

const MENSAJES_VACIO = {
  todas: 'Aún no hay noticias con menciones en la ventana actual.',
  hoy: 'Todavía no entran noticias hoy. Pruebe con «Hoy y ayer» o «Todas».',
  'hoy-ayer': 'No hay noticias de hoy ni de ayer. Pruebe con «Todas».',
}

function normalizarTitular(titular) {
  return String(titular ?? '')
    .replace(/\[.*?\]/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ]/g, '')
}

// La misma historia suele llegar por dos vías (dos medios del mismo grupo, o el
// feed curado + Google News). Mostrar titulares idénticos lado a lado es uno de
// los errores declarados inaceptables por SECOM: se colapsa al más reciente.
function quitarTitularesDuplicados(lista) {
  const elegidoPorTitular = new Map()
  for (const noticia of lista) {
    const clave = normalizarTitular(noticia.titular)
    if (!clave) continue
    const previo = elegidoPorTitular.get(clave)
    if (!previo || new Date(noticia.fecha) > new Date(previo.fecha)) {
      elegidoPorTitular.set(clave, noticia)
    }
  }
  const elegidos = new Set(elegidoPorTitular.values())
  return lista.filter((noticia) => !normalizarTitular(noticia.titular) || elegidos.has(noticia))
}

export default function Portada() {
  const { noticias, secciones, generadoEn, cargando, error } = useDatos()
  const [periodo, setPeriodo] = useState('todas')

  const conteos = useMemo(() => {
    if (!noticias) return { todas: 0, hoy: 0, 'hoy-ayer': 0 }
    return {
      todas: noticias.length,
      hoy: noticias.filter((n) => esHoy(n.fecha)).length,
      'hoy-ayer': noticias.filter((n) => esHoyOAyer(n.fecha)).length,
    }
  }, [noticias])

  const noticiasFiltradas = useMemo(() => {
    if (!noticias) return []
    const sinDuplicados = quitarTitularesDuplicados(noticias)
    if (periodo === 'hoy') return sinDuplicados.filter((n) => esHoy(n.fecha))
    if (periodo === 'hoy-ayer') return sinDuplicados.filter((n) => esHoyOAyer(n.fecha))
    return sinDuplicados
  }, [noticias, periodo])

  if (cargando) {
    return <p className="estado">Cargando noticias…</p>
  }
  if (error) {
    return (
      <p className="estado estado-error">
        No se pudieron cargar las noticias: {error}. Intente recargar la página.
      </p>
    )
  }

  const seccionesOrdenadas = [...secciones].sort((a, b) => a.orden - b.orden)

  const opciones = [
    { id: 'todas', etiqueta: 'Todas' },
    { id: 'hoy', etiqueta: 'Hoy' },
    { id: 'hoy-ayer', etiqueta: 'Hoy y ayer' },
  ]

  return (
    <div className="app">
      <Cabecera generadoEn={generadoEn} noticias={noticiasFiltradas} secciones={secciones} />
      <main className="contenido">
        <div className="barra-filtros">
          <div className="filtro-periodo" role="group" aria-label="Filtrar por fecha">
            {opciones.map((opcion) => (
              <button
                key={opcion.id}
                type="button"
                className={`filtro-periodo-boton ${periodo === opcion.id ? 'activo' : ''}`}
                aria-pressed={periodo === opcion.id}
                onClick={() => setPeriodo(opcion.id)}
              >
                {opcion.etiqueta}
                <span className="filtro-periodo-conteo">{conteos[opcion.id]}</span>
              </button>
            ))}
          </div>
          <div className="leyenda-sentimiento" title="El borde izquierdo de cada tarjeta indica el tono de la cobertura">
            <span className="leyenda-item"><span className="leyenda-punto positiva" />Positiva</span>
            <span className="leyenda-item"><span className="leyenda-punto neutra" />Neutra</span>
            <span className="leyenda-item"><span className="leyenda-punto negativa" />Negativa</span>
            <span className="leyenda-item"><span className="leyenda-punto mixta" />Mixta</span>
          </div>
        </div>
        {noticiasFiltradas.length === 0 ? (
          <p className="estado">{MENSAJES_VACIO[periodo]}</p>
        ) : (
          seccionesOrdenadas.map((seccion) => (
            <Seccion
              key={seccion.id}
              seccion={seccion}
              noticias={noticiasFiltradas.filter((noticia) => noticia.seccionId === seccion.id)}
            />
          ))
        )}
      </main>
      <footer className="pie">
        <span className="pie-marca">CONAF</span>
        Monitor de prensa de la Corporación Nacional Forestal · Unidad de Información y
        Análisis. Cada titular enlaza a la noticia original en el sitio del medio.
      </footer>
    </div>
  )
}
