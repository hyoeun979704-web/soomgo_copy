import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './hooks/useAuth'
import './index.css'
import { isNativeApp } from './native/platform'

// 네이티브 앱(파일 프로토콜)에서는 HashRouter가 안전하다.
const Router = isNativeApp() ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>,
)
