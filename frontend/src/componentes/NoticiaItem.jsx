import { useState } from 'react'

const FECHA_ITEM = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatearFecha(iso) {
  if (!iso) return ''
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  return FECHA_ITEM.format(fecha).replace('.', '')
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
  return (
    <article className={noticia.imagen ? 'tarjeta tarjeta-con-imagen' : 'tarjeta'}>
      <ImagenPortada src={noticia.imagen} alt="" />
      <div className="tarjeta-cuerpo">
        <div className="tarjeta-meta">
          <span className="chip-medio">{noticia.medioNombre}</span>
          <span className="tarjeta-fecha">{formatearFecha(noticia.fecha)}</span>
        </div>
        <a
          className="tarjeta-titular"
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {noticia.titular}
        </a>
        {noticia.extracto.length > 0 && (
          <p className="tarjeta-extracto">
            {noticia.extracto.map((segmento, indice) =>
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
