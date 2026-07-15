# Registro de verificación de medios

Criterio acordado con SECOM (docs/REQUISITOS.md): **"si es alcanzable [con
herramientas gratuitas], entra; si no, no"**. Este registro documenta qué medios se
verificaron, con qué resultado y cuándo — es el respaldo de la cobertura real de la
lista y el insumo para las preguntas abiertas 2, 8 y 12 del documento de requisitos.

## Medios activos (en `collector/src/config/medios.js`)

| Medio | Sección | Feed | Verificado | Notas |
|---|---|---|---|---|
| La Tercera | Prensa Escrita | `https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml` | 2026-07-14 | RSS válido, ~100 ítems, links directos. |
| Diario El Día | Prensa Regional | `https://www.diarioeldia.cl/rss/noticias/` | 2026-07-14 | RSS 2.0, ~200 ítems. Existe índice con +30 canales temáticos en `/rss`. |
| El Ovallino | Prensa Regional | `https://www.elovallino.cl/rss` | 2026-07-14 | RSS válido. Medio de baja frecuencia de publicación (~10 ítems). |
| Radio Bío-Bío | Radio | `https://www.biobiochile.cl/static/feed-rss` | 2026-07-14 | RSS válido y muy activo. **Sirve `Content-Type: application/octet-stream`**: el adaptador no valida content-type a propósito. |

## Medios del boletín antiguo aún sin feed encontrado

| Medio | Estado | Próximo intento |
|---|---|---|
| Radio Agricultura | `/feed/` responde 404; portada sin link RSS | Probar `wp-json`, sitemap de noticias |
| Radio Infinita | `/feed/` responde 404 | Probar `wp-json`, sitemap de noticias |
| El Pingüino (Punta Arenas) | Portada carga; sin RSS visible en el HTML | Buscar sitemap; ofrece boletín por email/WhatsApp |
| El Mercurio de Valparaíso | Red soychile.cl, sin feed evidente | Investigar feed por ciudad de soychile |
| El Austral de Temuco | Red soychile.cl, sin feed evidente | Investigar feed por ciudad de soychile |
| La Crónica de Chillán | No probado aún | Verificar (posible vía ladiscusion.cl) |

## Cómo verificar y agregar un medio

1. Buscar el feed: probar `/rss`, `/feed`, `/feed/`, `?feed=rss2`, `/arc/outboundfeeds/rss/`,
   el HTML de la portada (`<link type="application/rss+xml">`) y el `sitemap.xml`.
2. Confirmar que el feed responde y trae ítems con `<link>` directo al medio:

   ```bash
   curl -A "COIPO_PRENSA/1.0" <feedUrl>
   ```

3. Agregar la entrada en `collector/src/config/medios.js` (id, nombre, tipo, feedUrl).
4. Ejecutar `npm start` dentro de `collector/` y revisar el JSON generado en `datos/`.
5. Registrar el resultado en este archivo (también los fracasos: evita repetir trabajo).

## Fuentes descartadas por diseño

- **Google News RSS** (`news.google.com/rss/search?q=CONAF&hl=es-419&gl=CL&ceid=CL:es-419`):
  funciona y agrega muchos medios, pero sus links son redirects codificados de Google,
  no directos al medio (violaría el criterio de aceptación de links directos), y desde
  ~2024 no se resuelven de forma estable. Queda como candidato para la v2 y como
  herramienta **manual** de auditoría de cobertura: revisar de vez en cuando si ese feed
  trae menciones de medios que la lista no cubre.
