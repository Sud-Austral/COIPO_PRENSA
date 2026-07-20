const SENTIMIENTOS_COLORES = {
  positiva: { color: '#1E7A4A', bg: '#E3F0E8' },
  neutra: { color: '#5B6B66', bg: '#E9EDEB' },
  negativa: { color: '#B3402A', bg: '#F6E7E2' },
  mixta: { color: '#C08A2D', bg: '#F6EEDD' },
}

export default function ChipSentimiento({ sentimiento }) {
  if (!sentimiento || !SENTIMIENTOS_COLORES[sentimiento]) return null

  const estilos = SENTIMIENTOS_COLORES[sentimiento]
  const etiqueta =
    sentimiento.charAt(0).toUpperCase() +
    sentimiento.slice(1).replace(/a$/, 'a')

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        background: estilos.bg,
        color: estilos.color,
        fontSize: '0.75rem',
        fontWeight: '500',
      }}
    >
      {etiqueta}
    </span>
  )
}
