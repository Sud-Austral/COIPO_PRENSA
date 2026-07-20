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
| El Pingüino | Prensa Regional | `https://www.elpinguino.com/feed/` | 2026-07-20 | RSS vivo, 40 ítems, links directos (corrige la ficha anterior que lo daba sin RSS). Del boletín ConectaMedia. |
| Las Noticias de Malleco | Prensa Regional | `https://lasnoticiasdemalleco.cl/feed/` | 2026-07-20 | RSS WordPress, 10 ítems. Del boletín ConectaMedia. |
| El Observador (Quillota) | Prensa Regional | `https://www.observador.cl/feed/` | 2026-07-20 | RSS WordPress, 10 ítems; en la corrida de verificación aportó 1 mención. Del boletín ConectaMedia. |
| La Cuarta | Prensa Escrita | `https://www.lacuarta.com/arc/outboundfeeds/rss/?outputType=xml` | 2026-07-20 | RSS Arc (grupo Copesa), 100 ítems. Las variantes /feed y /rss devuelven HTML. |
| Publimetro | Prensa Escrita | `https://www.publimetro.cl/arc/outboundfeeds/rss/?outputType=xml` | 2026-07-20 | RSS Arc, 100 ítems. Las demás variantes cortan la conexión. |
| La Nación | Digital | `https://www.lanacion.cl/feed/` | 2026-07-20 | RSS WordPress, 10 ítems, links directos. |
| Ex-Ante | Digital | `https://www.ex-ante.cl/feed/` | 2026-07-20 | RSS, 10 ítems. **Solo funciona con barra final**; `/feed` sin barra responde 403. |
| El Periodista | Otros | `https://www.elperiodista.cl/feed/` | 2026-07-20 | RSS WordPress, 10 ítems. |
| Radio Infinita | Radio | `https://www.infinita.cl/rss.xml` | 2026-07-20 | RSS, 10 ítems (corrige la ficha anterior: la ruta correcta es /rss.xml, no /feed/). |
| Meganoticias | Televisión | sitemap: `https://www.meganoticias.cl/sitemaps/sitemap-news.xml` | 2026-07-20 | Piloto de la Fuente 3 (sitemap de noticias). ~140 URLs, retención ~48 h. |
| CNN Chile | Televisión | sitemap: `https://www.cnnchile.com/_files/sitemaps/sitemap_news.xml` | 2026-07-20 | Google News sitemap, 200 URLs, declarado en robots.txt. El RSS devuelve HTML. |
| Radio Pauta | Radio | sitemap: `https://www.pauta.cl/sitemap_news.xml` | 2026-07-20 | Google News sitemap con prefijo de namespace `n:` (el parser lo detecta). 100 URLs. |
| El Líbero | Digital | sitemap: `https://ellibero.cl/news-sitemap.xml` | 2026-07-20 | Google News sitemap, 27 URLs (incluye avisos legales; los filtra la detección de menciones). RSS con redirección rota. |
| El Divisadero | Prensa Regional | sitemap: `https://www.eldivisadero.cl/news-sitemap.php` | 2026-07-20 | Google News sitemap (XML indentado, títulos sin sufijo), 13 URLs. Del boletín ConectaMedia. |
| Puranoticia | Prensa Regional | sitemap: `https://puranoticia.pnt.cl/cms/site/sitemap_news.xml` | 2026-07-20 | Google News sitemap con CDATA, 109 URLs. Del boletín ConectaMedia. |

## Medios del boletín ConectaMedia: candidatos a Fuente 3 (sitemap, fase 2)

Verificados el 2026-07-20: sin RSS utilizable, pero con sitemap de noticias que el
adaptador `fuente-sitemap-news.js` ya soporta (multilínea, sin sufijo de título, CDATA).
Para darlos de alta basta agregarlos a `MEDIOS_SITEMAP` en `config/medios.js` y
verificar una corrida.

| Medio | Sitemap | Nota |
|---|---|---|
| Radio Duna | `https://duna.cl/sitemaps/articles.xml` (vía sitemapindex) | Verificado 2026-07-20: urlset de 45.000 URLs **sin** `news:news`, sin fechas por hora ni títulos — no sirve como fuente de noticias con el adaptador actual. |
| Red soychile.cl | `https://www.soychile.cl/sitemap.xml` | Verificado 2026-07-20: solo 61 landing pages de secciones/ciudades, 0 artículos, 0 `news:news`. No sirve como fuente. |
| Red El Mercurio regional (elsur.cl, mercuriovalpo.cl, estrellaiquique.cl, australtemuco.cl, lidersanantonio.cl) | `https://www.<dominio>/sitemap.xml` | Sitemapindex compartido de ediciones impresas por diario; investigar sub-sitemaps (puede que solo liste portadas del papel). |

## Medios descartados (con evidencia)

| Medio | Estado (2026-07-20) |
|---|---|
| Emol / El Mercurio | WAF corta la conexión en todas las rutas de feed y sitemap-news; el sitemapindex declarado (208 sub-sitemaps anuales) no trae `news:news` ni fechas. |
| 24 Horas (TVN) | WAF corta feeds y sitemap-news; el sitemapindex mensual (.gz) existe pero sin `news:news`. |
| T13 | Todas las variantes de feed y sitemap-news dan 404; `sitemap.xml` (Drupal) trae solo la home. |
| CHV Noticias | CDN catch-all: TODA ruta responde 200 con la portada HTML — imposible descubrir un feed vía HTTP. |
| La Segunda | Catch-all + e-paper; el sitemapindex anual no trae `news:news` ni fechas por URL. |
| Radio USACH | Catch-all total: hasta `robots.txt` devuelve la misma página HTML. |
| Interferencia | RSS vivo (`/rss.xml`) pero con `<link>` **malformado que da 404** (la URL real viene incrustada en el título). Agregarlo publicaría links rotos (error inaceptable SECOM): requiere manejo especial en el adaptador antes de darlo de alta. |
| Radio Agricultura | `/feed/` corta la conexión (WAF); `sitemap.xml` responde 200 con cuerpo vacío. Reintentar más adelante. |
| Digital FM | `/feed/` responde RSS válido pero con **0 ítems** (radio musical sin pauta escrita propia). |
| El Labrador (Melipilla) | `ellabrador.cl` no resuelve DNS — medio aparentemente desaparecido. |
| El Magallanes | `elmagallanes.com`/`.cl` no resuelven; su contenido lo cubre La Prensa Austral (mismo grupo, ya activa). |
| Las Últimas Noticias | ePaper sin artículos web indexables; robots sin sitemap. Fuera por el criterio "si es alcanzable, entra". |
| La Crónica de Chillán | No probado aún; posible vía ladiscusion.cl (mismo grupo). |

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

## Fuente 3: sitemaps de noticias

Para medios **sin RSS** que publican un sitemap de noticias (formato Google News
sitemap, `<urlset xmlns:news>`): se listan en `MEDIOS_SITEMAP` de `config/medios.js`
con `{id, nombre, tipo, sitemapUrl}` y los recolecta
`adaptadores/fuente-sitemap-news.js`. Piloto: Meganoticias (sección Televisión).

Cómo funciona (ver comentarios del adaptador):

- El sitemap trae URL + titular + fecha, **sin cuerpo**. Para detectar la mención en
  el texto (no solo el titular), cada URL nueva se descarga con el extractor de
  contenido, con tope `MAX_DESCARGAS_SITEMAP_POR_CORRIDA` (parametros.js).
- **Caché `sitemapVisto`** (persistida en el estado, hermana de `resolucionesGoogle`):
  URLs ya procesadas por medio, ordenadas para no generar commits espurios. Se poda a
  las URLs presentes en el sitemap actual. Las URLs excluidas por tope NO se marcan y
  se reintentan la próxima corrida (el sitemap retiene ~48 h: nada se pierde).
- Más recientes primero; una página rota se emite con texto vacío (el titular aún
  puede matchear) y se marca vista para no quemar presupuesto cada hora.
- Si el sitemap falla, la corrida sigue (`[FALLO] Sitemap …` en el resumen) y la
  caché previa se conserva sin podar.
- Se desactiva con `SITEMAP_ACTIVO = false` (conserva la caché para el regreso).

Para agregar un medio sitemap: verificar la URL con `curl -A "COIPO_PRENSA/1.0" <sitemapUrl>`
(debe ser un `<urlset>` con bloques `<news:news>`), agregarlo a `MEDIOS_SITEMAP`, correr
`npm start` y revisar la línea `[OK] Sitemap <medio>` y el campo `sitemapVisto` del JSON.
