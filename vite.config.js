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
      host: '5173-i96qt3azdtx89m6l2dp0b-d0b9e1e2.sandbox.novita.ai',
      clientPort: 443,
      protocol: 'wss'
    }
  }
})
