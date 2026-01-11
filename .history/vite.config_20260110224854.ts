import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/projects/llm-tomagatchi/',
  server: {
    port: 3000,
    open: true,
    allowedHosts: ['design.kristiantalley.com']
  },
  preview: {
    port: 3000,
    allowedHosts: ['design.kristiantalley.com']
  }
})
