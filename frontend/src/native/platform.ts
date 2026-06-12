// 플랫폼 분기의 단일 진입점. Capacitor 도입 후 isNativePlatform()으로 교체한다.
export function isNativeApp(): boolean {
  return false
}

// 개발은 vite proxy(/api), 배포는 환경변수로 Railway 백엔드 URL을 주입한다.
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? '/api'

export function wsUrl(path: string): string {
  if (API_BASE.startsWith('http')) {
    return API_BASE.replace(/^http/, 'ws') + path
  }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${location.host}${API_BASE}${path}`
}
