import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { api } from '../api/client'
import type { Service } from '../types'

export default function Search() {
  const [params] = useSearchParams()
  const categoryId = params.get('category')
  const [q, setQ] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const query = new URLSearchParams()
    if (categoryId) query.set('category_id', categoryId)
    if (q) query.set('q', q)
    const timer = setTimeout(() => {
      api.get<Service[]>(`/services?${query}`).then(setServices).catch(() => setServices([]))
    }, 200)
    return () => clearTimeout(timer)
  }, [categoryId, q])

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <input
          className="search-input"
          placeholder="어떤 서비스가 필요하세요?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
      </header>
      <ul className="service-list">
        {services.map((service) => (
          <li key={service.id}>
            <button className="service-row" onClick={() => navigate(`/request/${service.id}`)}>
              <span className="service-row-thumb">{service.image}</span>
              <span className="service-row-name">{service.name}</span>
              <span className="service-row-count">
                요청 {service.request_count.toLocaleString()}건
              </span>
            </button>
          </li>
        ))}
        {services.length === 0 && <li className="page-status">검색 결과가 없습니다.</li>}
      </ul>
    </div>
  )
}
