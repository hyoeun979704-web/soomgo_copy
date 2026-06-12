import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { api } from '../api/client'
import BannerCarousel from '../components/home/BannerCarousel'
import CategoryGrid from '../components/home/CategoryGrid'
import ProList from '../components/home/ProList'
import ServiceCarousel from '../components/home/ServiceCarousel'
import type { Dashboard } from '../types'

export default function Home() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState('')
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
        <span className="logo">숨고</span>
        <button className="icon-button" aria-label="알림">
          🔔
        </button>
      </header>

      <button className="search-bar" onClick={() => navigate('/search')}>
        🔍 어떤 서비스가 필요하세요?
      </button>

      <CategoryGrid categories={data.categories} />
      <BannerCarousel banners={data.banners} />
      <ServiceCarousel title="요즘 뜨는 서비스" services={data.popular_services} />
      <ProList pros={data.recommended_pros} />
    </div>
  )
}
