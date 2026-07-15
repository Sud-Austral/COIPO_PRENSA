import { descargarCsv, generarCsv } from '../csv.js'

function nombreArchivo() {
  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()) // en-CA produce AAAA-MM-DD
  return `prensa-conaf-${hoy}.csv`
}

export default function BotonCSV({ noticias, secciones }) {
  return (
    <button
      type="button"
      className="boton-csv"
      disabled={noticias.length === 0}
      onClick={() => descargarCsv(generarCsv(noticias, secciones), nombreArchivo())}
    >
      Descargar CSV ({noticias.length} noticias)
    </button>
  )
}
