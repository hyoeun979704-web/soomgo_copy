import type { Banner } from '../../types'

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  return (
    <div className="banner-carousel">
      {banners.map((banner) => (
        <div key={banner.id} className="banner-card" style={{ background: banner.bg_color }}>
          <strong>{banner.title}</strong>
          <span>{banner.subtitle}</span>
        </div>
      ))}
    </div>
  )
}
