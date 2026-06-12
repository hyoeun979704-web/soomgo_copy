// 백엔드는 타임존 표기 없는 UTC로 시각을 내려준다. Z를 붙여 UTC로 해석한 뒤
// 사용자 로컬 시간대로 포맷한다.
export function parseUtc(iso: string): Date {
  return new Date(/Z|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + 'Z')
}

export function formatTime(iso: string | null): string {
  if (!iso) return ''
  return parseUtc(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
