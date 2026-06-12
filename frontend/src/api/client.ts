import { API_BASE } from '../native/platform'
import { storage } from '../native/storage'

const TOKEN_KEY = 'soomgo_token'

export function getToken(): string | null {
  return storage.get(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token === null) storage.remove(TOKEN_KEY)
  else storage.set(TOKEN_KEY, token)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = `요청에 실패했습니다. (${res.status})`
    try {
      const data = await res.json()
      if (typeof data.detail === 'string') detail = data.detail
    } catch {
      // 본문이 JSON이 아니면 기본 메시지를 사용한다.
    }
    throw new ApiError(res.status, detail)
  }
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
}
