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
      title={`Descargar ${noticias.length} noticias en CSV`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 3v11m0 0l-4-4m4 4l4-4M5 19h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Descargar CSV
    </button>
  )
}
