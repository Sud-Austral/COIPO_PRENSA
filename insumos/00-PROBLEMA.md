# Problema, reconstruido desde el codigo

## Advertencia sobre la cadena de inferencia

Este documento se escribio hacia atras, desde lo construido. Es la parte mas
debil del ejercicio y por eso lleva mas marcas que citas. Ninguna frase de aca
debe leerse como un hecho del negocio hasta que alguien del negocio la confirme.

## Que problema se estaba resolviendo

[INFERIDO] El sistema recolecta noticias de medios y detecta menciones en ellas:
hay tres adaptadores de fuente distintos, uno de feeds
[collector/src/adaptadores/fuente-rss.js], uno de un agregador de noticias
[collector/src/adaptadores/fuente-google-news.js] y uno de mapas de sitio de
noticias [collector/src/adaptadores/fuente-sitemap-news.js], y una regla de
dominio dedicada a detectar menciones [collector/src/dominio/menciones.js].
Luego probablemente habia un problema con enterarse a tiempo de lo que los
medios publicaban. Esa es la cadena completa, y es una hipotesis.

[INFERIDO] El problema incluia la duplicacion: existe una regla de dominio
dedicada solo a eso [collector/src/dominio/deduplicacion.js]. Se programa
deduplicacion cuando la misma noticia llega por varios caminos y molesta.

[INFERIDO] El problema tenia una dimension de volumen manejable, no de archivo
completo: hay una regla de ventana movil [collector/src/dominio/ventana.js] y un
parametro de tamano de ventana [collector/src/config/parametros.js]. Se acota una
ventana cuando lo que importa es lo reciente.

[INFERIDO] No bastaba con listar: se queria leer la noticia clasificada. Hay
reglas separadas para categoria [collector/src/dominio/categorias.js], tono
[collector/src/dominio/sentimiento.js], ambito nacional o extranjero
[collector/src/dominio/ambito.js], region [collector/src/dominio/geografia.js],
entidades [collector/src/dominio/entidades.js], seccion
[collector/src/dominio/secciones.js] y riesgo
[collector/src/dominio/riesgo.js]. Que decision del negocio depende de cada una
de esas clasificaciones es [PENDIENTE].

[INFERIDO] El resultado tenia que salir del sistema hacia otra parte: hay un
componente de descarga en formato de planilla [frontend/src/componentes/BotonCSV.jsx]
y una definicion de columnas de salida [frontend/src/csv.js]. Alguien queria el
dato en su propia herramienta.

## Quien sufre el problema

Con precision: **no hay guard, decorador, middleware de autorizacion ni tabla de
permisos en este repositorio**. La extraccion de rutas de API de servidor devolvio
cero resultados y la de tablas de base de datos tambien. No hay ningun rol
impuesto por codigo, ni siquiera uno definido y sin usar.

[INFERIDO] Hay un vocabulario institucional en el repositorio que sugiere de que
mundo son los usuarios: el catalogo de entidades distingue autoridades,
organizaciones propias, servicios colaboradores, organismos internacionales e
instituciones de educacion [collector/src/config/gazetteer-entidades.js]. Quienes
son las personas detras de esas categorias es [PENDIENTE].

## Cuantas personas son

[PENDIENTE] Sin excepcion. No hay tabla de usuarios, no hay control de acceso y
no habria dato de dotacion aunque lo hubiera.

## Como lo resolvian antes

[INFERIDO] Existe un archivo de insumo, fuera del codigo del sistema, que es un
panel de menciones con datos de partida y almacenamiento en el navegador
[INSUMO/panel_menciones_conaf.jsx]. Un panel de menciones con semilla propia es
indicio de una version anterior o de un prototipo previo al sistema actual. Que
haya sido eso, y no otra cosa, es [PENDIENTE].

[PENDIENTE] Quien revisaba los medios antes, con que frecuencia y cuanto
tardaba. Nada de eso esta en el codigo.

## Que pasa si no se hace nada

[PENDIENTE] Sin excepcion. El codigo no responde esta pregunta y no se deduce de
que el sistema exista.

## Volumen

Indicios de orden de magnitud, todos [INFERIDO], y ninguno es una cifra:

- Hay topes explicitos por corrida: `MAX_RESOLUCIONES_POR_CORRIDA`,
  `MAX_DESCARGAS_SITEMAP_POR_CORRIDA`, `MAX_IMAGENES_POR_CORRIDA` y
  `MAX_DESCARGAS_POR_CORRIDA` [collector/src/config/parametros.js]. Poner topes
  supone que sin ellos el proceso se pasaria de largo.
- Hay una ventana de tamano fijo [collector/src/dominio/ventana.js] y un
  parametro que la define [collector/src/config/parametros.js]. La ventana acota
  lo que se muestra, no lo que existe.
- El archivo de datos historicos que viaja en el repositorio pesa unas decenas de
  kilobytes [frontend/public/data/historico.json]. Es un indicio de escala
  modesta para lo versionado, no un conteo de noticias.
- Hay un limite de concurrencia [collector/src/adaptadores/util-concurrencia.js],
  que suele aparecer cuando hay muchas descargas simultaneas.

La cifra real de noticias por dia, de medios monitoreados y de menciones sigue
siendo [PENDIENTE].

## Quien decide que esta terminado

[PENDIENTE] Sin excepcion.

## Datos personales y normativa

[VERIFICAR] Un sistema que guarda noticias guarda, casi con seguridad, nombres de
personas: autores, autoridades citadas, personas mencionadas. El repositorio
tiene un catalogo de autoridades conocidas
[collector/src/config/gazetteer-entidades.js] y un archivo de datos historicos
que viaja versionado [frontend/public/data/historico.json]. Ninguno se
transcribe aca. Hay que revisarlo con mas cuidado porque la evidencia declara que
este repositorio no es privado.

[VERIFICAR] El repositorio incluye un archivo de licencia [LICENSE]. Que licencia
es y si corresponde a lo que la institucion quiere publicar no se afirma aca: lo
cierra Fiscalia.

[VERIFICAR] La recoleccion automatizada de contenido de medios ajenos tiene
implicancias de propiedad intelectual y de terminos de uso de cada sitio. Hay un
parametro de dominios excluidos [collector/src/config/parametros.js], que sugiere
que el tema se considero, pero no se cita ninguna norma aca porque no corresponde
deducirla del codigo.
