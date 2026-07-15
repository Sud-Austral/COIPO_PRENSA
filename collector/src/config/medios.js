// Lista de medios monitoreados — la "interfaz de administración" v1 (se edita aquí).
//
// Para agregar un medio:
//   1. Encontrar su feed RSS/Atom (ver docs/MEDIOS.md para el registro de
//      verificación y los medios ya descartados por no tener feed).
//   2. Agregar una línea: { id: 'kebab-unico', nombre: 'Nombre en pantalla',
//      tipo: 'escrita' | 'regional' | 'radio', feedUrl: 'https://...' }
//   3. Probar con `npm start` y revisar el JSON generado.
//
// El `tipo` define la sección del boletín donde aparece (dominio/secciones.js).

export const MEDIOS = [
  {
    id: 'la-tercera',
    nombre: 'La Tercera',
    tipo: 'escrita',
    feedUrl: 'https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml',
  },
  {
    id: 'diario-el-dia',
    nombre: 'Diario El Día',
    tipo: 'regional',
    feedUrl: 'https://www.diarioeldia.cl/rss/noticias/',
  },
  {
    id: 'el-ovallino',
    nombre: 'El Ovallino',
    tipo: 'regional',
    feedUrl: 'https://www.elovallino.cl/rss',
  },
  {
    id: 'radio-biobio',
    nombre: 'Radio Bío-Bío',
    tipo: 'radio',
    feedUrl: 'https://www.biobiochile.cl/static/feed-rss',
  },
]
