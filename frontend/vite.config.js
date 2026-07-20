import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages de proyecto sirve bajo /<nombre-del-repo>/. El workflow de
  // despliegue exporta BASE_PATH con el nombre real del repo, así un fork de
  // otra institución funciona sin editar código. En desarrollo, base es / (sirven en raíz).
  base: process.env.BASE_PATH ?? (process.env.NODE_ENV === 'development' ? '/' : '/COIPO_PRENSA/'),
})
