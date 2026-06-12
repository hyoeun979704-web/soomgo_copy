# E2E 점검 스크립트

회원가입 → 검색 → 견적 요청 → 받은 견적 → 채팅까지 12단계를 실제 브라우저로 검증한다.

```bash
npm init -y && npm i playwright
npx playwright install chromium

# 로컬 개발 서버 대상 (기본)
node e2e.mjs

# 배포 도메인 대상
BASE_URL=https://soomgocopy-production.up.railway.app node e2e.mjs
```

Windows CMD에서는:

```bat
set BASE_URL=https://soomgocopy-production.up.railway.app && node e2e.mjs
```

결과는 ✅/❌ 로 단계별 출력되고, 스크린샷이 `shots/` 폴더에 저장된다.
