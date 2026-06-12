import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import type { ChatRoomSummary } from '../types'

function formatTime(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatList() {
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<ChatRoomSummary[]>('/chat/rooms')
      .then(setRooms)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-title">채팅</span>
      </header>
      {loading && <div className="page-status">불러오는 중...</div>}
      {!loading && rooms.length === 0 && (
        <div className="empty-state">
          <p>아직 채팅이 없어요.</p>
          <p className="empty-sub">견적을 받고 고수와 대화를 시작해보세요.</p>
        </div>
      )}
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id}>
            <button className="room-row" onClick={() => navigate(`/chat/${room.id}`)}>
              <div className="pro-avatar">{room.partner_name[0]}</div>
              <div className="room-info">
                <strong>{room.partner_name}</strong>
                <span className="room-last">{room.last_message ?? '대화를 시작해보세요.'}</span>
              </div>
              <span className="room-time">{formatTime(room.last_message_at)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
