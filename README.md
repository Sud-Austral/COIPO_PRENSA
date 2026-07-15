# COIPO_PRENSA — Monitor de Prensa CONAF

Aplicación web estática que muestra las últimas ~100 noticias de medios chilenos donde
se menciona **CONAF** o **Corporación Nacional Forestal**, con el formato del boletín de
prensa diario que la institución recibía de un servicio pagado de clipping. Corre
completa sobre infraestructura gratuita: **GitHub Pages** (sitio) + **GitHub Actions**
(recolección horaria). Sin servidores propios, sin base de datos, costo $0.

> Proyecto de la Unidad de Información y Análisis de CONAF, pensado para ser
> **reutilizado por otras instituciones públicas**: un fork con otros conceptos de
> búsqueda y otra lista de medios produce el mismo boletín para cualquier organismo.

## Cómo funciona

```
        cada hora (GitHub Actions cron)
┌─────────────────────────────────────────────────┐
│ 1. tests del collector (si fallan, no despliega)│
│ 2. lee estado previo   ← rama `data`            │
│ 3. collector: feeds RSS de los medios           │
│    → detecta menciones → fusiona ventana de 100 │
│ 4. guarda estado nuevo → rama `data` (commit)   │
│ 5. build de Vite con el JSON dentro             │
│ 6. deploy a GitHub Pages                        │
└─────────────────────────────────────────────────┘
                          ↓
        https://<owner>.github.io/COIPO_PRENSA/
        (React estático: secciones, resaltado, CSV)
```

- Si una corrida falla, Pages conserva la última versión buena: la página puede quedar
  desactualizada, pero **nunca caída ni en blanco**.
- La rama `data` guarda solo `noticias.json` y su historial: cada corrida con cambios
  es un commit (auditable con `git log`). `main` queda limpia.

## Estructura

- [`collector/`](collector/) — recolector Node (≥22) con **arquitectura hexagonal**:
  - `src/dominio/` — reglas puras y testeadas: detección de menciones (insensible a
    mayúsculas/tildes, con límites de palabra: "CONAFE" no es "CONAF"), deduplicación,
    ventana móvil, secciones.
  - `src/puertos/` — contratos (fuente de noticias, repositorio de estado).
  - `src/adaptadores/` — RSS (`rss-parser`) y archivo JSON. La v2 con base de datos es
    un adaptador nuevo, sin tocar el dominio.
  - `src/config/` — **la "interfaz de administración"**: conceptos y medios se editan aquí.
- [`frontend/`](frontend/) — React + Vite, puramente presentacional: lee
  `data/noticias.json` y lo muestra con la estética del boletín original.
- [`.github/workflows/actualizar.yml`](.github/workflows/actualizar.yml) — el pipeline.
- [`docs/REQUISITOS.md`](docs/REQUISITOS.md) — requisitos y alcance (fuente de verdad).
- [`docs/MEDIOS.md`](docs/MEDIOS.md) — registro de verificación de cada medio.

## Administración (sin interfaz: se edita el código)

**Agregar o quitar un concepto de búsqueda** — `collector/src/config/conceptos.js`:

```js
export const CONCEPTOS = ['CONAF', 'Corporación Nacional Forestal']
```

**Agregar o quitar un medio** — `collector/src/config/medios.js` (ver el procedimiento
de verificación en [docs/MEDIOS.md](docs/MEDIOS.md)):

```js
{ id: 'la-tercera', nombre: 'La Tercera', tipo: 'escrita', feedUrl: 'https://...' }
```

`tipo` ∈ `escrita` | `regional` | `radio` (define la sección del boletín). Tras un push
a `main`, el workflow corre solo y publica el cambio.

## Desarrollo local

```bash
# collector: tests y corrida real (genera datos/noticias.json)
cd collector && npm ci && npm test && npm start

# frontend con datos del collector
node collector/src/main.js --salida frontend/public/data/noticias.json
cd frontend && npm ci && npm run dev
```

## Desplegar tu propia instancia (fork)

1. Haz fork (o usa este repo). El repositorio debe ser **público** (Pages y Actions
   gratuitos e ilimitados).
2. En *Settings → Pages*, selecciona **Source: GitHub Actions** (el workflow intenta
   habilitarlo solo en la primera corrida; si falla, es este paso manual).
3. Edita `collector/src/config/conceptos.js` y `medios.js` con lo tuyo.
4. Push a `main` o ejecuta el workflow a mano (*Actions → Actualizar boletín → Run
   workflow*). La rama `data` se crea sola en la primera corrida.
5. Tu boletín queda en `https://<tu-usuario>.github.io/<tu-repo>/` — el base path se
   deriva del nombre del repo automáticamente.

## Limitaciones conocidas (documentadas en REQUISITOS.md)

- **Cobertura = medios con feed alcanzable.** Los medios sin RSS o que bloquean el
  acceso automatizado no entran (registro en `docs/MEDIOS.md`). Radio y TV habladas
  quedan fuera: eso requiere transcripción, que es un servicio pagado.
- **Detección sobre lo que entrega el feed** (titular + resumen o cuerpo completo si el
  feed lo trae). Una mención que solo aparece en el cuerpo de un artículo cuyo feed
  solo entrega resumen, se pierde.
- **Latencia de mejor esfuerzo.** El cron corre cada hora, pero GitHub Actions puede
  retrasarlo 15-60 minutos en horas de carga. Hay corridas de refuerzo antes de las
  8:00 de Chile (hora de revisión).
- **Cron con auto-pausa.** GitHub desactiva los crons tras ~60 días sin actividad del
  repositorio; los commits horarios a la rama `data` lo mantienen vivo, pero si el
  workflow se pausa manualmente hay que reactivarlo en la pestaña Actions.

## Licencia

[MIT](LICENSE). Los logos y contenidos de los medios pertenecen a sus dueños; la app
muestra solo titular, extracto corto y enlace a la nota original.
