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
  //Agregados

    {
      id: 'radio-talca',
      nombre: 'Radio Talca',
      tipo: 'radio',
      feedUrl: 'https://diariotalca.cl/feed',
    },
    // Nacionales

  {
    id: 'cooperativa',
    nombre: 'Cooperativa',
    tipo: 'radio',
    feedUrl: 'https://www.cooperativa.cl/noticias/stat/rss/rss.xml',
  },

  {
    id: 'adn',
    nombre: 'ADN Radio',
    tipo: 'radio',
    feedUrl: 'https://www.adnradio.cl/feed/',
  },

  {
    id: 'el-mostrador',
    nombre: 'El Mostrador',
    tipo: 'otros',
    feedUrl: 'https://www.elmostrador.cl/feed/',
  },

  {
    id: 'el-dinamo',
    nombre: 'El Dínamo',
    tipo: 'otros',
    feedUrl: 'https://www.eldinamo.cl/feed/',
  },

  {
    id: 'el-desconcierto',
    nombre: 'El Desconcierto',
    tipo: 'otros',
    feedUrl: 'https://www.eldesconcierto.cl/feed/',
  },

  {
    id: 'the-clinic',
    nombre: 'The Clinic',
    tipo: 'otros',
    feedUrl: 'https://www.theclinic.cl/feed/',
  },

  {
    id: 'cambio21',
    nombre: 'Cambio21',
    tipo: 'otros',
    feedUrl: 'https://cambio21.cl/feed/',
  },

  {
    id: 'el-ciudadano',
    nombre: 'El Ciudadano',
    tipo: 'otros',
    feedUrl: 'https://www.elciudadano.com/feed/',
  },

  {
    id: 'ciper',
    nombre: 'CIPER Chile',
    tipo: 'investigacion',
    feedUrl: 'https://www.ciperchile.cl/feed/',
  },

  {
    id: 'diario-financiero',
    nombre: 'Diario Financiero',
    tipo: 'economia',
    feedUrl: 'https://www.df.cl/noticias/site/list/port/rss____1.xml',
  },

  {
    id: 'pulso',
    nombre: 'Pulso',
    tipo: 'economia',
    feedUrl: 'https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml',
  },

  // Regionales

  {
    id: 'la-discusion',
    nombre: 'La Discusión',
    tipo: 'regional',
    feedUrl: 'https://www.ladiscusion.cl/feed/',
  },

  {
    id: 'el-rancaguino',
    nombre: 'El Rancagüino',
    tipo: 'regional',
    feedUrl: 'https://www.elrancaguino.cl/feed/',
  },

  {
    id: 'la-prensa-austral',
    nombre: 'La Prensa Austral',
    tipo: 'regional',
    feedUrl: 'https://laprensaaustral.cl/feed/',
  },

  {
    id: 'el-naveghable',
    nombre: 'El Naveghable',
    tipo: 'regional',
    feedUrl: 'https://www.elnaveghable.cl/feed/',
  },

  {
    id: 'diario-talca',
    nombre: 'Diario Talca',
    tipo: 'regional',
    feedUrl: 'https://diariotalca.cl/feed/',
  },

  {
    id: 'el-centro',
    nombre: 'Diario El Centro',
    tipo: 'regional',
    feedUrl: 'https://www.diarioelcentro.cl/feed/',
  },

  {
    id: 'el-tipografo',
    nombre: 'El Tipógrafo',
    tipo: 'regional',
    feedUrl: 'https://eltipografo.cl/feed/',
  },

  {
    id: 'diario-constitucion',
    nombre: 'Diario Constitución',
    tipo: 'regional',
    feedUrl: 'https://www.diarioconstitucion.cl/feed/',
  },

  // Universitarios

  {
    id: 'uchile',
    nombre: 'Radio Universidad de Chile',
    tipo: 'radio',
    feedUrl: 'https://radio.uchile.cl/feed/',
  },

]
