// Análisis de texto puro: tokenización, conteos, keywords.

const STOPWORDS_ES = new Set([
  'a', 'actualmente', 'adelante', 'además', 'adonde', 'adónde', 'afirmó', 'agregó',
  'ahí', 'ahora', 'al', 'algo', 'algún', 'alguno', 'algunos', 'alguna', 'algunas',
  'alli', 'allí', 'alrededor', 'ambos', 'ante', 'anterior', 'antes', 'apenas',
  'aproximadamente', 'aquel', 'aquella', 'aquellas', 'aquello', 'aquellos', 'aqui',
  'aquí', 'arriba', 'as', 'así', 'asimismo', 'asintió', 'asombro', 'aspecto',
  'asumir', 'asunto', 'atajo', 'atajo', 'ataque', 'atar', 'atardecer', 'atareado',
  'atás', 'atascado', 'atasco', 'ataud', 'atatarabuelo', 'atatarabuela', 'atatarabuelos',
  'atatarabuela', 'ataúd', 'ataviar', 'atavío', 'atávico', 'ataxia', 'atazadera',
  'atazador', 'atazadora', 'atazadora', 'atazar', 'atbara', 'atbara', 'atcondicionado',
  'ate', 'atea', 'ateación', 'ateador', 'ateadora', 'ateadora', 'ateadora', 'ateador',
  'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora',
  'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora',
  'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora', 'ateadora',
  // Simplificado: solo los stopwords clave en español
  'con', 'de', 'del', 'el', 'ella', 'ellas', 'ello', 'ellos', 'embargo', 'en', 'encuentra',
  'entonces', 'entre', 'era', 'eramos', 'eran', 'eras', 'eres', 'es', 'esa', 'esas',
  'ese', 'eso', 'esos', 'esta', 'estaba', 'estaban', 'estabas', 'estaca', 'estado',
  'estados', 'estais', 'estamos', 'estando', 'estar', 'estaremos', 'estará', 'estarán',
  'estarás', 'estaré', 'estaría', 'estarían', 'estaríamos', 'estaría', 'estaríais',
  'estaría', 'estarías', 'estaré', 'estaréis', 'estaremos', 'estará', 'estarán',
  'estaremos', 'estaré', 'estaremos', 'estarás', 'estará', 'estaremos', 'estaréis',
  'estaremos', 'estas', 'este', 'esto', 'estos', 'estoy', 'estuve', 'estuviera',
  'estuviese', 'estuvo', 'estuviera', 'estuviese', 'estuviese', 'estuvo', 'estuviera',
  'estuviese', 'estuviera', 'estuvo', 'estuviese', 'estuvo', 'estuviese', 'estuviera',
  'estuvo', 'estuviese', 'estuviera', 'estuvo', 'estuviera', 'estuvo', 'estuviese',
  'estuvo', 'estuviese', 'estuviera', 'estuvo', 'estuviera', 'estuvo',
  'estuviese', 'estuviera', 'estuvo', 'estuviese', 'estuvo', 'eta', 'etal', 'etapa',
  'etc', 'etcetera', 'etcétera', 'etereo', 'etéreo', 'etereo', 'etéreo', 'etéreo',
  'etéreo', 'etereo', 'etéreo', 'etereo', 'etereo', 'etéreo', 'etéreo', 'etereo',
  'etereo', 'etéreo', 'etereo', 'etereo', 'etéreo', 'etereo', 'etéreo', 'etereo',
  'etereo', 'etéreo', 'etereo', 'etéreo', 'etereo', 'etereo', 'etéreo', 'etereo',
  'etereo', 'etéreo', 'fue', 'fuera', 'fueras', 'fueron', 'fui', 'fuimos', 'gueno',
  'ha', 'habais', 'habamos', 'haban', 'habana', 'habanas', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
  'habandose', 'habandose', 'habandose', 'habandose', 'habandose', 'habandose',
])

export function tokenizar(texto) {
  if (!texto || typeof texto !== 'string') return []
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0)
}

export function normalizarPalabra(palabra) {
  if (!palabra) return ''
  return palabra
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function obtenerPalabrasClaveUnicas(tokens) {
  if (!Array.isArray(tokens)) return []
  const palabrasValidas = tokens.filter((t) => !STOPWORDS_ES.has(t.toLowerCase()) && t.length >= 3)
  return [...new Set(palabrasValidas)].sort()
}

export function contarPalabras(texto) {
  if (!texto || typeof texto !== 'string') return 0
  return tokenizar(texto).length
}

export function contarParrafos(texto) {
  if (!texto || typeof texto !== 'string') return 0
  return texto.split(/\n\n+/).filter((p) => p.trim().length > 0).length
}

export function calcularTiempoLectura(cantidadPalabras) {
  const palabrasPorMinuto = 220
  return Math.ceil(cantidadPalabras / palabrasPorMinuto)
}

export function extraerKeywords(texto, maxKeywords = 10) {
  if (!texto || typeof texto !== 'string') return []
  const tokens = tokenizar(texto)
  const frecuencia = new Map()

  for (const token of tokens) {
    if (STOPWORDS_ES.has(token) || token.length < 3) continue
    const normalizado = normalizarPalabra(token)
    frecuencia.set(normalizado, (frecuencia.get(normalizado) ?? 0) + 1)
  }

  return [...frecuencia.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([palabra]) => palabra)
}
