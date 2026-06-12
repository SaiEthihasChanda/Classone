import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    // Proxy API calls to the content backend so the frontend can use
    // same-origin `/api/...` paths (works through ngrok too).
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
