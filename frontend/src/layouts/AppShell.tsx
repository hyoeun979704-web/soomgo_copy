import { Link, NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const TABS = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/pros', label: '고수찾기', icon: '🧭' },
  { to: '/received', label: '받은견적', icon: '📋' },
  { to: '/chat', label: '채팅', icon: '💬' },
  { to: '/community', label: '커뮤니티', icon: '👥' },
]

export default function AppShell() {
  const { user, loading } = useAuth()
  return (
    <div className="app-shell">
      <main className="app-main">
        <Outlet />
      </main>
      {!loading && !user && (
        <div className="login-banner">
          <span>로그인하고 더 많은 기능을 이용해보세요</span>
          <Link to="/login">로그인</Link>
        </div>
      )}
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
