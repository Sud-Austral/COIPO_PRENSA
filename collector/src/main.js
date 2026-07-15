// Composición (arquitectura hexagonal): el único archivo que une dominio,
// puertos, adaptadores y configuración. Para la v2 con base de datos basta
// cambiar aquí el adaptador de repositorio.
//
// Uso: node src/main.js [--entrada ruta.json] [--salida ruta.json]
// (por defecto lee y escribe ./datos/noticias.json)

import { parseArgs } from 'node:util'
import { crearFuenteRss } from './adaptadores/fuente-rss.js'
import { crearRepositorioJson } from './adaptadores/repositorio-json.js'
import { CONCEPTOS } from './config/conceptos.js'
import { MEDIOS } from './config/medios.js'
import { LARGO_EXTRACTO, TAMANO_VENTANA, TIMEOUT_FEED_MS, USER_AGENT } from './config/parametros.js'
import { construirDetector, recortarTexto } from './dominio/menciones.js'
import { crearNoticia } from './dominio/noticia.js'
import { SECCIONES, validarTipoDeMedio } from './dominio/secciones.js'
import { fusionar } from './dominio/ventana.js'

async function main() {
  const { values } = parseArgs({
    options: { entrada: { type: 'string' }, salida: { type: 'string' } },
  })
  const rutaEntrada = values.entrada ?? './datos/noticias.json'
  const rutaSalida = values.salida ?? rutaEntrada

  for (const medio of MEDIOS) validarTipoDeMedio(medio.tipo)

  const detector = construirDetector(CONCEPTOS)
  const fuente = crearFuenteRss({ timeoutMs: TIMEOUT_FEED_MS, userAgent: USER_AGENT })
  const repositorio = crearRepositorioJson(rutaEntrada, rutaSalida)

  const estadoPrevio = await repositorio.cargar()
  const previas = estadoPrevio?.noticias ?? []
  const ahora = new Date().toISOString()

  const resultados = await Promise.allSettled(MEDIOS.map((medio) => fuente.obtener(medio)))

  const nuevas = []
  const lineasResumen = []
  resultados.forEach((resultado, indice) => {
    const medio = MEDIOS[indice]
    if (resultado.status === 'rejected') {
      lineasResumen.push(`[FALLO] ${medio.nombre}: ${resultado.reason?.message ?? resultado.reason}`)
      return
    }
    let conMencion = 0
    for (const item of resultado.value) {
      if (!detector.detecta(`${item.titular}\n${item.texto}`)) continue
      const extracto =
        detector.extraerExtracto(item.texto, LARGO_EXTRACTO) ??
        // Mención solo en el titular: extracto sin resaltado.
        [{ texto: recortarTexto(item.texto, LARGO_EXTRACTO), resaltado: false }]
      const noticia = crearNoticia({
        medio,
        titular: item.titular,
        url: item.url,
        fechaMedio: item.fecha,
        fechaDeteccion: ahora,
        extracto,
      })
      if (noticia) {
        nuevas.push(noticia)
        conMencion += 1
      }
    }
    lineasResumen.push(`[OK] ${medio.nombre}: ${resultado.value.length} ítems, ${conMencion} con mención`)
  })

  const noticias = fusionar(previas, nuevas, TAMANO_VENTANA)

  // `generadoEn` cambia solo si cambió el contenido: una corrida sin novedades
  // produce un archivo byte-idéntico (sin commit en la rama de datos).
  const contenidoIgual =
    estadoPrevio != null && JSON.stringify(estadoPrevio.noticias) === JSON.stringify(noticias)
  await repositorio.guardar({
    generadoEn: contenidoIgual ? estadoPrevio.generadoEn : ahora,
    tamanoVentana: TAMANO_VENTANA,
    secciones: SECCIONES,
    noticias,
  })

  console.log(lineasResumen.join('\n'))
  console.log(
    `Ventana: ${previas.length} previas + ${nuevas.length} detectadas -> ${noticias.length} publicadas (tope ${TAMANO_VENTANA})`,
  )

  const feedsFallidos = resultados.filter((resultado) => resultado.status === 'rejected').length
  if (feedsFallidos === MEDIOS.length) {
    // Con todos los feeds caídos no hay corrida útil: fallar evita desplegar
    // una "actualización" que no actualizó nada y delata el problema.
    console.error('Todos los feeds fallaron; corrida marcada como fallida.')
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(`Error fatal: ${error.stack ?? error}`)
  process.exitCode = 1
})
