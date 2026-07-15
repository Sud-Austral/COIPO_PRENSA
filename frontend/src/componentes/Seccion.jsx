import NoticiaItem from './NoticiaItem.jsx'

export default function Seccion({ seccion, noticias }) {
  if (noticias.length === 0) return null
  return (
    <section aria-label={seccion.nombre}>
      <h2 className="titulo-seccion">{seccion.nombre}</h2>
      {noticias.map((noticia, indice) => (
        <NoticiaItem key={noticia.id} noticia={noticia} alterna={indice % 2 === 0} />
      ))}
    </section>
  )
}
