import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.sandbox.novita.ai'],
    hmr: {
      host: '5173-iglkcxvhd02rmxuabej7s-cc2fbc16.sandbox.novita.ai',
      protocol: 'wss'
    }
  }
})
