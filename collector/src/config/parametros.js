// Parámetros operativos de la recolección.

// Tamaño de la ventana móvil de noticias publicadas (REQUISITOS.md §3.3:
// "~100", número referencial y configurable).
export const TAMANO_VENTANA = 100

// Largo máximo (en caracteres) del extracto mostrado por noticia.
export const LARGO_EXTRACTO = 280

// Timeout por feed. Un medio lento no debe frenar la corrida completa.
export const TIMEOUT_FEED_MS = 20_000

// User-Agent identificable: cortesía con los medios y facilidad de contacto.
export const USER_AGENT =
  'COIPO_PRENSA/1.0 (monitor de prensa CONAF; https://github.com/conaf/COIPO_PRENSA)'
