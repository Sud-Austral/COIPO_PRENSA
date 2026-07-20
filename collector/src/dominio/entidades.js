// Extracción de personas y organizaciones.

import { tokenizar } from './analisis-texto.js'

const GAZETTEER_ORGANIZACIONES = new Set([
  'conaf',
  'carabineros',
  'fach',
  'armada',
  'senapred',
  'sernafor',
  'minagri',
  'mma',
  'municipalidad',
  'gobernación',
  'intendencia',
  'brigada',
  'cruz',
  'roja',
  'voluntarios',
  'bomberos',
  'tv',
  'cnn',
  'emol',
  'biobio',
  'cooperativa',
  'agencia',
  'onu',
  'unesco',
  'fao',
])

const SEÑALES_CARGO = new Set(['director', 'ministra', 'ministro', 'jefe', 'coordinador', 'encargado', 'gerente'])

export function extraerPersonas(texto, maxPersonas = 8) {
  if (!texto || typeof texto !== 'string') return []

  const oraciones = texto.split(/[.!?]\s+/).filter((s) => s.trim().length > 0)
  const personas = new Set()

  for (const oracion of oraciones) {
    const tokens = tokenizar(oracion)
    for (let i = 0; i < tokens.length; i++) {
      // Buscar secuencias de palabras capitalizadas (2+ tokens) como señal de nombre propio
      if (i === 0 && tokens[i][0] === tokens[i][0].toUpperCase() && tokens[i].length > 2) {
        // Primera palabra capitalizada después de punto/interrogación — posible nombre
        if (i + 1 < tokens.length && tokens[i + 1][0] === tokens[i + 1][0].toUpperCase()) {
          // Segunda palabra también capitalizada — probable nombre propio
          const posibleNombre = [tokens[i], tokens[i + 1]].join(' ')
          // Filtrar palabras comunes que no son nombres
          if (
            !GAZETTEER_ORGANIZACIONES.has(tokens[i].toLowerCase()) &&
            !['de', 'la', 'del', 'el', 'y', 'con', 'para', 'por'].includes(tokens[i + 1].toLowerCase())
          ) {
            personas.add(posibleNombre)
          }
        }
      }

      // Alternativa: palabra capitalizada precedida de "director", "ministra", etc.
      if (SEÑALES_CARGO.has(tokens[i].toLowerCase()) && i + 1 < tokens.length) {
        if (tokens[i + 1][0] === tokens[i + 1][0].toUpperCase()) {
          let nombre = tokens[i + 1]
          if (i + 2 < tokens.length && tokens[i + 2][0] === tokens[i + 2][0].toUpperCase()) {
            nombre += ' ' + tokens[i + 2]
          }
          personas.add(nombre)
        }
      }
    }
  }

  return Array.from(personas)
    .slice(0, maxPersonas)
    .sort()
}

export function extraerOrganizaciones(texto, maxOrgs = 8) {
  if (!texto || typeof texto !== 'string') return []

  const tokens = tokenizar(texto)
  const orgs = new Set()

  // Búsqueda simple: palabras capitalizadas en el gazetteer
  for (const token of tokens) {
    const norm = token.toLowerCase()
    if (GAZETTEER_ORGANIZACIONES.has(norm)) {
      orgs.add(token)
    }
  }

  // Búsqueda de siglas (3-5 caracteres, todo mayúsculas)
  const palabras = texto.match(/\b[A-Z]{2,6}\b/g) || []
  for (const palabra of palabras) {
    if (palabra.length <= 6 && !['CL', 'USA', 'UE', 'ONU'].includes(palabra)) {
      orgs.add(palabra)
    }
  }

  return Array.from(orgs)
    .slice(0, maxOrgs)
    .sort()
}
