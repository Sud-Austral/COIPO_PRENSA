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

- `frontend/` — app React (Vite). Lint con oxlint (`.oxlintrc.json`).
- `docs/REQUISITOS.md` — documento de requisitos (incluye 13 preguntas aún abiertas,
  entre ellas: definición de "duplicado", reglas de detección de menciones
  (mayúsculas/"CONAFE"), lista definitiva de medios, mapeo de secciones, manejo de
  logos, columnas del CSV, política ante medios que bloquean el acceso).

## Criterio de éxito

Puesto lado a lado con un boletín antiguo de ConectaMedia, el resultado debe reconocerse
como "lo mismo, en versión web": mismas secciones, misma información por noticia, estilo
visual similar (verde institucional, extracto con resaltado).
