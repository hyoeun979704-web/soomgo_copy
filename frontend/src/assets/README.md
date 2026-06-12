# 에셋 드롭 가이드

제작 중인 에셋을 아래 파일명 규칙대로 이 폴더에 넣어주시면 코드에서 이모지 플레이스홀더를 교체합니다.
포맷은 아이콘류 **SVG**(또는 PNG @2x), 사진류 **WebP/JPG** 권장.

## 1순위

| 파일명 | 용도 | 권장 크기 |
|---|---|---|
| `logo.svg` | 로고 워드마크 (보라 #693BF2) | 높이 24px 기준 |
| `symbol.svg` | 심볼 (앱 아이콘·스플래시용) | 정사각 |
| `tab-home.svg` / `tab-home-active.svg` | 하단 탭 - 홈 | 24×24 |
| `tab-pros.svg` / `tab-pros-active.svg` | 하단 탭 - 고수찾기 | 24×24 |
| `tab-received.svg` / `tab-received-active.svg` | 하단 탭 - 받은견적 | 24×24 |
| `tab-chat.svg` / `tab-chat-active.svg` | 하단 탭 - 채팅 | 24×24 |
| `tab-community.svg` / `tab-community-active.svg` | 하단 탭 - 커뮤니티 | 24×24 |
| `cat-all.svg`, `cat-moving.svg`, `cat-repair.svg`, `cat-interior.svg`, `cat-outsourcing.svg`, `cat-event.svg`, `cat-career.svg`, `cat-lesson.svg`, `cat-hobby.svg`, `cat-car.svg`, `cat-law.svg`, `cat-etc.svg` | 카테고리 아이콘 (3D 스타일) | 44×44 |

## 2순위

| 파일명 | 용도 |
|---|---|
| `svc-<서비스영문슬러그>.webp` (예: `svc-move-cleaning.webp`) | 서비스 썸네일 (큐레이션·검색 카드, 150×150) |
| `banner-1.webp` ~ `banner-3.webp` | 홈 배너 배경 |
| `quick-pros.svg`, `quick-portfolio.svg`, `quick-community.svg`, `quick-market.svg` | 퀵메뉴 아이콘 |

## 3순위

| 파일명 | 용도 |
|---|---|
| `pro-<id>-1.webp` … | 고수 프로필/포트폴리오 사진 |
| `magazine-1.webp` … | 숨고 이야기 커버 |
| `icon-chatbot.svg`, `icon-bookmark.svg`, `icon-star.svg` | 보조 아이콘 |

넣어주시면 제가 `CategoryGrid`·`AppShell` 등에서 import 매핑 테이블로 연결하겠습니다
(이모지 폴백은 유지되므로 일부만 먼저 넣어도 됩니다).
