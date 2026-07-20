import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages de proyecto sirve bajo /<nombre-del-repo>/. El workflow de
  // despliegue exporta BASE_PATH, así un fork funciona sin editar código.
  // En desarrollo: / (sirven en raíz). En producción: definido por workflow.
  base: (() => {
    if (process.env.BASE_PATH) return process.env.BASE_PATH
    if (process.env.NODE_ENV === 'development') return '/'
    return '/COIPO_PRENSA/'
  })(),
})
