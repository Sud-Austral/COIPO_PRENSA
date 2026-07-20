// Agregaciones puras para analytics (Dashboard, Estadísticas).

export function calcularKpis(noticias, historico) {
  if (!noticias) return {}

  const ahora = new Date()
  const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000)
  const hace7d = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
  const hace30d = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)

  const hoy = noticias.filter(n => new Date(n.fecha) > hace24h).length
  const semana = noticias.filter(n => new Date(n.fecha) > hace7d).length
  const mes = noticias.filter(n => new Date(n.fecha) > hace30d).length

  const criticas = noticias.filter(n => n.analisis?.riesgo === 'alto').length
  const negativas = noticias.filter(n => n.analisis?.sentimiento === 'negativa').length
  const positivas = noticias.filter(n => n.analisis?.sentimiento === 'positiva').length
  const medios = new Set(noticias.map(n => n.medioId)).size

  return { hoy, semana, mes, criticas, negativas, positivas, medios }
}

export function agruparPorDia(noticias) {
  const grupos = {}
  noticias.forEach(n => {
    const dia = new Date(n.fecha).toISOString().split('T')[0]
    if (!grupos[dia]) grupos[dia] = 0
    grupos[dia] += 1
  })
  return Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, cantidad]) => ({ dia, cantidad }))
}

export function agruparPorMedio(noticias) {
  const grupos = {}
  noticias.forEach(n => {
    if (!grupos[n.medioId]) grupos[n.medioId] = { nombre: n.medioNombre, cantidad: 0 }
    grupos[n.medioId].cantidad += 1
  })
  return Object.values(grupos)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10)
}

export function agruparPorCategoria(noticias) {
  const grupos = {}
  noticias.forEach(n => {
    if (n.analisis?.categorias) {
      n.analisis.categorias.forEach(cat => {
        grupos[cat] = (grupos[cat] || 0) + 1
      })
    }
  })
  return Object.entries(grupos)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, cantidad]) => ({ cat, cantidad }))
}

export function agruparPorSentimiento(noticias) {
  const grupos = { positiva: 0, neutra: 0, negativa: 0, mixta: 0 }
  noticias.forEach(n => {
    if (n.analisis?.sentimiento) {
      grupos[n.analisis.sentimiento] += 1
    }
  })
  return Object.entries(grupos)
    .map(([sentimiento, cantidad]) => ({ sentimiento, cantidad }))
}

export function topPalabras(noticias, cantidad = 10) {
  const frecuencia = {}
  noticias.forEach(n => {
    if (n.analisis?.keywords) {
      n.analisis.keywords.slice(0, 3).forEach(palabra => {
        frecuencia[palabra] = (frecuencia[palabra] || 0) + 1
      })
    }
  })
  return Object.entries(frecuencia)
    .sort(([, a], [, b]) => b - a)
    .slice(0, cantidad)
    .map(([palabra, freq]) => ({ palabra, freq }))
}

export function topOrganizaciones(noticias, cantidad = 8) {
  const frecuencia = {}
  noticias.forEach(n => {
    if (n.analisis?.organizaciones) {
      n.analisis.organizaciones.forEach(org => {
        frecuencia[org] = (frecuencia[org] || 0) + 1
      })
    }
  })
  return Object.entries(frecuencia)
    .sort(([, a], [, b]) => b - a)
    .slice(0, cantidad)
    .map(([org, freq]) => ({ org, freq }))
}

export function topPersonas(noticias, cantidad = 8) {
  const frecuencia = {}
  noticias.forEach(n => {
    if (n.analisis?.personas) {
      n.analisis.personas.forEach(persona => {
        frecuencia[persona] = (frecuencia[persona] || 0) + 1
      })
    }
  })
  return Object.entries(frecuencia)
    .sort(([, a], [, b]) => b - a)
    .slice(0, cantidad)
    .map(([persona, freq]) => ({ persona, freq }))
}

export function topRegiones(noticias, cantidad = 8) {
  const frecuencia = {}
  noticias.forEach(n => {
    if (n.analisis?.regiones) {
      n.analisis.regiones.forEach(region => {
        frecuencia[region] = (frecuencia[region] || 0) + 1
      })
    }
  })
  return Object.entries(frecuencia)
    .sort(([, a], [, b]) => b - a)
    .slice(0, cantidad)
    .map(([region, freq]) => ({ region, freq }))
}

export function promedios(noticias) {
  if (!noticias.length) return { palabras: 0, parrafos: 0, lectura: 0 }
  const total = noticias.filter(n => n.analisis).reduce((acc, n) => ({
    palabras: acc.palabras + (n.analisis?.cantidadPalabras || 0),
    parrafos: acc.parrafos + (n.analisis?.cantidadParrafos || 0),
    lectura: acc.lectura + (n.analisis?.tiempoLectura || 0),
  }), { palabras: 0, parrafos: 0, lectura: 0 })
  const count = noticias.filter(n => n.analisis).length || 1
  return {
    palabras: Math.round(total.palabras / count),
    parrafos: Math.round(total.parrafos / count),
    lectura: Math.round(total.lectura / count),
  }
}
