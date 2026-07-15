// Generación del CSV con las noticias visibles (descarga client-side).
// Formato apto para Excel es-CL: BOM UTF-8 (tildes correctas), separador ';'
// (la coma es separador decimal en Chile) y fecha dd-mm-aaaa hh:mm.

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const COLUMNAS = ['Sección', 'Medio', 'Fecha', 'Titular', 'Extracto', 'URL']

function formatearFecha(iso) {
  if (!iso) return ''
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  return FORMATO_FECHA.format(fecha).replace(',', '')
}

function escaparCampo(valor) {
  return `"${String(valor ?? '').replace(/"/g, '""')}"`
}

export function generarCsv(noticias, secciones) {
  const nombrePorSeccion = new Map(secciones.map((seccion) => [seccion.id, seccion.nombre]))
  const filas = [
    COLUMNAS,
    ...noticias.map((noticia) => [
      nombrePorSeccion.get(noticia.seccionId) ?? noticia.seccionId,
      noticia.medioNombre,
      formatearFecha(noticia.fecha),
      noticia.titular,
      noticia.extracto.map((segmento) => segmento.texto).join(''),
      noticia.url,
    ]),
  ]
  const cuerpo = filas.map((fila) => fila.map(escaparCampo).join(';')).join('\r\n')
  return `\uFEFF${cuerpo}\r\n`
}

export function descargarCsv(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}
