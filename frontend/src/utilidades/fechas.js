// Formateo de fechas en español (América/Santiago).

const locale = 'es-CL'
const zona = 'America/Santiago'

export function formatoFechaLarga(isoString) {
  const fecha = new Date(isoString)
  return fecha.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: zona,
  })
}

export function formatoFechaCorta(isoString) {
  const fecha = new Date(isoString)
  return fecha.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: zona,
  })
}

export function formatoHora(isoString) {
  const fecha = new Date(isoString)
  return fecha.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: zona,
  })
}

export function formatoFechaHora(isoString) {
  const fecha = new Date(isoString)
  return fecha.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: zona,
  })
}

export function hace(isoString) {
  const fecha = new Date(isoString)
  const ahora = new Date()
  const diff = ahora - fecha
  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(diff / 3600000)
  const días = Math.floor(diff / 86400000)

  if (minutos < 1) return 'hace unos segundos'
  if (minutos < 60) return `hace ${minutos} min`
  if (horas < 24) return `hace ${horas} h`
  if (días < 7) return `hace ${días} d`
  return formatoFechaCorta(isoString)
}
