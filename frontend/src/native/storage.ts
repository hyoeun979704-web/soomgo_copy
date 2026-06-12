// 토큰 저장소 경계. 웹은 localStorage, 추후 Capacitor 도입 시
// 이 모듈만 @capacitor/preferences 구현으로 교체하면 된다.
export const storage = {
  get(key: string): string | null {
    return localStorage.getItem(key)
  },
  set(key: string, value: string): void {
    localStorage.setItem(key, value)
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
}
