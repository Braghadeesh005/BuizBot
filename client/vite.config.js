import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'https://laptop-483nic2i.tail7526d.ts.net',
      '/profile': 'https://laptop-483nic2i.tail7526d.ts.net',
      '/data': 'https://laptop-483nic2i.tail7526d.ts.net',
      '/session-data': 'https://laptop-483nic2i.tail7526d.ts.net',
      '/logout': 'https://laptop-483nic2i.tail7526d.ts.net',
    }
  }
})