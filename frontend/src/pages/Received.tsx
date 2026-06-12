import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import type { QuoteRequest } from '../types'

export default function Received() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<QuoteRequest[]>('/requests/my')
      .then(setRequests)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-title">받은 견적</span>
      </header>
      {loading && <div className="page-status">불러오는 중...</div>}
      {!loading && requests.length === 0 && (
        <div className="empty-state">
          <p>아직 받은 견적이 없어요.</p>
          <button className="primary-button" onClick={() => navigate('/')}>
            견적 요청하러 가기
          </button>
        </div>
      )}
      <ul className="request-list">
        {requests.map((request) => (
          <li key={request.id}>
            <button className="request-card" onClick={() => navigate(`/received/${request.id}`)}>
              <div className="request-card-top">
                <span className="service-row-thumb">{request.service.image}</span>
                <strong>{request.service.name}</strong>
                <span className={`badge${request.status === 'open' ? '' : ' closed'}`}>
                  {request.status === 'open' ? '견적 도착' : '마감'}
                </span>
              </div>
              <span className="request-card-meta">
                {request.region} · {request.schedule || '일정 협의'}
              </span>
              <span className="request-card-count">견적 {request.quote_count}개 도착</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
