import type { Pro } from '../../types'

export default function ProList({ pros }: { pros: Pro[] }) {
  return (
    <section className="home-section">
      <h2 className="section-title">숨고 추천 고수</h2>
      <ul className="pro-list">
        {pros.map((pro) => (
          <li key={pro.id} className="pro-card">
            <div className="pro-avatar">{pro.name[0]}</div>
            <div className="pro-info">
              <div className="pro-name-row">
                <strong>{pro.name}</strong>
                <span className="pro-rating">
                  ★ {pro.rating.toFixed(1)} ({pro.review_count})
                </span>
              </div>
              <p className="pro-intro">{pro.intro}</p>
              <span className="pro-meta">
                {pro.region} · 경력 {pro.career_years}년 · {pro.hire_count}회 고용
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
