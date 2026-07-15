// Adaptador de archivo JSON del puerto repositorio-de-noticias.

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export function crearRepositorioJson(rutaEntrada, rutaSalida = rutaEntrada) {
  return {
    async cargar() {
      try {
        return JSON.parse(await readFile(rutaEntrada, 'utf8'))
      } catch (error) {
        if (error.code === 'ENOENT') return null // primera corrida: sin estado previo
        throw error // estado ilegible/corrupto = error fatal (no pisar datos buenos)
      }
    },

    async guardar(estado) {
      await mkdir(dirname(rutaSalida), { recursive: true })
      const rutaTemporal = `${rutaSalida}.tmp`
      // Pretty-print: los diffs de la rama `data` quedan legibles corrida a corrida.
      await writeFile(rutaTemporal, `${JSON.stringify(estado, null, 2)}\n`, 'utf8')
      await rename(rutaTemporal, rutaSalida) // escritura atómica
    },
  }
}
