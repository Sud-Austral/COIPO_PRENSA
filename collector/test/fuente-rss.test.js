import { afterEach, describe, expect, it, vi } from 'vitest'
import { crearFuenteRss } from '../src/adaptadores/fuente-rss.js'

const MEDIO = { id: 'medio-prueba', nombre: 'Medio Prueba', tipo: 'escrita', feedUrl: 'https://medio.cl/rss' }

function respuestaXml(xml, opciones = {}) {
  return new Response(xml, {
    status: opciones.status ?? 200,
    // Content-Type deliberadamente incorrecto: el adaptador no debe validarlo
    // (BioBioChile sirve su RSS como application/octet-stream).
    headers: { 'content-type': opciones.contentType ?? 'application/octet-stream' },
  })
}

const FEED_BASICO = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Medio Prueba</title>
    <item>
      <title>Brigadistas de &lt;b&gt;Conaf&lt;/b&gt; controlan incendio</title>
      <link>https://medio.cl/nota-1</link>
      <pubDate>Mon, 13 Jul 2026 08:00:00 -0400</pubDate>
      <description>&lt;p&gt;El equipo de CONAF trabaj&#243; toda la noche&amp;nbsp;en el cerro.&lt;/p&gt;</description>
    </item>
    <item>
      <title>Ítem sin link que debe descartarse</title>
      <description>texto</description>
    </item>
    <item>
      <title>Nota con contenido completo</title>
      <link>https://medio.cl/nota-2</link>
      <content:encoded>&lt;p&gt;Cuerpo completo con la Corporaci&#243;n Nacional Forestal mencionada&lt;/p&gt;</content:encoded>
      <description>resumen sin mención</description>
    </item>
  </channel>
</rss>`

afterEach(() => vi.unstubAllGlobals())

describe('crearFuenteRss', () => {
  it('parsea el feed sin validar content-type y limpia HTML/entidades', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respuestaXml(FEED_BASICO)))
    const items = await crearFuenteRss().obtener(MEDIO)

    expect(items).toHaveLength(2) // el ítem sin link se descarta
    expect(items[0].titular).toBe('Brigadistas de Conaf controlan incendio')
    expect(items[0].url).toBe('https://medio.cl/nota-1')
    expect(items[0].texto).toBe('El equipo de CONAF trabajó toda la noche en el cerro.')
    expect(items[0].fecha).toBeTruthy()
  })

  it('prefiere content:encoded (cuerpo completo) sobre la descripción', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respuestaXml(FEED_BASICO)))
    const items = await crearFuenteRss().obtener(MEDIO)
    expect(items[1].texto).toContain('Corporación Nacional Forestal')
  })

  it('lanza ante HTTP no-ok', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respuestaXml('', { status: 503 })))
    await expect(crearFuenteRss().obtener(MEDIO)).rejects.toThrow('HTTP 503')
  })

  it('lanza ante XML malformado sin reventar el proceso', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respuestaXml('esto no es xml <<<')))
    await expect(crearFuenteRss().obtener(MEDIO)).rejects.toThrow()
  })

  it('envía el User-Agent configurado', async () => {
    const fetchEspiado = vi.fn(async () => respuestaXml(FEED_BASICO))
    vi.stubGlobal('fetch', fetchEspiado)
    await crearFuenteRss({ userAgent: 'AgentePrueba/9' }).obtener(MEDIO)
    expect(fetchEspiado.mock.calls[0][1].headers['user-agent']).toBe('AgentePrueba/9')
  })
})
