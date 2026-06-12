import { useMemo, useState } from 'react'

import type { Pro } from '../../types'

export default function TodayPros({ pros }: { pros: Pro[] }) {
  const categories = useMemo(() => [...new Set(pros.map((p) => p.category))], [pros])
  const [selected, setSelected] = useState(categories[0] ?? '')
  const filtered = pros.filter((p) => p.category === selected)

  return (
    <section className="home-section">
      <h2 className="section-title">
        오늘의 추천 고수 <span className="ad-mark">광고 ⓘ</span>
      </h2>
      <div className="chip-scroll">
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
      <div className="hscroll">
        {filtered.map((pro) => (
          <div key={pro.id} className="today-pro-card">
            <span className="today-pro-service">{pro.service_name}</span>
            <strong className="today-pro-name">{pro.business_name}</strong>
            <span className="today-pro-meta">
              <span className="star">★</span> {pro.rating.toFixed(1)} ({pro.review_count}) · 경력{' '}
              {pro.career_years}년
            </span>
            <div className="photo-strip">
              <span className="photo-tile avatar-tile">{pro.name[0]}</span>
              <span className="photo-tile">🛠️</span>
              <span className="photo-tile">📷</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
