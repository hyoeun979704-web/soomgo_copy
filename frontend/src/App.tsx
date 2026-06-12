import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from './hooks/useAuth'
import AppShell from './layouts/AppShell'
import ChatList from './pages/ChatList'
import ChatRoom from './pages/ChatRoom'
import Community from './pages/Community'
import Home from './pages/Home'
import Login from './pages/Login'
import Market from './pages/Market'
import My from './pages/My'
import ProProfile from './pages/ProProfile'
import ProSearch from './pages/ProSearch'
import Received from './pages/Received'
import RequestDetail from './pages/RequestDetail'
import RequestWizard from './pages/RequestWizard'
import Search from './pages/Search'
import Signup from './pages/Signup'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="page-status">불러오는 중...</div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/pros" element={<ProSearch />} />
        <Route path="/community" element={<Community />} />
        <Route path="/market" element={<Market />} />
        <Route
          path="/received"
          element={
            <RequireAuth>
              <Received />
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <ChatList />
            </RequireAuth>
          }
        />
        <Route
          path="/my"
          element={
            <RequireAuth>
              <My />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="/search" element={<Search />} />
      <Route path="/pro/:proId" element={<ProProfile />} />
      <Route
        path="/request/:serviceId"
        element={
          <RequireAuth>
            <RequestWizard />
          </RequireAuth>
        }
      />
      <Route
        path="/received/:requestId"
        element={
          <RequireAuth>
            <RequestDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/chat/:roomId"
        element={
          <RequireAuth>
            <ChatRoom />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
