import { useState } from 'react'
import { tiempoRelativo } from '../utilidades/fechas.js'

// Indicador de sentimiento "filete lateral": el borde izquierdo de la tarjeta
// toma el color del tono. Sin análisis → neutra (ninguna tarjeta queda sin señal).
const ETIQUETAS_SENTIMIENTO = {
  positiva: 'Cobertura positiva',
  neutra: 'Cobertura neutra',
  negativa: 'Cobertura negativa',
  mixta: 'Cobertura mixta',
}

// Ámbito de la noticia (no del medio): un medio regional puede publicar una
// noticia nacional y un medio extranjero una noticia chilena.
const ETIQUETAS_AMBITO = {
  nacional: 'Nacional',
  regional: 'Regional',
  internacional: 'Internacional',
}

// Ajustes de corte a límite de palabra: un recorte a mitad de palabra
// ("ndo otro, aunque…") se ve descuidado.
function recortarInicioEnPalabra(texto) {
  const idx = texto.indexOf(' ')
  return idx > 0 && idx < 30 ? texto.slice(idx + 1) : texto
}

function recortarFinEnPalabra(texto) {
  const idx = texto.lastIndexOf(' ')
  return idx > 0 && texto.length - idx < 30 ? texto.slice(0, idx) : texto
}

function normalizarComparacion(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ]/g, '')
}

// Muchos feeds repiten el titular como descripción: en ese caso la bajada no
// aporta nada y se ve como texto duplicado dentro de la tarjeta.
function extractoRedundante(extractoSegmentos, titular) {
  if (!extractoSegmentos?.length || !titular) return false
  const extracto = normalizarComparacion(extractoSegmentos.map((s) => s.texto).join(''))
  const tit = normalizarComparacion(titular)
  if (!extracto || !tit) return false
  if (extracto === tit || tit.startsWith(extracto)) return true
  // Extracto = titular + una cola mínima: también es redundante.
  return extracto.startsWith(tit) && extracto.length - tit.length < 30
}

function truncarExtracto(extractoSegmentos, maxChars = 500) {
  if (!extractoSegmentos?.length) return []

  const textoCompleto = extractoSegmentos.map(s => s.texto).join('')
  if (textoCompleto.length <= maxChars) return extractoSegmentos

  // Buscar la mención resaltada (más probable que sea cerca del inicio o centro)
  let posicionMencion = -1
  for (let i = 0; i < extractoSegmentos.length; i++) {
    if (extractoSegmentos[i].resaltado) {
      posicionMencion = extractoSegmentos.slice(0, i).reduce((sum, s) => sum + s.texto.length, 0)
      break
    }
  }

  // Si no hay mención, truncar desde el inicio
  if (posicionMencion === -1) {
    let count = 0
    const resultado = []
    for (const seg of extractoSegmentos) {
      if (count + seg.texto.length <= maxChars) {
        resultado.push(seg)
        count += seg.texto.length
      } else {
        const textoRestante = maxChars - count
        if (textoRestante > 0) {
          resultado.push({
            ...seg,
            texto: recortarFinEnPalabra(seg.texto.slice(0, textoRestante)) + '…',
          })
        }
        break
      }
    }
    return resultado
  }

  // Centrar la mención en la ventana de 500 caracteres
  const inicioOptimo = Math.max(0, posicionMencion - Math.floor(maxChars * 0.3))
  const finOptimo = inicioOptimo + maxChars

  let count = 0
  const resultado = []
  let encontradoInicio = false

  for (const seg of extractoSegmentos) {
    const lenSeg = seg.texto.length
    const finSeg = count + lenSeg

    // ¿Este segmento entra en la ventana?
    if (finSeg > inicioOptimo && count < finOptimo) {
      if (!encontradoInicio) {
        // Primer segmento: recortar desde inicioOptimo, a límite de palabra y con
        // marcador de corte para que nunca arranque a mitad de palabra.
        const offset = Math.max(0, inicioOptimo - count)
        const textoTrimmed = offset > 0
          ? '…' + recortarInicioEnPalabra(seg.texto.slice(offset))
          : seg.texto
        resultado.push({
          ...seg,
          texto: textoTrimmed,
        })
        encontradoInicio = true
      } else {
        // Segmentos intermedios: agregar completo
        resultado.push(seg)
      }

      // ¿Hemos alcanzado el fin?
      if (finSeg >= finOptimo) {
        const overflow = finSeg - finOptimo
        if (overflow > 0) {
          const ultimoIdx = resultado.length - 1
          const recortado = resultado[ultimoIdx].texto.slice(0, -overflow)
          resultado[ultimoIdx].texto = recortarFinEnPalabra(recortado) + '…'
        }
        break
      }
    }

    count += lenSeg
  }

  return resultado.length > 0 ? resultado : extractoSegmentos.slice(0, 1)
}

// Imagen de portada con degradación elegante: si el hotlink falla (medio que
// bloquea, URL caída), no se renderiza nada — nunca el ícono de imagen rota.
function ImagenPortada({ src, alt }) {
  const [falló, setFalló] = useState(false)
  if (!src || falló) return null
  return (
    <div className="tarjeta-imagen">
      <img src={src} alt={alt} loading="lazy" onError={() => setFalló(true)} />
    </div>
  )
}

export default function NoticiaItem({ noticia }) {
  const extractoTruncado = extractoRedundante(noticia.extracto, noticia.titular)
    ? []
    : truncarExtracto(noticia.extracto)
  const sentimiento = ETIQUETAS_SENTIMIENTO[noticia.analisis?.sentimiento]
    ? noticia.analisis.sentimiento
    : 'neutra'

  const clases = [
    'tarjeta',
    `sentimiento-${sentimiento}`,
    noticia.imagen ? 'tarjeta-con-imagen' : '',
  ].join(' ').trim()

  return (
    <article className={clases} title={ETIQUETAS_SENTIMIENTO[sentimiento]}>
      <ImagenPortada src={noticia.imagen} alt="" />
      <div className="tarjeta-cuerpo">
        <div className="tarjeta-meta">
          <span className="chip-medio">{noticia.medioNombre}</span>
          <span className="tarjeta-meta-derecha">
            {ETIQUETAS_AMBITO[noticia.analisis?.ambito] && (
              <span className={`chip-ambito ambito-${noticia.analisis.ambito}`}>
                {ETIQUETAS_AMBITO[noticia.analisis.ambito]}
              </span>
            )}
            <span className="tarjeta-fecha">{tiempoRelativo(noticia.fecha)}</span>
          </span>
        </div>
        <a
          className="tarjeta-titular"
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {noticia.titular}
        </a>
        {extractoTruncado.length > 0 && (
          <p className="tarjeta-extracto">
            {extractoTruncado.map((segmento, indice) =>
              segmento.resaltado ? (
                <mark key={indice}>{segmento.texto}</mark>
              ) : (
                <span key={indice}>{segmento.texto}</span>
              ),
            )}
          </p>
        )}
      </div>
    </article>
  )
}
