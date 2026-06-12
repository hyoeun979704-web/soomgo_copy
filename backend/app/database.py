import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Railway에서는 DATABASE_URL(Postgres)을 주입하고, 로컬 개발은 SQLite를 사용한다.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./soomgo.db")

# Railway Postgres는 postgres:// 스킴을 주는 경우가 있어 SQLAlchemy 형식으로 보정한다.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
