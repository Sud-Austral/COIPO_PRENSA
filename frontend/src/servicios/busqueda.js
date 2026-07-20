import MiniSearch from 'minisearch'

let indice = null

export function construirIndice(noticias) {
  indice = new MiniSearch({
    fields: [
      { name: 'titular', weight: 10 },
      { name: 'keywords', weight: 5 },
      { name: 'categorias', weight: 3 },
      { name: 'organizaciones', weight: 2 },
      { name: 'personas', weight: 2 },
      { name: 'lugares', weight: 2 },
    ],
    storeFields: ['id', 'titular', 'medioNombre', 'fecha', 'seccionId'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
  })

  const docs = noticias.map(n => ({
    id: n.id,
    titular: n.titular,
    keywords: (n.analisis?.keywords || []).join(' '),
    categorias: (n.analisis?.categorias || []).join(' '),
    organizaciones: (n.analisis?.organizaciones || []).join(' '),
    personas: (n.analisis?.personas || []).join(' '),
    lugares: (n.analisis?.lugares || []).join(' '),
    medioNombre: n.medioNombre,
    fecha: n.fecha,
    seccionId: n.seccionId,
  }))

  indice.addAll(docs)
  return indice
}

export function buscar(query) {
  if (!indice || !query.trim()) return []
  return indice.search(query)
}

export function obtenerFacetas(noticias) {
  const facetas = {
    secciones: {},
    medios: {},
    sentimientos: {},
    categorias: {},
    regiones: {},
    riesgos: {},
  }

  noticias.forEach(n => {
    facetas.secciones[n.seccionId] = (facetas.secciones[n.seccionId] || 0) + 1
    facetas.medios[n.medioId] = (facetas.medios[n.medioId] || 0) + 1
    if (n.analisis) {
      facetas.sentimientos[n.analisis.sentimiento] = (facetas.sentimientos[n.analisis.sentimiento] || 0) + 1
      facetas.riesgos[n.analisis.riesgo] = (facetas.riesgos[n.analisis.riesgo] || 0) + 1
      n.analisis.categorias?.forEach(cat => {
        facetas.categorias[cat] = (facetas.categorias[cat] || 0) + 1
      })
      n.analisis.regiones?.forEach(reg => {
        facetas.regiones[reg] = (facetas.regiones[reg] || 0) + 1
      })
    }
  })

  return facetas
}

export function filtrarNoticias(noticias, filtros = {}) {
  return noticias.filter(n => {
    if (filtros.seccion && n.seccionId !== filtros.seccion) return false
    if (filtros.medio && n.medioId !== filtros.medio) return false
    if (filtros.sentimiento && n.analisis?.sentimiento !== filtros.sentimiento) return false
    if (filtros.riesgo && n.analisis?.riesgo !== filtros.riesgo) return false
    if (filtros.categoria && !n.analisis?.categorias?.includes(filtros.categoria)) return false
    if (filtros.region && !n.analisis?.regiones?.includes(filtros.region)) return false
    if (filtros.fechaDesde && new Date(n.fecha) < new Date(filtros.fechaDesde)) return false
    if (filtros.fechaHasta && new Date(n.fecha) > new Date(filtros.fechaHasta)) return false
    return true
  })
}
