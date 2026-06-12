import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api } from '../api/client'
import type { ProDetail } from '../types'

const TABS = ['포트폴리오', '사진/동영상', '리뷰', '질문답변']

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star-icon${i <= Math.round(rating) ? '' : ' dim'}`}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function ProProfile() {
  const { proId } = useParams()
  const [pro, setPro] = useState<ProDetail | null>(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('리뷰')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<ProDetail>(`/home/pros/${proId}`)
      .then(setPro)
      .catch((e) => setError(e.message))
  }, [proId])

  if (error) return <div className="page-status">{error}</div>
  if (!pro) return <div className="page-status">불러오는 중...</div>

  return (
    <div className="page pro-profile-page">
      <header className="page-header centered">
        <span className="page-title">고수</span>
        <button className="icon-button close-button" onClick={() => navigate(-1)}>
          ✕
        </button>
      </header>

      <section className="pro-profile-head">
        <div className="pro-avatar">{pro.name[0]}</div>
        <div className="pro-info">
          <span className="today-pro-service">{pro.service_name}</span>
          <strong className="pro-profile-name">{pro.business_name}</strong>
          <span className="pro-meta">
            {pro.region} · 경력 {pro.career_years}년 · {pro.hire_count}회 고용
          </span>
        </div>
      </section>

      <nav className="profile-tabs">
        {TABS.map((name) => (
          <button
            key={name}
            className={`profile-tab${tab === name ? ' active' : ''}`}
            onClick={() => setTab(name)}
          >
            {name === '리뷰' ? `리뷰 ${pro.reviews.length}` : name}
          </button>
        ))}
      </nav>

      {tab === '리뷰' ? (
        <section className="review-section">
          <div className="rating-summary">
            <strong className="rating-number">{pro.rating.toFixed(1)}</strong>
            <div className="rating-side">
              <Stars rating={pro.rating} />
              <span className="rating-count">{pro.reviews.length}개 리뷰</span>
            </div>
          </div>
          <div className="review-filters">
            <button className="review-filter">✓ 사진 리뷰</button>
            <button className="review-filter">✓ 거래인증 리뷰</button>
            <button className="review-sort">최신순 ▾</button>
          </div>
          <ul className="review-list">
            {pro.reviews.map((review) => (
              <li key={review.id} className="review-item">
                <strong className="review-author">{review.author}</strong>
                {review.image && <div className="review-photo">{review.image}</div>}
                <div className="review-service-row">
                  <span className="review-service">{review.service_name}</span>
                  <span className="pro-rating">★ {review.rating.toFixed(1)}</span>
                </div>
                <p className="review-content">{review.content}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="empty-state">
          <p>{tab} 콘텐츠를 준비 중이에요.</p>
        </div>
      )}

      <div className="profile-cta">
        <button
          className="primary-button wide"
          disabled={pro.service_id === null}
          onClick={() => pro.service_id !== null && navigate(`/request/${pro.service_id}`)}
        >
          견적 요청하기
        </button>
        <span className="profile-cta-caption">
          평균 <em>10분</em> 이내 응답하는 고수입니다
        </span>
      </div>
    </div>
  )
}
