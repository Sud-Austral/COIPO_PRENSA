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

## Red de seguridad: Google News

Los feeds RSS por medio tienen un límite estructural: un medio de alto volumen (Bío-Bío,
La Tercera) rota sus ~20 ítems más recientes más rápido de lo que corre el cron, así que
una noticia de CONAF puede aparecer y desaparecer del feed en menos de una hora. Eso
choca de frente con el criterio de "no perder noticias de medios grandes".

Por eso se agregó **Google News** como segunda fuente
(`news.google.com/rss/search?q="CONAF" OR "Corporación Nacional Forestal"`), que indexa
las menciones sin depender de la ventana del feed propio de cada medio. Verificado el
15-07-2026: una sola búsqueda trae ~90-100 resultados de decenas de medios (incluidos los
que el feed propio ya rotó).

Detalles de implementación (ver `collector/src/adaptadores/`):

- **Links directos:** los enlaces de Google News van cifrados (`news.google.com/rss/articles/…`).
  Se resuelven a la URL real del medio con el endpoint interno `batchexecute`
  (`resolver-google-news.js`). **Es una técnica no documentada**: Google ya cambió una vez
  el formato (antes la URL iba en base64), y si vuelve a cambiarlo el resolutor devuelve
  null, no se publica ese ítem, y la página se queda con lo último bueno (no se cae).
- **Caché de resolución** en el propio estado (`resolucionesGoogle`) para no re-resolver lo
  ya conocido y no sobrecargar el endpoint.
- **Exclusión de no-prensa:** `conaf.cl` domina la búsqueda con sus propios comunicados y se
  excluye (`DOMINIOS_EXCLUIDOS` en `config/parametros.js`); el admin puede sumar otros.
- **Clasificación:** un medio de la lista curada que llegue por Google cae en SU sección
  (ej. biobiochile.cl → Radio); los demás van a la sección **"Otros medios"**.
- **Extracto:** Google News no entrega el cuerpo, así que el extracto se arma del titular
  (con la mención resaltada si está ahí); si no, se omite para no duplicar el titular.

Se puede desactivar con `GOOGLE_NEWS_ACTIVO = false` en `config/parametros.js` (quedaría
solo la fuente RSS curada).
