from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .database import Base, SessionLocal, engine
from .routers import auth, chat, home, requests, services
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Soomgo Copy API", lifespan=lifespan)

# capacitor:// 와 http://localhost 는 iOS/Android 앱 웹뷰의 오리진이다.
# (단일 서비스 배포에서는 동일 오리진이라 CORS가 필요 없지만, 분리 배포·앱 대비로 유지)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https?://localhost(:\d+)?|capacitor://localhost|https://.*\.up\.railway\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 모든 API는 /api 아래로 통일한다 (프런트 정적 서빙 경로와 충돌 방지).
API_PREFIX = "/api"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(home.router, prefix=API_PREFIX)
app.include_router(services.router, prefix=API_PREFIX)
app.include_router(requests.router, prefix=API_PREFIX)
app.include_router(chat.router, prefix=API_PREFIX)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# 프런트 빌드 산출물(backend/static)이 있으면 SPA로 서빙한다.
# Docker 이미지 빌드 시 frontend/dist가 이 위치로 복사된다.
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        candidate = STATIC_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        # BrowserRouter 딥링크(/received 등)는 index.html로 폴백
        return FileResponse(STATIC_DIR / "index.html")
