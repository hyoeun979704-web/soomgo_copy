import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/received', label: '받은견적', icon: '📋' },
  { to: '/market', label: '마켓', icon: '🛍️' },
  { to: '/chat', label: '채팅', icon: '💬' },
  { to: '/my', label: '마이숨고', icon: '👤' },
]

export default function AppShell() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      <nav className="tab-bar">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
