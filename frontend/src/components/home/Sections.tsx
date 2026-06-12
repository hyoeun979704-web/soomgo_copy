import { useNavigate } from 'react-router-dom'

import type { Banner, Bundle, CuratedSection, Magazine, Portfolio, Post, Service } from '../../types'

/** 최근 주변에서 많이 본 서비스 후기 하이라이트 (문구는 데모용 자체 콘텐츠) */
const DEMO_REVIEWS = [
  { id: 1, text: '사장님이 친절하시고 마무리까지 꼼꼼하게 해주셨어요', region: '서울 강남구', service: '이사청소', image: '🧹' },
  { id: 2, text: '입주청소 처음 맡겨봤는데 결과가 만족스러워요', region: '서울 강남구', service: '이사청소', image: '🪟' },
  { id: 3, text: '베란다 곰팡이까지 깔끔하게 제거해주셨습니다', region: '서울 강남구', service: '이사청소', image: '🧽' },
]

export function ReviewHighlights({ location }: { location: string }) {
  return (
    <section className="home-section">
      <p className="section-caption">최근 {location} 주변에서 많이 본</p>
      <div className="section-title-row">
        <h2 className="section-title">이사/입주 청소업체 고민 해결법</h2>
        <button className="more-link">더보기 ›</button>
      </div>
      <div className="chip-scroll">
        {['이사/입주 청소업체', '영어 과외', '에어컨 설치 및 수리'].map((name, i) => (
          <button key={name} className={`chip${i === 0 ? ' selected dark' : ''}`}>
            {name}
          </button>
        ))}
      </div>
      <div className="hscroll">
        {DEMO_REVIEWS.map((review) => (
          <div key={review.id} className="review-card">
            <div className="photo-block">
              {review.image}
              <span className="bookmark">🔖</span>
            </div>
            <p className="review-text">{review.text}</p>
            <span className="review-meta">
              {review.region} · {review.service}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PromoBanners({ banners }: { banners: Banner[] }) {
  return (
    <div className="banner-carousel">
      {banners.map((banner, i) => (
        <div key={banner.id} className="banner-card" style={{ background: banner.bg_color }}>
          <span className="banner-title">{banner.title}</span>
          <strong className="banner-subtitle">{banner.subtitle}</strong>
          <span className="banner-page">
            {i + 1}/{banners.length}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BundleSection({ bundles }: { bundles: Bundle[] }) {
  return (
    <section className="home-section">
      <h2 className="section-title">지금 필요한 서비스, 한번에 견적 받기</h2>
      <div className="hscroll">
        {bundles.map((bundle) => (
          <div key={bundle.title} className="bundle-card">
            <div className="bundle-top">
              <div>
                <p className="bundle-caption">{bundle.caption}</p>
                <strong className="bundle-title">{bundle.title}</strong>
              </div>
              <span className="bundle-image">{bundle.image}</span>
            </div>
            <button className="bundle-label">
              {bundle.label} <span className="chevron">›</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PortfolioSection({
  location,
  portfolios,
}: {
  location: string
  portfolios: Portfolio[]
}) {
  const businesses = [...new Set(portfolios.map((p) => p.business_name))]
  return (
    <section className="home-section">
      <p className="section-caption">{location} 주민들이 만족한</p>
      <h2 className="section-title">이사/입주 청소업체 고수의 포트폴리오</h2>
      <div className="hscroll avatar-row">
        {businesses.map((name) => (
          <div key={name} className="business-avatar">
            <span className="business-circle">{name[0]}</span>
            <span className="business-name">{name}</span>
          </div>
        ))}
      </div>
      <div className="portfolio-list">
        {portfolios.slice(0, 2).map((portfolio) => (
          <div key={portfolio.id} className="portfolio-card">
            <div className="portfolio-photos">
              {portfolio.images.map((image, i) => (
                <span key={i} className="photo-tile big">
                  {image}
                </span>
              ))}
            </div>
            <strong className="portfolio-title">{portfolio.title}</strong>
            <span className="portfolio-region">{portfolio.region}</span>
          </div>
        ))}
      </div>
      <button className="wide-button">이 고수의 작업 사례 더보기</button>
    </section>
  )
}

export function QuickMenu() {
  const navigate = useNavigate()
  const MENU = [
    { icon: '🔍', label: '고수찾기', to: '/pros' },
    { icon: '📁', label: '포트폴리오', to: '/pros' },
    { icon: '📝', label: '커뮤니티', to: '/community' },
    { icon: '🧺', label: '마켓', to: '/market' },
  ]
  return (
    <div className="quick-menu">
      {MENU.map((item) => (
        <button key={item.label} className="quick-item" onClick={() => navigate(item.to)}>
          <span className="quick-icon">{item.icon}</span>
          <span className="quick-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export function PopularPosts({ location, posts }: { location: string; posts: Post[] }) {
  const navigate = useNavigate()
  return (
    <section className="home-section">
      <div className="section-title-row">
        <h2 className="section-title">이번 주 {location} 주변 인기글</h2>
        <button className="more-link" onClick={() => navigate('/community')}>
          더보기 ›
        </button>
      </div>
      <ul className="post-list">
        {posts.map((post, i) => (
          <li key={post.id} className="post-row">
            <span className="post-rank">{i + 1}</span>
            <div className="post-body">
              <strong className="post-title">{post.title}</strong>
              <p className="post-preview">{post.body}</p>
              <span className="post-meta">
                좋아요 {post.likes} · 댓글 {post.comments}
              </span>
            </div>
            <span className="post-thumb">{post.image}</span>
          </li>
        ))}
      </ul>
      <button className="wide-button" onClick={() => navigate('/community')}>
        ⟳ 인기글 더보기 1/3
      </button>
    </section>
  )
}

export function CuratedRow({ section }: { section: CuratedSection }) {
  const navigate = useNavigate()
  return (
    <section className="home-section">
      <div className="section-title-row">
        <h2 className="section-title">{section.title}</h2>
        <button className="more-link" onClick={() => navigate('/search')}>
          더보기 ›
        </button>
      </div>
      <div className="hscroll">
        {section.services.map((service: Service) => (
          <button
            key={service.id}
            className="curated-card"
            onClick={() => navigate(`/request/${service.id}`)}
          >
            <div className="photo-block">{service.image}</div>
            <span className="curated-name">{service.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function MagazineSection({ magazine }: { magazine: Magazine[] }) {
  return (
    <section className="home-section">
      <div className="section-title-row">
        <h2 className="section-title">숨고 이야기</h2>
        <button className="more-link">더보기 ›</button>
      </div>
      <div className="hscroll">
        {magazine.map((article) => (
          <div key={article.title} className="magazine-card">
            <div className="magazine-cover" style={{ background: article.bg_color }}>
              <span className="magazine-badge">{article.badge}</span>
              <span className="magazine-emoji">{article.image}</span>
            </div>
            <strong className="magazine-title">{article.title}</strong>
            <p className="magazine-body">{article.body}</p>
            <span className="magazine-views">👁 {article.views}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <strong className="footer-logo">숨고</strong>
      <div className="footer-links">
        <span>이용약관</span>
        <span>광고약관</span>
        <span>개인정보 처리방침</span>
        <span>위치기반 서비스 이용약관</span>
      </div>
    </footer>
  )
}
