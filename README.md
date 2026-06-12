# 숨고 카피 (Soomgo Copy)

숨고 스타일의 견적 매칭 서비스 클론. React(모바일 우선 웹/앱) + FastAPI + Railway 스택으로 구성되어 있으며, iOS/Android 앱은 Capacitor로 동일 코드베이스를 패키징하는 전략을 따른다.

## 구조

```
frontend/   React + Vite + TypeScript (모바일 우선, Capacitor 패키징 대비)
backend/    FastAPI + SQLAlchemy (로컬 SQLite, Railway에서는 DATABASE_URL 주입)
```

## 구현된 기능

- **홈탭 (실제 숨고 앱 UI 동기화)**: 위치 헤더·고수가입, 검색바 + AI 견적 요청, 카테고리 그리드(전체보기 + 11개), 후기 하이라이트, 오늘의 추천 고수(칩 필터), 배너 캐러셀, 한번에 견적 받기, 포트폴리오, 퀵메뉴, 주변 인기글, 큐레이션 4종, 숨고 이야기, 푸터·챗봇 FAB — `GET /home/dashboard` 1회 호출로 로딩
- **회원가입 / 로그인**: JWT(30일) 기반, 토큰은 `src/native/storage.ts` 경계 뒤에 저장. 비로그인 시 하단 로그인 배너
- **서비스 검색**: 카테고리 필터 + 키워드 검색
- **견적 요청**: 3단계 위저드(지역 → 일정 → 상세). 요청 생성 시 데모용 자동 견적 3건이 도착
- **받은 견적**: 요청 목록 → 견적 상세 → 견적 수락 시 채팅방 생성
- **채팅**: WebSocket 실시간 송수신(소켓이 닫히면 REST 폴백)
- **고수찾기 / 커뮤니티**: 칩 필터 고수 목록, 인기글 목록
- 하단 5탭(실제 앱과 동일): 홈 · 고수찾기 · 받은견적 · 채팅 · 커뮤니티
- 브랜드 컬러: 보라 `#693BF2` (현행 숨고 리브랜딩 기준)

## 로컬 실행

```bash
# 백엔드 (http://localhost:8000)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 프런트엔드 (http://localhost:5173, /api → 8000 프록시)
cd frontend
npm install
npm run dev
```

첫 기동 시 카테고리·서비스·배너·고수 계정이 자동 시드된다. (고수 계정 비밀번호: `soomgo123!`)

## Railway 배포

- **backend** 서비스: 루트 디렉터리를 `backend/`로 지정. `railway.json`이 start command(`uvicorn ... --port $PORT`)와 헬스체크(`/health`)를 정의한다. 환경변수: `DATABASE_URL`(Postgres 플러그인), `JWT_SECRET`
- **frontend** 서비스: 루트 `frontend/`, 빌드 `npm run build`, 정적 서빙. 환경변수 `VITE_API_BASE`에 백엔드 공개 URL 지정

## 앱(Capacitor) 패키징 — 다음 단계

코드는 이미 앱 패키징을 전제로 작성되어 있다.

1. `frontend/`에 `@capacitor/core` `@capacitor/cli` 추가 후 `npx cap add ios android`
2. `src/native/platform.ts`의 `isNativeApp()`을 `Capacitor.isNativePlatform()`으로 교체 (네이티브에서는 HashRouter가 자동 선택됨)
3. `src/native/storage.ts`를 `@capacitor/preferences` 구현으로 교체
4. 푸시 알림: `@capacitor/push-notifications` + 백엔드 디바이스 토큰 엔드포인트 추가
