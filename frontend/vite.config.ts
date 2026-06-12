import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 웹 배포는 절대 경로(/)가 필요하다(딥링크 새로고침 시 에셋 경로가 깨지지 않도록).
// Capacitor 번들 내장 빌드 때만 CAP_BUILD=1 npm run build 로 상대 경로를 쓴다.
export default defineConfig({
  base: process.env.CAP_BUILD ? './' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // localhost 대신 127.0.0.1: Windows에서 Node가 localhost를 IPv6(::1)로
        // 먼저 해석해 uvicorn(127.0.0.1)과 연결이 어긋나는 문제를 피한다.
        // 백엔드가 /api 프리픽스를 네이티브로 쓰므로 rewrite는 필요 없다.
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
