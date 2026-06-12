import { useNavigate } from 'react-router-dom'

import type { Service } from '../../types'

interface Props {
  title: string
  services: Service[]
}

export default function ServiceCarousel({ title, services }: Props) {
  const navigate = useNavigate()
  return (
    <section className="home-section">
      <h2 className="section-title">{title}</h2>
      <div className="service-carousel">
        {services.map((service) => (
          <button
            key={service.id}
            className="service-card"
            onClick={() => navigate(`/request/${service.id}`)}
          >
            <div className="service-thumb">{service.image}</div>
            <span className="service-name">{service.name}</span>
            <span className="service-count">
              요청 {service.request_count.toLocaleString()}건
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
