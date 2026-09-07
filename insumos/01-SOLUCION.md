# Solucion, leida desde el codigo

## Que hace el sistema

[INFERIDO] Recolecta noticias de medios por tres caminos distintos: feeds de los
medios [collector/src/adaptadores/fuente-rss.js], un agregador de noticias
[collector/src/adaptadores/fuente-google-news.js] con un resolvedor de enlaces
propio [collector/src/adaptadores/resolver-google-news.js], y mapas de sitio de
noticias [collector/src/adaptadores/fuente-sitemap-news.js]. Sobre lo recolectado
detecta menciones [collector/src/dominio/menciones.js], elimina duplicados
[collector/src/dominio/deduplicacion.js] y mantiene una ventana de lo reciente
[collector/src/dominio/ventana.js].

[INFERIDO] Clasifica cada noticia por varios ejes a la vez: categoria
[collector/src/dominio/categorias.js], tono
[collector/src/dominio/sentimiento.js], ambito nacional o extranjero
[collector/src/dominio/ambito.js], region [collector/src/dominio/geografia.js],
entidades mencionadas [collector/src/dominio/entidades.js], seccion
[collector/src/dominio/secciones.js] y riesgo
[collector/src/dominio/riesgo.js]. Enriquece la ficha con contenido y con imagen
del articulo [collector/src/adaptadores/extractor-contenido.js],
[collector/src/adaptadores/enriquecedor-imagenes.js],
[collector/src/dominio/enriquecimiento.js], y acumula historia
[collector/src/dominio/historico.js].

[INFERIDO] Presenta el resultado como boletin y permite recorrerlo de varias
maneras: portada [frontend/src/vistas/Portada.jsx], panel de indicadores
[frontend/src/vistas/Dashboard.jsx], busqueda
[frontend/src/vistas/Buscar.jsx], estadisticas
[frontend/src/vistas/Estadisticas.jsx], eventos
[frontend/src/vistas/Eventos.jsx], historico
[frontend/src/vistas/Historico.jsx], mapa [frontend/src/vistas/Mapa.jsx], vista
por medio [frontend/src/vistas/Medios.jsx], vista por region
[frontend/src/vistas/Regiones.jsx] y una pantalla de configuracion
[frontend/src/vistas/Configuracion.jsx].

[INFERIDO] Permite buscar dentro de lo recolectado sin servidor: hay un servicio
de busqueda propio [frontend/src/servicios/busqueda.js] apoyado en una libreria
de busqueda declarada [frontend/package.json:15].

[INFERIDO] Permite ubicar las noticias en el territorio: hay una vista de mapa
[frontend/src/vistas/Mapa.jsx] apoyada en librerias de cartografia declaradas
[frontend/package.json:13], [frontend/package.json:18].

[INFERIDO] Permite llevarse el dato a una planilla: hay un boton de descarga
[frontend/src/componentes/BotonCSV.jsx] con las columnas de salida definidas en
un solo lugar [frontend/src/csv.js].

[INFERIDO] Guarda historia en el navegador de quien mira, no solo como archivo del
sitio: hay un servicio de historico local con clave de almacenamiento, version y
tope de registros [frontend/src/servicios/historico-local.js].

[INFERIDO] La recoleccion es automatizada y periodica, no manual: hay un flujo de
actualizacion programado [.github/workflows/actualizar.yml] y un punto de entrada
ejecutable del recolector [collector/package.json].

## De donde salen los datos

[INFERIDO] La fuente son medios de comunicacion externos, definidos en un catalogo
propio del repositorio con dos listas separadas, una general y una de mapas de
sitio [collector/src/config/medios.js], acompanado de documentacion dedicada
[docs/MEDIOS.md]. Que medios estan y por que estan es una decision editorial.

[INFERIDO] Que se busca dentro de esos medios esta definido en un catalogo de
conceptos [collector/src/config/conceptos.js], y como se reconocen entidades y
lugares, en dos catalogos separados
[collector/src/config/gazetteer-entidades.js],
[collector/src/config/gazetteer-geografico.js].

[INFERIDO] El dato que consume la interfaz viaja como archivo dentro del propio
sitio [frontend/public/data/historico.json], escrito por un adaptador de
repositorio en formato JSON [collector/src/adaptadores/repositorio-json.js]. No
hay base de datos: la extraccion de tablas devolvio cero resultados.

[PENDIENTE] Quien es dueno del catalogo de medios y quien autoriza agregar o
sacar uno. Quien es dueno del catalogo de conceptos. Son las dos decisiones que
determinan que aparece en el boletin, y ninguna esta escrita en el codigo.

[VERIFICAR] Hay una sola llamada a una API externa en todo el repositorio, y esta
en un archivo de insumo, no en el sistema: una peticion a un servicio externo de
modelos de lenguaje [INSUMO/panel_menciones_conaf.jsx:282]. Hay que revisar si
ese archivo lleva alguna credencial embebida, porque es codigo de front y la
evidencia declara que este repositorio no es privado. No se transcribe nada de
ese archivo aca.

## Roles: quien ve que

[INFERIDO] **No hay control de acceso.** No hay guard, decorador ni tabla de
permisos; la extraccion de rutas de API de servidor devolvio cero resultados, y
el analisis de senales de capacidad, que recorre categorias de forma exhaustiva,
reporto solo dos para este repositorio y ninguna es de autenticacion. Todas las
vistas cuelgan de la misma navegacion
[frontend/src/componentes/BarraNavegacion.jsx], sin distincion de quien mira.

[PENDIENTE] Si el boletin deberia ser publico o restringido. Hoy el codigo asume
que todo el que llega ve todo.

## Que NO hace

Ausencias afirmables, porque el analizador busco esas categorias de forma
exhaustiva y devolvio vacio:

- [INFERIDO] No existe ningun endpoint de servidor propio: la extraccion de rutas
  de API no devolvio ninguna ruta de servidor. La unica llamada detectada es
  saliente y esta en un archivo de insumo [INSUMO/panel_menciones_conaf.jsx:282].
- [INFERIDO] No existe ninguna tabla de base de datos: la extraccion de tablas
  devolvio cero resultados. Toda la persistencia es archivo
  [frontend/public/data/historico.json] y almacenamiento del navegador
  [frontend/src/servicios/historico-local.js].
- [INFERIDO] No hay dependencias de Python declaradas: el listado viene vacio y
  no hay ningun archivo Python en el repositorio.
- [INFERIDO] Solo hay tres variables de entorno leidas por codigo
  [frontend/vite.config.js:11], [frontend/vite.config.js:12],
  [frontend/src/datos.js:7]; las tres son de construccion y publicacion, no de
  conexion a un sistema externo.

## Iteraciones

[INFERIDO] Hay un parametro llamado VERSION_ANALISIS
[collector/src/config/parametros.js], que sugiere que las reglas de analisis se
versionan y que hubo mas de una version. Cuantas y cuando es [PENDIENTE].

[INFERIDO] Hay varias capacidades detras de interruptores de encendido y apagado:
GOOGLE_NEWS_ACTIVO, SITEMAP_ACTIVO, IMAGENES_ACTIVO y ENRIQUECIMIENTO_ACTIVO
[collector/src/config/parametros.js]. Eso suele significar que se incorporaron
por etapas y que se pueden apagar si dan problemas. Cual esta encendida hoy en
produccion es [PENDIENTE].

[INFERIDO] Hay una bateria de pruebas del recolector con nueve archivos
[collector/test/ambito.test.js], [collector/test/deduplicacion.test.js],
[collector/test/enriquecedor-imagenes.test.js],
[collector/test/fuente-google-news.test.js], [collector/test/fuente-rss.test.js],
[collector/test/fuente-sitemap-news.test.js], [collector/test/menciones.test.js],
[collector/test/noticia.test.js] y [collector/test/ventana.test.js], y la tarea
que las corre esta declarada [collector/package.json]. La interfaz no tiene
archivos de prueba equivalentes.

[INFERIDO] Existe un documento de requisitos en el repositorio
[docs/REQUISITOS.md] y un archivo de instrucciones para agregar funcionalidad
[prompt_nueva_funcionalidad.md]. Son la mejor pista de que el proyecto tuvo un
proceso escrito, aunque su contenido no esta desglosado en la evidencia.

## Lo que este borrador no pudo describir

- Los valores de los parametros [collector/src/config/parametros.js]: se conocen
  los nombres, no los numeros. Sin ellos no hay dimensionamiento.
- El contenido del catalogo de medios [collector/src/config/medios.js] y del de
  conceptos [collector/src/config/conceptos.js]: son las dos decisiones de
  negocio del sistema y la evidencia solo muestra que existen.
- La pantalla de configuracion [frontend/src/vistas/Configuracion.jsx]: no consta
  que configura, ni si lo que se cambia ahi persiste en alguna parte.
- La relacion entre el archivo de insumo [INSUMO/panel_menciones_conaf.jsx] y el
  sistema actual. Es el archivo mas grande del repositorio y ningun otro archivo
  de la evidencia lo importa.
