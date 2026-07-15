import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages de proyecto sirve bajo /<nombre-del-repo>/. El workflow de
  // despliegue exporta BASE_PATH con el nombre real del repo, así un fork de
  // otra institución funciona sin editar código.
  base: process.env.BASE_PATH ?? '/COIPO_PRENSA/',
})
