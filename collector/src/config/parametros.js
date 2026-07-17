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
// monitoreo de prensa. El admin puede sumar aquí otros (dominio sin "www.").
export const DOMINIOS_EXCLUIDOS = ['conaf.cl']

// Imagen de portada (og:image) en cada tarjeta. Requiere una petición extra por
// noticia nueva (se guarda la URL en la propia ventana, no la imagen). Es
// hotlinking; el frontend oculta la imagen si no carga.
export const IMAGENES_ACTIVO = true

// Tope de descargas de imagen por corrida. La ventana ya guarda las imágenes de
// las noticias previas, así que en régimen se enriquecen pocas por corrida.
export const MAX_IMAGENES_POR_CORRIDA = 1000
