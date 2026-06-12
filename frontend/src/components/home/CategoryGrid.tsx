import { useNavigate } from 'react-router-dom'

import type { Category } from '../../types'

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const navigate = useNavigate()
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <button
          key={category.id}
          className="category-item"
          onClick={() => navigate(`/search?category=${category.id}`)}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
        </button>
      ))}
    </div>
  )
}
