// Extrae contenido de un artículo web: imagen, texto, autor, fecha de publicación.
// Una sola descarga por URL que alimenta múltiples campos del enriquecimiento.

function decodificarEntidades(texto) {
  return texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
}

export function extraerImagen(html, urlBase) {
  const patrones = [
    /<meta[^>]+property=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::url)?["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ]
  for (const patron of patrones) {
    const bruto = html.match(patron)?.[1]
    if (!bruto) continue
    let url = decodificarEntidades(bruto.trim())
    if (url.startsWith('//')) url = `https:${url}`
    try {
      const absoluta = new URL(url, urlBase)
      if (absoluta.protocol === 'https:') return absoluta.toString()
      if (absoluta.protocol === 'http:') {
        absoluta.protocol = 'https:'
        return absoluta.toString()
      }
    } catch {
      // URL inválida: probar siguiente patrón
    }
  }
  return null
}

export function extraerTexto(html) {
  if (!html || typeof html !== 'string') return ''

  // Buscar el contenido principal: <article>, <main>, o bloque denso de <p>
  let contenido = ''

  // Intento 1: <article>
  const articulo = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1]
  if (articulo) contenido = articulo
  else {
    // Intento 2: <main>
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1]
    if (main) contenido = main
    else {
      // Intento 3: buscar divs densos de <p>
      const matches = html.match(/<div[^>]*>(?:[^<]*<p[^>]*>[\s\S]*?<\/p>[\s\S]*?){3,}<\/div>/gi)
      contenido = matches?.[0] || html
    }
  }

  // Limpiar HTML: remove scripts, styles, tags
  let texto = contenido
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[\r\n]+/g, '\n')

  // Decodificar entidades
  texto = decodificarEntidades(texto)
    .replace(/\s+/g, ' ')
    .trim()

  // Limitar a 5000 caracteres
  return texto.slice(0, 5000)
}

export function extraerAutor(html) {
  if (!html || typeof html !== 'string') return null

  // Patrón 1: JSON-LD "author"
  const jsonld = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]
  if (jsonld) {
    try {
      const datos = JSON.parse(jsonld)
      if (datos.author?.name) return datos.author.name
      if (datos.author?.name) return datos.author.name
      if (typeof datos.author === 'string') return datos.author
    } catch {
      // JSON inválido
    }
  }

  // Patrón 2: meta "article:author"
  const meta1 = html.match(/<meta[^>]+name=["']article:author["'][^>]+content=["']([^"']+)["']/i)?.[1]
  if (meta1) return meta1

  // Patrón 3: meta "author"
  const meta2 = html.match(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i)?.[1]
  if (meta2) return meta2

  return null
}

export function extraerFechaPublicacion(html) {
  if (!html || typeof html !== 'string') return null

  // Patrón 1: JSON-LD "datePublished"
  const jsonld = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]
  if (jsonld) {
    try {
      const datos = JSON.parse(jsonld)
      if (datos.datePublished) {
        const fecha = new Date(datos.datePublished)
        if (!isNaN(fecha)) return fecha.toISOString()
      }
    } catch {
      // JSON inválido
    }
  }

  // Patrón 2: meta "article:published_time"
  const meta1 = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i)?.[1]
  if (meta1) {
    const fecha = new Date(meta1)
    if (!isNaN(fecha)) return fecha.toISOString()
  }

  // Patrón 3: meta "publish_date" o "published"
  const meta2 =
    html.match(/<meta[^>]+name=["']publish_date["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+name=["']published["'][^>]+content=["']([^"']+)["']/i)?.[1]
  if (meta2) {
    const fecha = new Date(meta2)
    if (!isNaN(fecha)) return fecha.toISOString()
  }

  return null
}

export function crearExtractorContenido({ timeoutMs = 15000, userAgent } = {}) {
  return {
    // Devuelve {imagen, texto, autor, fechaPublicacion} o null nunca lanza
    async obtenerContenido(urlArticulo) {
      try {
        const respuesta = await fetch(urlArticulo, {
          headers: { 'user-agent': userAgent, accept: 'text/html' },
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
        })
        if (!respuesta.ok) return null

        const tipo = respuesta.headers.get('content-type') ?? ''
        if (!tipo.includes('html')) return null

        const html = await respuesta.text()
        const urlFinal = respuesta.url || urlArticulo

        return {
          imagen: extraerImagen(html, urlFinal),
          texto: extraerTexto(html),
          autor: extraerAutor(html),
          fechaPublicacion: extraerFechaPublicacion(html),
        }
      } catch {
        return null
      }
    },
  }
}
