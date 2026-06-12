from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https?://localhost(:\d+)?|capacitor://localhost|https://.*\.up\.railway\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(home.router)
app.include_router(services.router)
app.include_router(requests.router)
app.include_router(chat.router)


@app.get("/health")
def health():
    return {"status": "ok"}
