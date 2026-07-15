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

export default function NoticiaItem({ noticia }) {
  return (
    <article className="tarjeta">
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
    </article>
  )
}
