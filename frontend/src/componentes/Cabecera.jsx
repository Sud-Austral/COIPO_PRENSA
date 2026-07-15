import BotonCSV from './BotonCSV.jsx'

const FECHA_LARGA = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const FECHA_HORA = new Intl.DateTimeFormat('es-CL', {
  timeZone: 'America/Santiago',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export default function Cabecera({ generadoEn, noticias, secciones }) {
  const hoy = capitalizar(FECHA_LARGA.format(new Date()))
  return (
    <header className="cabecera">
      <div className="cabecera-interior">
        <div className="cabecera-titulo">
          <span className="marca">Monitor de Prensa</span>
          <span className="marca-conaf">CONAF</span>
          <p className="cabecera-fecha">{hoy}</p>
        </div>
        <div className="cabecera-acciones">
          <p className="actualizado">
            {generadoEn
              ? `Actualizado ${FECHA_HORA.format(new Date(generadoEn)).replace(',', '')} · hora de Chile`
              : 'Sin datos de actualización'}
          </p>
          <BotonCSV noticias={noticias} secciones={secciones} />
        </div>
      </div>
    </header>
  )
}
