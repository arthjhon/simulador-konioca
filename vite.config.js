import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // caminhos relativos: o mesmo build serve no domínio próprio, no GH Pages e em subcaminhos
  base: './',
  plugins: [react()],
})
