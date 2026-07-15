# COIPO_PRENSA — Monitor de Prensa CONAF

## Qué es este proyecto

Aplicación web que reemplaza el boletín de prensa diario que CONAF recibía del servicio
pagado **ConectaMedia** (cancelado por falta de presupuesto; el servicio ya no llega).
Muestra las últimas ~100 noticias de medios chilenos con presencia web donde se menciona
**"CONAF"** o **"Corporación Nacional Forestal"**, con el formato del boletín antiguo.

- **Mandante:** SECOM (Gerencia de Comunicaciones de CONAF). Es quien acepta la v1.
- **Responsable/admin:** Luis Monsalve, Unidad de Información y Análisis.
- **Documento de requisitos completo:** [docs/REQUISITOS.md](docs/REQUISITOS.md) — fuente
  de verdad del alcance. Leerlo antes de implementar o cambiar funcionalidades.

## Decisiones de alcance que NO deben violarse (v1)

1. **Página estática en GitHub Pages. Sin backend ni base de datos propios.** La
   recolección de noticias corre en un proceso programado externo (ej. GitHub Actions
   cron) que regenera datos estáticos que la página consume. Ojo: esto es una
   interpretación ("sin backend" = "sin servidores propios") pendiente de validar con
   SECOM en la presentación de la v1.
2. **Presupuesto $0**: solo herramientas y servicios gratuitos. Nada de APIs pagadas.
3. **React obligatorio** (scaffold Vite+React ya existe en `frontend/`).
4. **Arquitectura hexagonal** (puertos y adaptadores): la lógica no debe acoplarse a la
   fuente de datos, para poder enchufar una base de datos en la v2 sin reescribir.
5. **Solo lectura**: sin login, sin roles, sin interfaz de administración. Conceptos de
   búsqueda y lista de medios se definen **en el código** (el admin los edita ahí).
6. **Repositorio público y reutilizable** por otras instituciones: documentar bien,
   licencia permisiva.

## Requisitos funcionales clave

- Secciones por tipo de medio como el boletín antiguo; dentro de cada sección **lo más
  reciente arriba**. Cada noticia: medio, titular con **link directo** a la nota
  original, fecha, extracto con la mención destacada (resaltado amarillo).
- Ventana móvil de **~100 noticias** (número configurable en código), actualización
  automática con **latencia máxima de 1 hora**; lista al día todos los días a las
  **8:00 hora de Chile** (SECOM la revisa a esa hora).
- Botón de **descarga CSV** de las noticias visibles.
- Errores declarados inaceptables por SECOM (los 4): página caída/en blanco a las 8:00,
  perder una noticia de un medio grande de la lista, mostrar ruido o duplicados, links
  rotos.

## Fuera de alcance v1 (no implementar sin nueva instrucción)

Transcripción de radio/TV, prensa impresa sin web, histórico y filtro temporal más allá
de las ~100, gestión desde la interfaz, cuentas/login, redes sociales, alertas por
correo, estadísticas, análisis de tono, base de datos e integraciones (todo eso es
conversación post-presentación de la v1 o versión 2).

## Estructura del repo

- `collector/` — recolector Node ≥22, **arquitectura hexagonal**: `src/dominio/`
  (reglas puras, 100% testeadas con vitest), `src/puertos/` (contratos JSDoc),
  `src/adaptadores/` (RSS por medio + Google News con resolución de links + JSON),
  `src/config/` (conceptos, medios y dominios excluidos: la "interfaz de administración"
  v1 se edita AQUÍ), `src/main.js` (composición — único lugar que une todo; la v2 con BD
  solo cambia el adaptador aquí).
- **Dos fuentes de noticias:** (1) feeds RSS de los medios curados (links directos), y
  (2) Google News como red de seguridad de cobertura — un medio de alto volumen rota su
  feed más rápido que el cron y perdería noticias. Google News resuelve el link cifrado a
  la URL real vía el endpoint no documentado `batchexecute` (frágil; si Google lo cambia,
  no entran ítems por esa vía pero la página no se cae). Se excluye conaf.cl (no es
  prensa). Los medios curados que llegan por Google caen en su sección; el resto en
  "Otros medios".
- `frontend/` — app React (Vite), puramente presentacional: lee `data/noticias.json`
  con extractos YA segmentados (`[{texto, resaltado}]`) — no re-implementa detección.
  Lint con oxlint (`.oxlintrc.json`).
- `.github/workflows/actualizar.yml` — cron horario (:17) + refuerzos pre-8:00 Chile;
  tests bloquean deploy; estado versionado en la **rama `data`** (auto-bootstrapping);
  si el collector falla, Pages conserva la última versión buena.
- `docs/REQUISITOS.md` — documento de requisitos (incluye 13 preguntas aún abiertas,
  entre ellas: definición de "duplicado", reglas de detección de menciones
  (mayúsculas/"CONAFE"), lista definitiva de medios, mapeo de secciones, manejo de
  logos, columnas del CSV, política ante medios que bloquean el acceso).
- `docs/MEDIOS.md` — registro de verificación de feeds por medio (qué entra y por qué).

## Comandos

- Tests del collector: `cd collector && npm test` (deben pasar antes de cualquier push:
  el workflow los usa como compuerta del deploy).
- Corrida real del collector: `node collector/src/main.js --salida
  frontend/public/data/noticias.json` (ese JSON local está gitignoreado).
- Frontend: `cd frontend && npm run dev` (dev), `npm run lint`, `npm run build &&
  npm run preview` (producción local en `http://localhost:4173/COIPO_PRENSA/`).
- Node local: portable en `C:\Users\luis.monsalve\AppData\Local\Programs\nodejs-portable\node-v24.18.0-win-x64`
  (no está en PATH; agregarlo por sesión).

## Criterio de éxito

Puesto lado a lado con un boletín antiguo de ConectaMedia, el resultado debe reconocerse
como "lo mismo, en versión web": mismas secciones, misma información por noticia, estilo
visual similar (verde institucional, extracto con resaltado).
