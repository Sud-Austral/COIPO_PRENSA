// Adaptador RSS/Atom del puerto fuente-de-noticias.

import Parser from 'rss-parser'

// Algunos medios sirven el feed con Content-Type incorrecto (BioBioChile usa
// application/octet-stream), por eso NUNCA se valida el content-type: se parsea
// el cuerpo directamente.
export function crearFuenteRss({ timeoutMs = 20000, userAgent = 'COIPO_PRENSA/1.0' } = {}) {
  const parser = new Parser({
    customFields: { item: [['content:encoded', 'contenidoCompleto']] },
  })

  return {
    async obtener(medio) {
      const respuesta = await fetch(medio.feedUrl, {
        headers: {
          'user-agent': userAgent,
          accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status} al pedir ${medio.feedUrl}`)
      }
      const xml = await respuesta.text()
      const feed = await parser.parseString(xml)

      const items = []
      for (const item of feed.items ?? []) {
        if (typeof item.link !== 'string' || item.link.trim() === '') {
          console.warn(`[${medio.id}] ítem sin link descartado: "${item.title ?? '(sin título)'}"`)
          continue
        }
        items.push({
          titular: limpiarTexto(item.title ?? ''),
          url: item.link.trim(),
          fecha: item.isoDate ?? item.pubDate ?? null,
          // Se prefiere el contenido completo (content:encoded, típico de
          // WordPress) porque la mención puede estar más allá del resumen.
          texto: limpiarTexto(
            item.contenidoCompleto ?? item.content ?? item.summary ?? item.contentSnippet ?? '',
          ),
        })
      }
      return items
    },
  }
}

// HTML/entidades → texto plano de una línea.
function limpiarTexto(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, codigo) => String.fromCodePoint(Number(codigo)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codigo) => String.fromCodePoint(parseInt(codigo, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
}
