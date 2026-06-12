import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import type { Pro } from '../types'

export default function ProSearch() {
  const [pros, setPros] = useState<Pro[]>([])
  const [selected, setSelected] = useState('전체')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<Pro[]>('/home/pros')
      .then(setPros)
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['전체', ...new Set(pros.map((p) => p.category))], [pros])
  const filtered = selected === '전체' ? pros : pros.filter((p) => p.category === selected)

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-title">고수찾기</span>
      </header>
      <div className="chip-scroll padded">
        {categories.map((category) => (
          <button
            key={category}
            className={`chip${selected === category ? ' selected dark' : ''}`}
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {loading && <div className="page-status">불러오는 중...</div>}
      <ul className="pro-list padded">
        {filtered.map((pro) => (
          <li key={pro.id} className="pro-card" onClick={() => navigate(`/pro/${pro.id}`)}>
            <div className="pro-avatar">{pro.name[0]}</div>
            <div className="pro-info">
              <span className="today-pro-service">{pro.service_name}</span>
              <div className="pro-name-row">
                <strong>{pro.business_name}</strong>
              </div>
              <span className="today-pro-meta">
                <span className="star">★</span> {pro.rating.toFixed(1)} ({pro.review_count}) · 경력{' '}
                {pro.career_years}년
              </span>
              <p className="pro-intro">{pro.intro}</p>
              <span className="pro-meta">
                {pro.region} · {pro.hire_count}회 고용
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
