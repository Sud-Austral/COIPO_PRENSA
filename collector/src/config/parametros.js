// Parámetros operativos de la recolección.

// Tamaño de la ventana móvil de noticias publicadas (REQUISITOS.md §3.3:
// "~100", número referencial y configurable).
export const TAMANO_VENTANA = 1000

// Largo máximo (en caracteres) del extracto mostrado por noticia.
export const LARGO_EXTRACTO = 2800

// Timeout por feed. Un medio lento no debe frenar la corrida completa.
export const TIMEOUT_FEED_MS = 200_000

// User-Agent identificable: cortesía con los medios y facilidad de contacto.
export const USER_AGENT =
  'COIPO_PRENSA/1.0 (monitor de prensa CONAF; https://github.com/conaf/COIPO_PRENSA)'

// Red de seguridad de cobertura vía Google News. Captura medios fuera de la
// lista curada y noticias que el feed propio del medio ya rotó (ver
// docs/REQUISITOS.md, criterio de no perder medios grandes).
export const GOOGLE_NEWS_ACTIVO = true

// Parámetros de localización del feed de Google News (Chile, español).
export const GOOGLE_NEWS_PARAMS = { hl: 'es-419', gl: 'CL', ceid: 'CL:es-419' }

// Tope de resoluciones de enlaces por corrida (cada resolución = 2 peticiones al
// endpoint interno de Google). La caché evita re-resolver lo ya conocido, así
// que en régimen se resuelven pocos por corrida.
export const MAX_RESOLUCIONES_POR_CORRIDA = 900

// Dominios que NO son prensa y deben excluirse de la red de Google News. El
// propio sitio de CONAF domina la búsqueda con sus comunicados y no es
// monitoreo de prensa. Las redes sociales están fuera de alcance v1 (REQUISITOS).
// El admin puede sumar aquí otros (dominio sin "www.").
export const DOMINIOS_EXCLUIDOS = [
  'conaf.cl',
  'instagram.com',
  'facebook.com',
  'x.com',
  'twitter.com',
  'tiktok.com',
  'youtube.com',
]

// --- Fuente 3: sitemaps de noticias ---

// Activar la recolección vía sitemaps de noticias (config/medios.js: MEDIOS_SITEMAP).
// Al desactivar se conserva la caché sitemapVisto tal cual (no se re-procesa al volver).
export const SITEMAP_ACTIVO = true

// Tope de descargas de página por corrida para detectar menciones en el cuerpo.
// Meganoticias publica ~3 notas/hora; el arranque (~140 URLs del sitemap) drena en
// ~4 corridas sin perder nada porque el sitemap retiene ~48 h y las URLs no
// procesadas no se marcan como vistas.
export const MAX_DESCARGAS_SITEMAP_POR_CORRIDA = 40

// Imagen de portada (og:image) en cada tarjeta. Requiere una petición extra por
// noticia nueva (se guarda la URL en la propia ventana, no la imagen). Es
// hotlinking; el frontend oculta la imagen si no carga.
export const IMAGENES_ACTIVO = true

// Tope de descargas de imagen por corrida. La ventana ya guarda las imágenes de
// las noticias previas, así que en régimen se enriquecen pocas por corrida.
export const MAX_IMAGENES_POR_CORRIDA = 1000

// --- Enriquecimiento NLP (Fase 1) ---

// Activar pipeline de enriquecimiento (análisis de sentimiento, categorías, entidades, etc.).
export const ENRIQUECIMIENTO_ACTIVO = true

// Tope de descargas de contenido (imagen + texto + autor + fecha) por corrida.
// Integra lo que era MAX_IMAGENES_POR_CORRIDA. La ventana conserva el enriquecimiento
// de previas; se enriquecen solo las nuevas. En régimen pocas por corrida.
export const MAX_DESCARGAS_POR_CORRIDA = 1000

// Versión del pipeline de análisis. Usado para re-enriquecer previas si la lógica cambia.
// Las previas con version < VERSION_ANALISIS se re-enriquecen sin red (con titular+extracto).
// v2: stopwords reescritas (la lista v1 dejaba pasar "que", "las", "los" como keywords).
// v3: agrega `ambito` (nacional/regional/internacional) al análisis.
export const VERSION_ANALISIS = 3

// --- Eventos (Fase 2) ---

// Umbral de similitud para agrupar noticias en un evento (0..1).
// 0.6*Jaccard(tokens) + 0.4*Jaccard(entidades).
export const UMBRAL_EVENTO = 0.35

// Ventana temporal de agrupación: noticias dentro de N días de la semilla se consideran.
export const VENTANA_EVENTO_DIAS = 14

// Umbral de similaridad para marcar como duplicado (misma historia en otro medio).
export const UMBRAL_DUPLICADO = 0.85

// --- Histórico ---

// Máximo de días a retener en el histórico (rotación). Después se descartan registros.
export const HISTORICO_MAX_DIAS = 400
