// Composición (arquitectura hexagonal): el único archivo que une dominio,
// puertos, adaptadores y configuración. Para la v2 con base de datos basta
// cambiar aquí el adaptador de repositorio.
//
// Uso: node src/main.js [--entrada ruta.json] [--salida ruta.json]
// (por defecto lee y escribe ./datos/noticias.json)

import { parseArgs } from 'node:util'
import { crearExtractorContenido } from './adaptadores/extractor-contenido.js'
import { crearFuenteGoogleNews } from './adaptadores/fuente-google-news.js'
import { crearFuenteRss } from './adaptadores/fuente-rss.js'
import { crearFuenteSitemapNews } from './adaptadores/fuente-sitemap-news.js'
import { crearRepositorioJson } from './adaptadores/repositorio-json.js'
import { crearResolutorGoogleNews } from './adaptadores/resolver-google-news.js'
import { mapaConLimite } from './adaptadores/util-concurrencia.js'
import { CONCEPTOS } from './config/conceptos.js'
import { MEDIOS, MEDIOS_SITEMAP } from './config/medios.js'
import {
  DOMINIOS_EXCLUIDOS,
  ENRIQUECIMIENTO_ACTIVO,
  GOOGLE_NEWS_ACTIVO,
  GOOGLE_NEWS_PARAMS,
  HISTORICO_MAX_DIAS,
  LARGO_EXTRACTO,
  MAX_DESCARGAS_POR_CORRIDA,
  MAX_DESCARGAS_SITEMAP_POR_CORRIDA,
  MAX_RESOLUCIONES_POR_CORRIDA,
  SITEMAP_ACTIVO,
  TAMANO_VENTANA,
  TIMEOUT_FEED_MS,
  USER_AGENT,
  VERSION_ANALISIS,
} from './config/parametros.js'
import { actualizarHistorico } from './dominio/historico.js'
import { esDominioExtranjero } from './dominio/ambito.js'
import { construirDetector, recortarTexto } from './dominio/menciones.js'
import { crearNoticia } from './dominio/noticia.js'
import { enriquecerNoticia } from './dominio/enriquecimiento.js'
import { SECCIONES, validarTipoDeMedio } from './dominio/secciones.js'
import { fusionar } from './dominio/ventana.js'

function dominioDe(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      entrada: { type: 'string' },
      salida: { type: 'string' },
      historico: { type: 'string' },
    },
  })
  const rutaEntrada = values.entrada ?? './datos/noticias.json'
  const rutaSalida = values.salida ?? rutaEntrada
  const rutaHistorico = values.historico ?? './datos/historico.json'

  for (const medio of MEDIOS) validarTipoDeMedio(medio.tipo)
  for (const medio of MEDIOS_SITEMAP) validarTipoDeMedio(medio.tipo)

  const detector = construirDetector(CONCEPTOS)
  const fuenteRss = crearFuenteRss({ timeoutMs: TIMEOUT_FEED_MS, userAgent: USER_AGENT })
  const repositorio = crearRepositorioJson(rutaEntrada, rutaSalida)
  const repositorioHistorico = crearRepositorioJson(rutaHistorico, rutaHistorico, { compacto: true })

  const estadoPrevio = await repositorio.cargar()
  const previas = estadoPrevio?.noticias ?? []
  const historicoAnterior = await repositorioHistorico.cargar()
  const ahora = new Date().toISOString()

  // Extracto con la mención resaltada: se busca en el cuerpo; si la mención solo
  // está en el titular, se resalta ahí. Sin cuerpo y sin mención en el titular
  // (típico de Google News) se deja vacío para no duplicar el titular.
  const armarExtracto = (item) => {
    const cuerpo = item.texto?.trim() ? item.texto : ''
    const delCuerpo = cuerpo ? detector.extraerExtracto(cuerpo, LARGO_EXTRACTO) : null
    if (delCuerpo) return delCuerpo
    const delTitular = detector.extraerExtracto(item.titular, LARGO_EXTRACTO)
    if (delTitular) return delTitular
    return cuerpo ? [{ texto: recortarTexto(cuerpo, LARGO_EXTRACTO), resaltado: false }] : []
  }
  const armarNoticia = (item, medio) =>
    crearNoticia({
      medio,
      titular: item.titular,
      url: item.url,
      fechaMedio: item.fecha,
      fechaDeteccion: ahora,
      extracto: armarExtracto(item),
    })

  const nuevas = []
  const lineasResumen = []

  // --- Fuente 1: feeds RSS de los medios curados (links directos) ---
  const resultados = await Promise.allSettled(MEDIOS.map((medio) => fuenteRss.obtener(medio)))
  resultados.forEach((resultado, indice) => {
    const medio = MEDIOS[indice]
    if (resultado.status === 'rejected') {
      lineasResumen.push(`[FALLO] ${medio.nombre}: ${resultado.reason?.message ?? resultado.reason}`)
      return
    }
    let conMencion = 0
    for (const item of resultado.value) {
      // Solo la fuente curada se filtra con nuestro detector (los feeds traen de todo).
      if (!detector.detecta(`${item.titular}\n${item.texto}`)) continue
      const noticia = armarNoticia(item, medio)
      if (noticia) {
        nuevas.push(noticia)
        conMencion += 1
      }
    }
    lineasResumen.push(`[OK] ${medio.nombre}: ${resultado.value.length} ítems, ${conMencion} con mención`)
  })

  // --- Fuente 2: Google News (red de seguridad; ya viene filtrado por la búsqueda) ---
  // Se agrega DESPUÉS de la curada: ante la misma URL, gana la versión curada
  // (mejor extracto y sección real) en la deduplicación.
  // Un medio de la lista curada que llegue por Google (porque su feed propio ya
  // rotó la noticia) se clasifica en SU sección real, no en "Otros medios".
  // Incluye los medios sitemap: una nota de Meganoticias vía Google cae en 'tv'.
  const medioPorDominio = new Map(
    [
      ...MEDIOS.map((medio) => [dominioDe(medio.feedUrl), medio]),
      ...MEDIOS_SITEMAP.map((medio) => [dominioDe(medio.sitemapUrl), medio]),
    ].filter(([dom]) => dom),
  )
  const clasificar = (dom, fuente) => {
    const curado = medioPorDominio.get(dom)
    if (curado) {
      return { medioId: curado.id, medioNombre: curado.nombre, seccionId: curado.tipo }
    }
    // Los medios extranjeros no se mezclan con la prensa chilena no curada.
    return { medioId: dom, medioNombre: fuente, seccionId: esDominioExtranjero(dom) ? 'internacional' : 'otros' }
  }

  // Reclasificación retroactiva sobre "Otros medios": (a) una previa cuyo medio
  // se curó después adopta su medio y sección reales (ej.: CNN Chile → TV);
  // (b) una previa de medio extranjero pasa a "Medios internacionales".
  // Solo se tocan noticias en 'otros': tras la primera pasada queda idempotente.
  let reclasificadas = 0
  for (const noticia of previas) {
    if (noticia.seccionId !== 'otros') continue
    const dominio = dominioDe(noticia.url)
    const curado = medioPorDominio.get(dominio)
    if (curado) {
      // Los medios curados con tipo 'otros' (El Mostrador, etc.) ya están bien.
      if (noticia.medioId === curado.id && noticia.seccionId === curado.tipo) continue
      noticia.medioId = curado.id
      noticia.medioNombre = curado.nombre
      noticia.seccionId = curado.tipo
      reclasificadas += 1
    } else if (esDominioExtranjero(dominio)) {
      noticia.seccionId = 'internacional'
      reclasificadas += 1
    }
  }
  if (reclasificadas > 0) {
    lineasResumen.push(`[OK] Reclasificadas: ${reclasificadas} noticias de "Otros" a su sección real`)
  }

  const cachePrevia = new Map(Object.entries(estadoPrevio?.resolucionesGoogle ?? {}))
  let cacheGoogle = cachePrevia
  if (GOOGLE_NEWS_ACTIVO) {
    try {
      const fuenteGoogle = crearFuenteGoogleNews({
        conceptos: CONCEPTOS,
        resolutor: crearResolutorGoogleNews({ userAgent: USER_AGENT }),
        params: GOOGLE_NEWS_PARAMS,
        maxResoluciones: MAX_RESOLUCIONES_POR_CORRIDA,
        cachePrevia,
        dominiosExcluidos: DOMINIOS_EXCLUIDOS,
        clasificar,
        userAgent: USER_AGENT,
      })
      const { items, cache } = await fuenteGoogle.obtener()
      cacheGoogle = cache
      let agregadas = 0
      for (const item of items) {
        const medio = { id: item.medioId, nombre: item.medioNombre, tipo: item.seccionId }
        const noticia = armarNoticia(item, medio)
        if (noticia) {
          nuevas.push(noticia)
          agregadas += 1
        }
      }
      lineasResumen.push(`[OK] Google News: ${items.length} resueltas, ${agregadas} agregadas`)
    } catch (error) {
      // Google falló: seguimos con lo curado y conservamos la caché previa.
      lineasResumen.push(`[FALLO] Google News: ${error.message}`)
    }
  }

  // --- Fuente 3: sitemaps de noticias (medios sin RSS) ---
  // Se agrega DESPUÉS de Google: ante la misma URL, la deduplicación de fusionar
  // conserva previas > RSS curado > Google > sitemap. La caché de URLs ya
  // procesadas (sitemapVisto) se persiste en el estado, hermana de resolucionesGoogle.
  const sitemapVistoPrevio = estadoPrevio?.sitemapVisto ?? {}
  const sitemapVisto = {}
  if (SITEMAP_ACTIVO) {
    const extractorSitemap = crearExtractorContenido({ timeoutMs: 15000, userAgent: USER_AGENT })
    for (const medio of MEDIOS_SITEMAP) {
      try {
        const fuenteSitemap = crearFuenteSitemapNews({
          extractor: extractorSitemap,
          cachePrevia: new Set(sitemapVistoPrevio[medio.id] ?? []),
          maxDescargas: MAX_DESCARGAS_SITEMAP_POR_CORRIDA,
          timeoutMs: TIMEOUT_FEED_MS,
          userAgent: USER_AGENT,
        })
        const { items, cache } = await fuenteSitemap.obtener(medio)
        sitemapVisto[medio.id] = [...cache].sort()
        let conMencion = 0
        for (const item of items) {
          // Mismo filtro que la fuente curada: el sitemap trae de todo.
          if (!detector.detecta(`${item.titular}\n${item.texto}`)) continue
          const noticia = armarNoticia(item, medio)
          if (noticia) {
            nuevas.push(noticia)
            conMencion += 1
          }
        }
        lineasResumen.push(
          `[OK] Sitemap ${medio.nombre}: ${items.length} nuevas procesadas, ${conMencion} con mención, ${cache.size} en caché`,
        )
      } catch (error) {
        // No se vio el sitemap actual: conservar la caché previa SIN podar.
        sitemapVisto[medio.id] = sitemapVistoPrevio[medio.id] ?? []
        lineasResumen.push(`[FALLO] Sitemap ${medio.nombre}: ${error.message}`)
      }
    }
  } else {
    // Desactivado: conservar la caché tal cual para no re-procesar al reactivar.
    Object.assign(sitemapVisto, sitemapVistoPrevio)
  }

  // --- Punto A: Enriquecimiento por noticia ---
  // Descarga de contenido + análisis NLP: solo noticias nuevas (las previas conservan
  // su enriquecimiento por incrementalidad de fusionar). Fallos → analisis: null (fail-open).
  if (ENRIQUECIMIENTO_ACTIVO && nuevas.length > 0) {
    const ineditas = nuevas.filter((n) => !previas.some((p) => p.id === n.id))
    const extractor = crearExtractorContenido({ timeoutMs: 15000, userAgent: USER_AGENT })
    let presupuesto = MAX_DESCARGAS_POR_CORRIDA
    let enriquecidas = 0

    await mapaConLimite(ineditas, 6, async (noticia) => {
      if (presupuesto <= 0) {
        noticia.analisis = null
        return
      }
      presupuesto -= 1

      const contenido = await extractor.obtenerContenido(noticia.url)
      if (!contenido) {
        noticia.analisis = null
        noticia.imagen = null
        return
      }

      // Propagación de campos
      noticia.imagen = contenido.imagen
      noticia.autor = contenido.autor
      noticia.fechaReal = contenido.fechaPublicacion

      // Enriquecimiento: usar texto descargado, o RSS, o titular como fallback
      const textoParaAnalisis = contenido.texto || noticia.extracto.map((s) => s.texto).join('') || noticia.titular
      const config = { VERSION_ANALISIS }
      noticia.analisis = enriquecerNoticia(noticia, textoParaAnalisis, config)
      if (noticia.analisis) enriquecidas += 1
    })

    lineasResumen.push(`[OK] Enriquecimiento: ${enriquecidas}/${ineditas.length} noticias nuevas analizadas`)
  }

  // Re-enriquecimiento sin red: previas con análisis nulo o de versión anterior se
  // recalculan con titular + extracto (determinista: una segunda corrida no cambia nada).
  if (ENRIQUECIMIENTO_ACTIVO) {
    let reanalizadas = 0
    for (const noticia of previas) {
      if (noticia.analisis && noticia.analisis.version >= VERSION_ANALISIS) continue
      const texto = noticia.extracto?.map((s) => s.texto).join('') || noticia.titular
      noticia.analisis = enriquecerNoticia(noticia, texto, { VERSION_ANALISIS })
      if (noticia.analisis) reanalizadas += 1
    }
    if (reanalizadas > 0) {
      lineasResumen.push(`[OK] Re-enriquecimiento: ${reanalizadas} noticias previas actualizadas a v${VERSION_ANALISIS}`)
    }
  }

  const noticias = fusionar(previas, nuevas, TAMANO_VENTANA)

  // --- Punto B: Histórico y eventos (Fase 2: clustering de eventos) ---
  // Por ahora (Fase 1): solo actualizar histórico. Fase 2: agregar clustering aquí.
  const historico = actualizarHistorico(historicoAnterior, noticias, HISTORICO_MAX_DIAS)
  const historicoIgual =
    historicoAnterior != null &&
    JSON.stringify(historicoAnterior.registros) === JSON.stringify(historico.registros)

  if (!historicoIgual) {
    historico.actualizadoEn = ahora
    await repositorioHistorico.guardar(historico)
  } else if (historicoAnterior) {
    // Si el contenido no cambió, conservar el timestamp anterior
    historico.actualizadoEn = historicoAnterior.actualizadoEn
  }

  // Caché de resolución serializada de forma estable (ordenada) para que un mero
  // reordenamiento del feed de Google no genere un commit espurio.
  const resolucionesGoogle = Object.fromEntries([...cacheGoogle].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))

  // `generadoEn` cambia solo si cambiaron las noticias: una corrida sin novedades
  // no altera la fecha mostrada al usuario.
  const noticiasIguales =
    estadoPrevio != null && JSON.stringify(estadoPrevio.noticias) === JSON.stringify(noticias)
  await repositorio.guardar({
    generadoEn: noticiasIguales ? estadoPrevio.generadoEn : ahora,
    tamanoVentana: TAMANO_VENTANA,
    secciones: SECCIONES,
    noticias,
    resolucionesGoogle,
    sitemapVisto,
  })

  console.log(lineasResumen.join('\n'))
  console.log(
    `Ventana: ${previas.length} previas + ${nuevas.length} detectadas -> ${noticias.length} publicadas (tope ${TAMANO_VENTANA})`,
  )

  const curadasOk = resultados.filter((resultado) => resultado.status === 'fulfilled').length
  if (curadasOk === 0 && nuevas.length === 0) {
    // No se obtuvo nada de ninguna fuente: fallar evita desplegar una
    // "actualización" vacía y delata el problema.
    console.error('Ninguna fuente entregó datos; corrida marcada como fallida.')
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(`Error fatal: ${error.stack ?? error}`)
  process.exitCode = 1
})
