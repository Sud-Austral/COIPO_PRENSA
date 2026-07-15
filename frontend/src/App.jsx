import { useEffect, useState } from 'react'
import BotonCSV from './componentes/BotonCSV.jsx'
import Cabecera from './componentes/Cabecera.jsx'
import Seccion from './componentes/Seccion.jsx'
import { cargarNoticias } from './datos.js'

export default function App() {
  const [estado, setEstado] = useState({ fase: 'cargando' })

  useEffect(() => {
    let activo = true
    cargarNoticias()
      .then((datos) => {
        if (activo) setEstado({ fase: 'ok', datos })
      })
      .catch((error) => {
        if (activo) setEstado({ fase: 'error', mensaje: error.message })
      })
    return () => {
      activo = false
    }
  }, [])

  if (estado.fase === 'cargando') {
    return <p className="estado">Cargando noticias…</p>
  }
  if (estado.fase === 'error') {
    return (
      <p className="estado estado-error">
        No se pudieron cargar las noticias: {estado.mensaje}. Intente recargar la página.
      </p>
    )
  }

  const { datos } = estado
  const seccionesOrdenadas = [...datos.secciones].sort((a, b) => a.orden - b.orden)

  return (
    <main className="boletin">
      <Cabecera generadoEn={datos.generadoEn} />
      <div className="acciones">
        <BotonCSV noticias={datos.noticias} secciones={datos.secciones} />
      </div>
      {datos.noticias.length === 0 ? (
        <p className="estado">Aún no hay noticias con menciones en la ventana actual.</p>
      ) : (
        seccionesOrdenadas.map((seccion) => (
          <Seccion
            key={seccion.id}
            seccion={seccion}
            noticias={datos.noticias.filter((noticia) => noticia.seccionId === seccion.id)}
          />
        ))
      )}
      <footer className="pie">
        Monitor de prensa de la Corporación Nacional Forestal · Unidad de Información y
        Análisis. Cada titular enlaza a la noticia original en el sitio del medio.
      </footer>
    </main>
  )
}
