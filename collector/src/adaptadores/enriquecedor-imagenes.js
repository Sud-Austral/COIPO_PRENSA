// Obtiene la imagen de portada (og:image) de un artículo para mostrarla en la
// tarjeta. Es hotlinking: se guarda la URL, no la imagen. El frontend oculta la
// imagen si no carga, así que un enlace roto degrada a tarjeta de solo texto.

function decodificarEntidades(texto) {
  return texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
}

// Extrae la URL absoluta de la imagen social del HTML, o null. Función pura
// (testeable sin red).
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
        // GitHub Pages es HTTPS: una imagen http se bloquea por contenido mixto.
        // Se fuerza https (casi todos los CDN lo soportan); si no, el frontend la
        // oculta con el fallback.
        absoluta.protocol = 'https:'
        return absoluta.toString()
      }
    } catch {
      // URL inválida: probar el siguiente patrón.
    }
  }
  return null
}

export function crearEnriquecedorImagenes({ timeoutMs = 15000, userAgent } = {}) {
  return {
    // Devuelve la URL de la imagen o null (nunca lanza).
    async obtenerImagen(urlArticulo) {
      try {
        const respuesta = await fetch(urlArticulo, {
          headers: { 'user-agent': userAgent, accept: 'text/html' },
          redirect: 'follow',
          signal: AbortSignal.timeout(timeoutMs),
        })
        if (!respuesta.ok) return null
        const tipo = respuesta.headers.get('content-type') ?? ''
        if (!tipo.includes('html')) return null
        return extraerImagen(await respuesta.text(), respuesta.url || urlArticulo)
      } catch {
        return null
      }
    },
  }
}
