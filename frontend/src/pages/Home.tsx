import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import CategoryGrid from '../components/home/CategoryGrid'
import {
  BundleSection,
  CuratedRow,
  HomeFooter,
  MagazineSection,
  PopularPosts,
  PortfolioSection,
  PromoBanners,
  QuickMenu,
  ReviewHighlights,
} from '../components/home/Sections'
import TodayPros from '../components/home/TodayPros'
import { useAuth } from '../hooks/useAuth'
import type { Dashboard } from '../types'

export default function Home() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<Dashboard>('/home/dashboard')
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="page-status">{error}</div>
  if (!data) return <div className="page-status">불러오는 중...</div>

  return (
    <div className="home-page">
      <header className="home-header">
        <button className="location-button">
          {data.location} <span className="location-caret">▾</span>
        </button>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="마이페이지"
            onClick={() => navigate(user ? '/my' : '/login')}
          >
            👤
          </button>
          <button className="pro-join-button">고수가입</button>
        </div>
      </header>

      <div className="search-row">
        <button className="search-bar" onClick={() => navigate('/search')}>
          🔍 어떤 서비스가 필요하세요?
        </button>
        <button className="ai-quote-button" onClick={() => navigate('/search')}>
          ✨ AI 견적 요청
        </button>
      </div>

      <CategoryGrid categories={data.categories} />
      <ReviewHighlights location={data.location} />
      <TodayPros pros={data.today_pros} />
      <PromoBanners banners={data.banners} />
      <BundleSection bundles={data.bundles} />
      <PortfolioSection location={data.location} portfolios={data.portfolios} />
      <QuickMenu />
      <PopularPosts location={data.location} posts={data.posts} />
      {data.curated_sections.map((section) => (
        <CuratedRow key={section.title} section={section} />
      ))}
      <MagazineSection magazine={data.magazine} />
      <HomeFooter />

      <button className="chatbot-fab">🎧 챗봇 상담</button>
    </div>
  )
}
