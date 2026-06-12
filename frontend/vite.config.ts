import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base를 상대 경로로 두어야 Capacitor 번들 내장 시 그대로 동작한다.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
