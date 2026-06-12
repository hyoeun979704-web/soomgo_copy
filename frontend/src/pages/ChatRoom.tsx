import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api, getToken } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { wsUrl } from '../native/platform'
import type { Message } from '../types'

export default function ChatRoom() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get<Message[]>(`/chat/rooms/${roomId}/messages`).then(setMessages)

    const ws = new WebSocket(wsUrl(`/chat/ws/${roomId}?token=${getToken()}`))
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]))
    }
    wsRef.current = ws
    return () => ws.close()
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: FormEvent) {
    e.preventDefault()
    const content = input.trim()
    if (!content) return
    setInput('')
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(content)
    } else {
      // 소켓이 닫혀 있으면 REST로 폴백한다.
      const message = await api.post<Message>(`/chat/rooms/${roomId}/messages`, { content })
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]))
    }
  }

  return (
    <div className="chat-room">
      <header className="page-header">
        <button className="icon-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <span className="page-title">채팅</span>
      </header>
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble${message.sender_id === user?.id ? ' mine' : ''}`}
          >
            {message.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="message-input-bar" onSubmit={send}>
        <input
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="send-button" aria-label="전송">
          ↑
        </button>
      </form>
    </div>
  )
}
