// Carga del JSON estático generado por el collector.

// BASE_URL resuelve dev (/) y producción (/COIPO_PRENSA/). El cache-buster
// evita que el CDN de GitHub Pages (max-age ~600 s) o una pestaña abierta
// sirvan datos viejos a la hora de revisión de las 8:00.
export async function cargarNoticias() {
  const url = `${import.meta.env.BASE_URL}data/noticias.json?t=${Date.now()}`
  const respuesta = await fetch(url, { cache: 'no-store' })
  if (!respuesta.ok) {
    throw new Error(`no se pudo obtener el archivo de noticias (HTTP ${respuesta.status})`)
  }
  const datos = await respuesta.json()
  if (!Array.isArray(datos?.noticias) || !Array.isArray(datos?.secciones)) {
    throw new Error('el archivo de noticias tiene un formato inesperado')
  }
  return datos
}
