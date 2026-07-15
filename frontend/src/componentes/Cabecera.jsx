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

export default function Cabecera({ generadoEn }) {
  const hoy = capitalizar(FECHA_LARGA.format(new Date()))
  return (
    <header>
      <h1 className="titulo">Boletín de Prensa CONAF — {hoy}</h1>
      <div className="banda-verde">Temas Conaf</div>
      <p className="actualizado">
        Última actualización:{' '}
        {generadoEn ? `${FECHA_HORA.format(new Date(generadoEn)).replace(',', '')} (hora de Chile)` : '—'}
      </p>
    </header>
  )
}
