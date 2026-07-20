import { useDatos } from '../contexto/ProveedorDatos.jsx'
import Cabecera from '../componentes/Cabecera.jsx'
import Seccion from '../componentes/Seccion.jsx'

export default function Portada() {
  const { noticias, secciones, generadoEn, cargando, error } = useDatos()

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

  return (
    <div className="app">
      <Cabecera generadoEn={generadoEn} noticias={noticias} secciones={secciones} />
      <main className="contenido">
        {noticias.length === 0 ? (
          <p className="estado">Aún no hay noticias con menciones en la ventana actual.</p>
        ) : (
          seccionesOrdenadas.map((seccion) => (
            <Seccion
              key={seccion.id}
              seccion={seccion}
              noticias={noticias.filter((noticia) => noticia.seccionId === seccion.id)}
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
