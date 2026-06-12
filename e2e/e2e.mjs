import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const SHOT = './shots'
import { mkdirSync } from 'fs'
mkdirSync(SHOT, { recursive: true })
const email = `e2e_${Date.now()}@test.com`
const results = []

function log(step, ok, note = '') {
  results.push(`${ok ? '✅' : '❌'} ${step}${note ? ' — ' + note : ''}`)
  console.log(results[results.length - 1])
}

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: 'ko-KR',
})
const page = await ctx.newPage()
const consoleErrors = []
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text())
})
page.on('pageerror', (e) => consoleErrors.push(String(e)))

try {
  // 1. 홈탭 대시보드
  await page.goto(BASE)
  await page.waitForSelector('.category-item', { timeout: 10000 })
  const categories = await page.locator('.category-item').count()
  const banners = await page.locator('.banner-card').count()
  const services = await page.locator('.curated-card').count()
  const pros = await page.locator('.today-pro-card').count()
  await page.screenshot({ path: `${SHOT}/01-home.png`, fullPage: true })
  log('홈 대시보드 렌더링', categories === 12 && banners === 3 && services > 0 && pros > 0,
    `카테고리 ${categories}, 배너 ${banners}, 인기서비스 ${services}, 추천고수 ${pros}`)

  // 2. 비로그인 보호 라우트 → 로그인 리다이렉트
  await page.click('a[href="/received"]')
  await page.waitForURL('**/login')
  log('비로그인 받은견적 접근 → 로그인 리다이렉트', page.url().includes('/login'))
  await page.screenshot({ path: `${SHOT}/02-login.png` })

  // 3. 회원가입
  await page.click('a[href="/signup"]')
  await page.fill('input[placeholder="이름"]', 'E2E테스터')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', 'password123')
  await page.click('button:has-text("회원가입")')
  await page.waitForSelector('.category-item', { timeout: 10000 })
  log('회원가입 → 홈 진입', true, email)

  // 4. 검색
  await page.click('.search-bar')
  await page.waitForURL('**/search')
  await page.fill('.search-input', '이사')
  await page.waitForSelector('.service-row:has-text("원룸/소형 이사")', { timeout: 5000 })
  const searchCount = await page.locator('.service-row').count()
  await page.screenshot({ path: `${SHOT}/03-search.png` })
  log('서비스 검색("이사")', searchCount >= 2, `결과 ${searchCount}건`)

  // 5. 견적 요청 위저드
  await page.click('.service-row:has-text("원룸/소형 이사")')
  await page.waitForSelector('.wizard-step')
  const nextDisabled = await page.locator('.wizard-next').isDisabled()
  log('🔍 1단계 지역 미입력 시 다음 버튼 비활성', nextDisabled)
  await page.fill('.wizard-step input', '서울 강남구')
  await page.click('.wizard-next')
  await page.click('.chip:has-text("이번 주")')
  await page.click('.wizard-next')
  await page.fill('textarea', '원룸/소형 이사 견적 부탁드립니다. 짐이 많지 않아요.')
  await page.screenshot({ path: `${SHOT}/04-wizard.png` })
  await page.click('.wizard-next')

  // 6. 받은 견적 상세 (자동 견적 3건)
  await page.waitForSelector('.quote-card', { timeout: 10000 })
  const quotes = await page.locator('.quote-card').count()
  await page.screenshot({ path: `${SHOT}/05-quotes.png`, fullPage: true })
  log('견적 요청 → 견적 도착', quotes === 3, `견적 ${quotes}건`)

  // 7. 견적 수락 → 채팅
  await page.click('.quote-card >> nth=0 >> button:has-text("채팅하기")')
  await page.waitForURL('**/chat/**')
  await page.fill('.message-input-bar input', '안녕하세요, 이번 주 토요일 가능할까요?')
  await page.click('.send-button')
  await page.waitForSelector('.message-bubble.mine', { timeout: 5000 })
  const sent = await page.locator('.message-bubble.mine').textContent()
  log('채팅 메시지 전송(WebSocket)', sent.includes('토요일'), `"${sent}"`)

  // 8. 새로고침 후 메시지 영속 확인
  await page.reload()
  await page.waitForSelector('.message-bubble.mine', { timeout: 5000 })
  log('🔍 새로고침 후 메시지 영속 + 세션 유지', true)
  await page.screenshot({ path: `${SHOT}/06-chat.png` })

  // 9. 받은견적 탭 목록
  await page.goto(`${BASE}/received`)
  await page.waitForSelector('.request-card', { timeout: 5000 })
  const reqText = await page.locator('.request-card').first().textContent()
  await page.screenshot({ path: `${SHOT}/07-received.png` })
  log('받은견적 탭 목록', reqText.includes('원룸/소형') && reqText.includes('3개'), reqText.trim().slice(0, 60))

  // 10. 채팅 탭 목록
  await page.goto(`${BASE}/chat`)
  await page.waitForSelector('.room-row', { timeout: 5000 })
  log('채팅 탭 방 목록', true, (await page.locator('.room-row').first().textContent()).trim().slice(0, 50))

  // 11. 🔍 중복 이메일 가입
  await page.goto(`${BASE}/my`)
  await page.click('button:has-text("로그아웃")')
  await page.waitForURL('**/login')
  await page.click('a[href="/signup"]')
  await page.fill('input[placeholder="이름"]', '중복')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', 'password123')
  await page.click('button:has-text("회원가입")')
  await page.waitForSelector('.form-error', { timeout: 5000 })
  log('🔍 중복 이메일 가입 거부', (await page.textContent('.form-error')).includes('이미 가입'),
    await page.textContent('.form-error'))

  // 12. 🔍 잘못된 비밀번호 로그인
  await page.goto(`${BASE}/login`)
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', 'wrongpassword')
  await page.click('button:has-text("로그인")')
  await page.waitForSelector('.form-error', { timeout: 5000 })
  log('🔍 잘못된 비밀번호 로그인 거부', true, await page.textContent('.form-error'))
} catch (e) {
  log(`중단: ${e.message.split('\n')[0]}`, false)
  await page.screenshot({ path: `${SHOT}/99-failure.png` }).catch(() => {})
}

console.log('\n--- console errors ---')
console.log(consoleErrors.length ? consoleErrors.join('\n') : '(없음)')
await browser.close()
