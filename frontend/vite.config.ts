import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base를 상대 경로로 두어야 Capacitor 번들 내장 시 그대로 동작한다.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // localhost 대신 127.0.0.1: Windows에서 Node가 localhost를 IPv6(::1)로
        // 먼저 해석해 uvicorn(127.0.0.1)과 연결이 어긋나는 문제를 피한다.
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
