// Secciones del boletín (línea base del boletín antiguo de ConectaMedia).
// El tipo de cada medio en config/medios.js debe ser uno de estos ids.

export const SECCIONES = [
  { id: 'escrita', nombre: 'Prensa Escrita', orden: 1 },
  { id: 'regional', nombre: 'Prensa Regional', orden: 2 },
  { id: 'radio', nombre: 'Radio', orden: 3 },
]

export function validarTipoDeMedio(tipo) {
  if (!SECCIONES.some((seccion) => seccion.id === tipo)) {
    const validos = SECCIONES.map((seccion) => seccion.id).join(', ')
    throw new Error(`Tipo de medio desconocido: "${tipo}". Válidos: ${validos}`)
  }
  return tipo
}
