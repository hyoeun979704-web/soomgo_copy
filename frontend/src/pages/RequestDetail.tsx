import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api } from '../api/client'
import type { QuoteRequestDetail } from '../types'

export default function RequestDetail() {
  const { requestId } = useParams()
  const [data, setData] = useState<QuoteRequestDetail | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<QuoteRequestDetail>(`/requests/${requestId}`)
      .then(setData)
      .catch((e) => setError(e.message))
  }, [requestId])

  async function accept(quoteId: number) {
    const res = await api.post<{ room_id: number }>(`/requests/quotes/${quoteId}/accept`)
    navigate(`/chat/${res.room_id}`)
  }

  if (error) return <div className="page-status">{error}</div>
  if (!data) return <div className="page-status">불러오는 중...</div>

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <span className="page-title">{data.service.name}</span>
      </header>

      <section className="request-summary">
        <span>{data.region} · {data.schedule || '일정 협의'}</span>
        {data.detail && <p>{data.detail}</p>}
      </section>

      <h2 className="section-title in-page">도착한 견적 {data.quotes.length}개</h2>
      <ul className="quote-list">
        {data.quotes.map((quote) => (
          <li key={quote.id} className="quote-card">
            <div className="pro-name-row">
              <div className="pro-avatar small">{quote.pro.name[0]}</div>
              <strong>{quote.pro.name}</strong>
              <span className="pro-rating">
                ★ {quote.pro.rating.toFixed(1)} ({quote.pro.review_count})
              </span>
            </div>
            <p className="quote-message">{quote.message}</p>
            <div className="quote-bottom">
              <strong className="quote-price">{quote.price.toLocaleString()}원</strong>
              <button className="primary-button slim" onClick={() => accept(quote.id)}>
                채팅하기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
