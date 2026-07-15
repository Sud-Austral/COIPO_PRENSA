const FECHA_ITEM = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatearFecha(iso) {
  if (!iso) return ''
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const texto = FECHA_ITEM.format(fecha)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export default function NoticiaItem({ noticia, alterna }) {
  return (
    <article className={alterna ? 'noticia noticia-alterna' : 'noticia'}>
      <div className="medio">{noticia.medioNombre}</div>
      <div className="detalle">
        <a className="titular" href={noticia.url} target="_blank" rel="noopener noreferrer">
          {noticia.titular}
        </a>
        <p className="fecha">
          <i>
            {noticia.medioNombre}&nbsp;&nbsp;{formatearFecha(noticia.fecha)}
          </i>
        </p>
        {noticia.extracto.length > 0 && (
          <p className="extracto">
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
