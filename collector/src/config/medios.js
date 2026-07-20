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
    tipo: 'digital',
    feedUrl: 'https://www.ciperchile.cl/feed/',
  },

  {
    id: 'diario-financiero',
    nombre: 'Diario Financiero',
    tipo: 'digital',
    feedUrl: 'https://www.df.cl/noticias/site/list/port/rss____1.xml',
  },

  {
    id: 'pulso',
    nombre: 'Pulso',
    tipo: 'digital',
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

  // Principales nacionales (verificados 20-07-2026, ver docs/MEDIOS.md)

  {
    id: 'la-cuarta',
    nombre: 'La Cuarta',
    tipo: 'escrita',
    feedUrl: 'https://www.lacuarta.com/arc/outboundfeeds/rss/?outputType=xml',
  },

  {
    id: 'publimetro',
    nombre: 'Publimetro',
    tipo: 'escrita',
    feedUrl: 'https://www.publimetro.cl/arc/outboundfeeds/rss/?outputType=xml',
  },

  {
    id: 'la-nacion',
    nombre: 'La Nación',
    tipo: 'digital',
    feedUrl: 'https://www.lanacion.cl/feed/',
  },

  {
    id: 'ex-ante',
    nombre: 'Ex-Ante',
    tipo: 'digital',
    // Solo funciona la variante con barra final; /feed sin barra responde 403.
    feedUrl: 'https://www.ex-ante.cl/feed/',
  },

  {
    id: 'el-periodista',
    nombre: 'El Periodista',
    tipo: 'otros',
    feedUrl: 'https://www.elperiodista.cl/feed/',
  },

  {
    id: 'radio-infinita',
    nombre: 'Radio Infinita',
    tipo: 'radio',
    feedUrl: 'https://www.infinita.cl/rss.xml',
  },

  // Del boletín ConectaMedia (verificados 20-07-2026, ver docs/MEDIOS.md)

  {
    id: 'el-pinguino',
    nombre: 'El Pingüino',
    tipo: 'regional',
    feedUrl: 'https://www.elpinguino.com/feed/',
  },

  {
    id: 'noticias-malleco',
    nombre: 'Las Noticias de Malleco',
    tipo: 'regional',
    feedUrl: 'https://lasnoticiasdemalleco.cl/feed/',
  },

  {
    id: 'el-observador',
    nombre: 'El Observador',
    tipo: 'regional',
    feedUrl: 'https://www.observador.cl/feed/',
  },

  // Regionales norte a sur (verificados 20-07-2026, ver docs/MEDIOS.md)

  {
    id: 'el-longino',
    nombre: 'Diario El Longino',
    tipo: 'regional',
    feedUrl: 'https://www.diariolongino.cl/feed/',
  },

  {
    id: 'diario-antofagasta',
    nombre: 'El Diario de Antofagasta',
    tipo: 'regional',
    feedUrl: 'https://www.diarioantofagasta.cl/feed/',
  },

  {
    id: 'chanarcillo',
    nombre: 'Diario Chañarcillo',
    tipo: 'regional',
    feedUrl: 'https://www.chanarcillo.cl/feed/',
  },

  {
    id: 'atacama-noticias',
    nombre: 'Atacama Noticias',
    tipo: 'regional',
    feedUrl: 'https://www.atacamanoticias.cl/feed/',
  },

  {
    id: 'el-trabajo',
    nombre: 'Diario El Trabajo',
    tipo: 'regional',
    // Única variante viva: las rutas /feed y /rss responden 404.
    feedUrl: 'https://www.eltrabajo.cl/?feed=rss2',
  },

  {
    id: 'g5noticias',
    nombre: 'G5noticias',
    tipo: 'regional',
    feedUrl: 'https://www.g5noticias.cl/feed/',
  },

  {
    id: 'el-heraldo',
    nombre: 'Diario El Heraldo',
    tipo: 'regional',
    // OJO: /feed/ CON barra final devuelve HTML; la ruta correcta es sin barra.
    feedUrl: 'https://www.diarioelheraldo.cl/feed',
  },

  {
    id: 'la-tribuna',
    nombre: 'La Tribuna',
    tipo: 'regional',
    feedUrl: 'https://www.latribuna.cl/rss/global.xml',
  },

  {
    id: 'diario-concepcion',
    nombre: 'Diario Concepción',
    tipo: 'regional',
    feedUrl: 'https://www.diarioconcepcion.cl/rss.xml',
  },

  {
    id: 'sabes',
    nombre: 'Sabes.cl',
    tipo: 'regional',
    feedUrl: 'https://www.sabes.cl/feed/',
  },

  {
    id: 'el-insular',
    nombre: 'El Insular',
    tipo: 'regional',
    feedUrl: 'https://www.elinsular.cl/feed/',
  },

  // Nacionales y temáticos (verificados 20-07-2026)

  {
    id: 'el-siglo',
    nombre: 'El Siglo',
    tipo: 'otros',
    feedUrl: 'https://www.elsiglo.cl/feed/',
  },

  {
    id: 'cronica-digital',
    nombre: 'Crónica Digital',
    tipo: 'otros',
    feedUrl: 'https://www.cronicadigital.cl/feed/',
  },

  {
    id: 'la-voz-de-los-que-sobran',
    nombre: 'La Voz de los que Sobran',
    tipo: 'otros',
    feedUrl: 'https://lavozdelosquesobran.cl/feed/',
  },

  {
    id: 'pais-circular',
    nombre: 'País Circular',
    tipo: 'digital',
    feedUrl: 'https://www.paiscircular.cl/feed/',
  },

  {
    id: 'diario-sustentable',
    nombre: 'Diario Sustentable',
    tipo: 'digital',
    feedUrl: 'https://www.diariosustentable.com/feed/',
  },

  // Radios (verificadas 20-07-2026)

  {
    id: 'radio-futuro',
    nombre: 'Radio Futuro',
    tipo: 'radio',
    feedUrl: 'https://www.futuro.cl/feed/',
  },

  {
    id: 'radio-concierto',
    nombre: 'Radio Concierto',
    tipo: 'radio',
    feedUrl: 'https://www.concierto.cl/feed/',
  },

  {
    id: 'radio-nuevo-mundo',
    nombre: 'Radio Nuevo Mundo',
    tipo: 'radio',
    feedUrl: 'https://www.radionuevomundo.cl/feed/',
  },

  {
    id: 'radio-santa-maria',
    nombre: 'Radio Santa María',
    tipo: 'radio',
    feedUrl: 'https://radiosantamaria.cl/feed/',
  },

  // Universitarios

  {
    id: 'uchile',
    nombre: 'Radio Universidad de Chile',
    tipo: 'radio',
    feedUrl: 'https://radio.uchile.cl/feed/',
  },

  {
    id: 'radio-udec',
    nombre: 'Radio UdeC',
    tipo: 'radio',
    feedUrl: 'https://www.radioudec.cl/feed/',
  },

  {
    id: 'radio-jgm',
    nombre: 'Radio JGM',
    tipo: 'radio',
    feedUrl: 'https://radiojgm.uchile.cl/feed/',
  },

]

// Medios sin RSS que publican sitemap de noticias (formato Google News sitemap).
// Los recolecta adaptadores/fuente-sitemap-news.js (Fuente 3 en main.js): el
// sitemap solo trae URL + titular + fecha, así que el cuerpo se descarga para
// detectar la mención (con tope MAX_DESCARGAS_SITEMAP_POR_CORRIDA).
export const MEDIOS_SITEMAP = [
  {
    id: 'meganoticias',
    nombre: 'Meganoticias',
    tipo: 'tv',
    sitemapUrl: 'https://www.meganoticias.cl/sitemaps/sitemap-news.xml',
  },
  {
    id: 'cnn-chile',
    nombre: 'CNN Chile',
    tipo: 'tv',
    sitemapUrl: 'https://www.cnnchile.com/_files/sitemaps/sitemap_news.xml',
  },
  {
    id: 'radio-pauta',
    nombre: 'Radio Pauta',
    // Usa prefijo de namespace "n:" en vez de "news:" (el parser lo detecta solo).
    tipo: 'radio',
    sitemapUrl: 'https://www.pauta.cl/sitemap_news.xml',
  },
  {
    id: 'el-libero',
    nombre: 'El Líbero',
    tipo: 'digital',
    sitemapUrl: 'https://ellibero.cl/news-sitemap.xml',
  },
  {
    id: 'el-divisadero',
    nombre: 'El Divisadero',
    tipo: 'regional',
    sitemapUrl: 'https://www.eldivisadero.cl/news-sitemap.php',
  },
  {
    id: 'puranoticia',
    nombre: 'Puranoticia',
    tipo: 'regional',
    sitemapUrl: 'https://puranoticia.pnt.cl/cms/site/sitemap_news.xml',
  },
  {
    id: 'la-hora',
    nombre: 'La Hora',
    // Usa prefijo de namespace "n:" (el parser lo detecta solo).
    tipo: 'digital',
    sitemapUrl: 'https://lahora.cl/sitemap/news-sitemap.xml',
  },
  {
    id: 'araucania-diario',
    nombre: 'Araucanía Diario',
    tipo: 'regional',
    sitemapUrl: 'https://www.araucaniadiario.cl/news_sitemap.xml',
  },
  {
    id: 'radio-polar',
    nombre: 'Radio Polar',
    tipo: 'radio',
    sitemapUrl: 'https://www.radiopolar.com/sitemap/google-news/sitemap.xml',
  },
]
