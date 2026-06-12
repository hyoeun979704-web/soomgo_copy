import { useNavigate } from 'react-router-dom'

import type { Category } from '../../types'

const PAGE_SIZE = 12 // 2행 × 6열

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const navigate = useNavigate()
  const items: { key: string; icon: string; name: string; to: string }[] = [
    { key: 'all', icon: '⠿', name: '전체보기', to: '/search' },
    ...categories.map((c) => ({
      key: String(c.id),
      icon: c.icon,
      name: c.name,
      to: `/search?category=${c.id}`,
    })),
  ]
  const pages: (typeof items)[] = []
  for (let i = 0; i < items.length; i += PAGE_SIZE) pages.push(items.slice(i, i + PAGE_SIZE))

  return (
    <div className="category-area">
      <div className="category-pager">
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="category-grid">
            {page.map((item) => (
              <button key={item.key} className="category-item" onClick={() => navigate(item.to)}>
                <span className="category-icon">{item.icon}</span>
                <span className="category-name">{item.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="pager-dots">
          {pages.map((_, i) => (
            <span key={i} className={`pager-dot${i === 0 ? ' active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
