// Conceptos de búsqueda — la "interfaz de administración" v1 (se edita aquí).
//
// La detección es insensible a mayúsculas y tildes y usa límites de palabra:
// "CONAF" matchea "Conaf" y "(CONAF)", pero NO "CONAFE".
// Se busca en el titular y en el texto que entrega el feed de cada medio.

export const CONCEPTOS = ['CONAF', 'Corporación Nacional Forestal','CMPC','forestal','Parque Nacional', 'forestin','sernafor']
