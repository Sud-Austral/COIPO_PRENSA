// Entidad noticia: normalización de ítems crudos de cualquier fuente.

const PARAMETRO_DE_RASTREO = /^(utm_|fbclid$|gclid$|msclkid$|mc_cid$|mc_eid$)/i

// URL canónica para deduplicar: sin fragmento, sin parámetros de rastreo,
// host en minúsculas, sin slash final. Ante una URL inválida se devuelve el
// texto tal cual (mejor conservar la noticia que perderla).
export function canonicalizarUrl(url) {
  const crudo = String(url ?? '').trim()
  let parseada
  try {
    parseada = new URL(crudo)
  } catch {
    return crudo
  }
  parseada.hash = ''
  const aEliminar = [...parseada.searchParams.keys()].filter((clave) =>
    PARAMETRO_DE_RASTREO.test(clave),
  )
  for (const clave of aEliminar) parseada.searchParams.delete(clave)
  if (parseada.pathname.length > 1 && parseada.pathname.endsWith('/')) {
    parseada.pathname = parseada.pathname.slice(0, -1)
  }
  return parseada.toString()
}

// Fecha a ISO-8601, o null si no es interpretable.
export function parsearFecha(valor) {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : valor.toISOString()
  }
  if (typeof valor !== 'string' || valor.trim() === '') return null
  const epoch = Date.parse(valor)
  return Number.isNaN(epoch) ? null : new Date(epoch).toISOString()
}

// Regla de fecha (REQUISITOS.md pregunta 10, supuesto fijado): la declarada
// por el medio; si falta o es inválida, la fecha de detección.
export function crearNoticia({ medio, titular, url, fechaMedio, fechaDeteccion, extracto, imagen = null }) {
  const id = canonicalizarUrl(url)
  const titularLimpio = typeof titular === 'string' ? titular.trim() : ''
  if (id === '' || titularLimpio === '') return null
  const deteccionIso = parsearFecha(fechaDeteccion)
  return {
    id,
    url: String(url).trim(),
    medioId: medio.id,
    medioNombre: medio.nombre,
    seccionId: medio.tipo,
    titular: titularLimpio,
    fecha: parsearFecha(fechaMedio) ?? deteccionIso,
    fechaDeteccion: deteccionIso,
    extracto,
    imagen,
  }
}
