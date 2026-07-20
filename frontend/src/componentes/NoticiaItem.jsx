import { useState } from 'react'
import { tiempoRelativo } from '../utilidades/fechas.js'

const EMOJIS_SENTIMIENTO = {
  positiva: '😊',
  neutra: '😐',
  negativa: '😞',
  mixta: '🤔',
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
            texto: seg.texto.slice(0, textoRestante) + '…',
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
        // Primer segmento: trimear desde inicioOptimo
        const offset = Math.max(0, inicioOptimo - count)
        const textoTrimmed = seg.texto.slice(offset)
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
          resultado[ultimoIdx].texto = resultado[ultimoIdx].texto.slice(0, -overflow) + '…'
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
  const extractoTruncado = truncarExtracto(noticia.extracto)

  return (
    <article className={noticia.imagen ? 'tarjeta tarjeta-con-imagen' : 'tarjeta'}>
      <ImagenPortada src={noticia.imagen} alt="" />
      <div className="tarjeta-cuerpo">
        <div className="tarjeta-meta">
          <span className="chip-medio">{noticia.medioNombre}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {noticia.analisis?.sentimiento && (
              <span title={noticia.analisis.sentimiento} style={{ fontSize: '1.2rem' }}>
                {EMOJIS_SENTIMIENTO[noticia.analisis.sentimiento] || ''}
              </span>
            )}
            <span className="tarjeta-fecha">{tiempoRelativo(noticia.fecha)}</span>
          </div>
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
