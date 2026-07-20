// Persistencia en localStorage de todas las noticias vistas.
// Complementa el histórico JSON del collector.

const CLAVE_HISTORICO = 'coipo-historico-local'
const VERSION = 1

function obtenerHistorico() {
  try {
    const datos = localStorage.getItem(CLAVE_HISTORICO)
    if (!datos) return { version: VERSION, noticias: {} }
    const parsed = JSON.parse(datos)
    return parsed.version === VERSION ? parsed : { version: VERSION, noticias: {} }
  } catch {
    return { version: VERSION, noticias: {} }
  }
}

function guardarHistorico(historico) {
  try {
    localStorage.setItem(CLAVE_HISTORICO, JSON.stringify(historico))
  } catch (e) {
    console.warn('No se pudo guardar histórico local:', e.message)
  }
}

export function actualizarHistoricoLocal(noticias) {
  if (!noticias?.length) return

  const historico = obtenerHistorico()
  const ahora = new Date().toISOString()

  noticias.forEach(n => {
    if (!historico.noticias[n.id]) {
      historico.noticias[n.id] = {
        id: n.id,
        url: n.url,
        medioId: n.medioId,
        medioNombre: n.medioNombre,
        seccionId: n.seccionId,
        titular: n.titular,
        fecha: n.fecha,
        primeraVista: ahora,
        ultimalVista: ahora,
        sentimiento: n.analisis?.sentimiento,
        categorias: n.analisis?.categorias,
        importancia: n.analisis?.importancia,
        riesgo: n.analisis?.riesgo,
      }
    } else {
      historico.noticias[n.id].ultimalVista = ahora
    }
  })

  guardarHistorico(historico)
}

export function obtenerHistoricoLocal() {
  const historico = obtenerHistorico()
  return Object.values(historico.noticias).sort(
    (a, b) => new Date(b.ultimalVista) - new Date(a.ultimalVista)
  )
}

export function limpiarHistoricoLocal() {
  localStorage.removeItem(CLAVE_HISTORICO)
}
