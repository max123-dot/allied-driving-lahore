import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base is "/" for custom domains. For GitHub Pages project sites it is
// overridden at build time: VITE_BASE="/<repo>/" (see .github/workflows/deploy.yml).
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
