// Puerto: extractor de contenido. Implementación: adaptadores/extractor-contenido.js
//
// Interfaz: crearExtractorContenido({ timeoutMs, userAgent }) → extractor
// extractor.obtenerContenido(url) → {imagen, texto, autor, fechaPublicacion} | null
//
// La función NUNCA lanza (fail-open). Devuelve null si hay error.
// imagen: URL HTTPS o null
// texto: string (máx 5000 chars) o string vacío
// autor: string o null
// fechaPublicacion: ISO-8601 o null

export {}
