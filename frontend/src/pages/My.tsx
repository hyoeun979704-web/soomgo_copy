import { useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const MENU = ['결제 수단 관리', '쿠폰함', '친구 초대', '고객센터', '공지사항', '설정']

export default function My() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-title">마이숨고</span>
      </header>
      <section className="my-profile">
        <div className="pro-avatar">{user?.name[0]}</div>
        <div>
          <strong>{user?.name}</strong>
          <p className="my-email">{user?.email}</p>
        </div>
      </section>
      <ul className="my-menu">
        {MENU.map((item) => (
          <li key={item}>
            <button className="my-menu-row">
              {item} <span className="chevron">›</span>
            </button>
          </li>
        ))}
        <li>
          <button
            className="my-menu-row logout"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            로그아웃
          </button>
        </li>
      </ul>
    </div>
  )
}
