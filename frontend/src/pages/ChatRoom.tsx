import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api, getToken } from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { wsUrl } from '../native/platform'
import type { Message, RoomDetail } from '../types'
import { formatTime, parseUtc } from '../utils/time'

const STEPS = ['결제완료', '서비스진행', '거래확정']

function formatDateDivider(iso: string): string {
  return parseUtc(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  })
}

export default function ChatRoom() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const [room, setRoom] = useState<RoomDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get<RoomDetail>(`/chat/rooms/${roomId}`).then(setRoom)
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
      <header className="chat-header">
        <div className="chat-header-top">
          <button className="icon-button" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="chat-partner">
            <span className="chat-partner-name">
              {room?.partner_name ?? '채팅'} {room?.quote && <span className="hire-badge">고용</span>}
            </span>
            <span className="chat-partner-sub">
              평균 <em>30분</em> 이내 응답
            </span>
          </div>
          <div className="chat-header-icons">
            <button className="icon-button" aria-label="전화">📞</button>
            <button className="icon-button" aria-label="찜">🤍</button>
            <button className="icon-button" aria-label="더보기">⋮</button>
          </div>
        </div>
        {room?.quote && (
          <>
            <div className="deal-steps">
              {STEPS.map((step, i) => (
                <div key={step} className="deal-step">
                  <span className={`deal-dot${i === 0 ? ' active' : ''}`} />
                  <span className="deal-label">{step}</span>
                </div>
              ))}
              <span className="deal-line" />
            </div>
            <div className="deal-buttons">
              <button className="deal-button">거래 상세보기</button>
              <button className="deal-button">작성된 리뷰</button>
            </div>
          </>
        )}
      </header>

      <div className="message-list">
        {room && <div className="date-divider">{formatDateDivider(room.created_at)}</div>}

        {room?.quote && (
          <div className="quote-bubble">
            <div className="quote-bubble-head">
              <span className="won-badge">₩</span> 견적서
            </div>
            <p className="quote-bubble-greeting">
              숨고 고객님 안녕하세요. 요청서에 따른 예상금액입니다.
            </p>
            <div className="quote-bubble-rows">
              <div className="quote-bubble-row">
                <span>서비스</span>
                <span>{room.quote.service_name}</span>
              </div>
              <div className="quote-bubble-row">
                <span>예상금액</span>
                <strong>총 {room.quote.price.toLocaleString()}원</strong>
              </div>
            </div>
            <p className="quote-bubble-hint">💬 견적금액에 대해 궁금한 점을 채팅으로 물어보세요.</p>
            <button
              className="primary-button quote-profile-button"
              onClick={() => navigate(`/pro/${room.quote!.pro_id}`)}
            >
              고수 프로필 보기 <span className="chevron-white">›</span>
            </button>
          </div>
        )}

        {messages.map((message) => {
          const mine = message.sender_id === user?.id
          return (
            <div key={message.id} className={`message-row${mine ? ' mine' : ''}`}>
              <div className={`message-bubble${mine ? ' mine' : ''}`}>{message.content}</div>
              <span className="message-time">{formatTime(message.created_at)}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form className="message-input-bar" onSubmit={send}>
        <input
          placeholder="메시지를 입력하세요."
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
