from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(20), default="customer")  # customer | pro
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    pro_profile: Mapped["ProProfile | None"] = relationship(back_populates="user", uselist=False)


class ProProfile(Base):
    __tablename__ = "pro_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    intro: Mapped[str] = mapped_column(Text, default="")
    region: Mapped[str] = mapped_column(String(100), default="")
    career_years: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    hire_count: Mapped[int] = mapped_column(Integer, default=0)
    service_name: Mapped[str] = mapped_column(String(100), default="")   # 예: 에어컨 설치 및 수리
    business_name: Mapped[str] = mapped_column(String(100), default="")  # 카드에 노출되는 상호명
    category: Mapped[str] = mapped_column(String(50), default="")        # 추천 고수 칩 필터용

    user: Mapped[User] = relationship(back_populates="pro_profile")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    icon: Mapped[str] = mapped_column(String(10))  # 이모지 아이콘
    sort: Mapped[int] = mapped_column(Integer, default=0)

    services: Mapped[list["Service"]] = relationship(back_populates="category")


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    name: Mapped[str] = mapped_column(String(100), index=True)
    image: Mapped[str] = mapped_column(String(10), default="🔧")
    request_count: Mapped[int] = mapped_column(Integer, default=0)

    category: Mapped[Category] = relationship(back_populates="services")


class Banner(Base):
    __tablename__ = "banners"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    subtitle: Mapped[str] = mapped_column(String(200), default="")
    bg_color: Mapped[str] = mapped_column(String(20), default="#00C7AE")
    sort: Mapped[int] = mapped_column(Integer, default=0)


class Post(Base):
    """커뮤니티 글 (홈탭 '주변 인기글' 섹션)."""

    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text, default="")
    region: Mapped[str] = mapped_column(String(100), default="")
    likes: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    image: Mapped[str] = mapped_column(String(10), default="📷")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Portfolio(Base):
    """고수 포트폴리오 (홈탭 포트폴리오 섹션)."""

    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True)
    pro_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(200))
    region: Mapped[str] = mapped_column(String(100), default="")
    images: Mapped[str] = mapped_column(String(50), default="🏠,🛋️,🪟")  # 이모지 플레이스홀더 3장

    pro: Mapped[User] = relationship()


class Review(Base):
    """고수 프로필 상세의 리뷰 탭."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    pro_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped[str] = mapped_column(String(20))  # 마스킹된 이름 (예: 홍**)
    service_name: Mapped[str] = mapped_column(String(100), default="")
    rating: Mapped[float] = mapped_column(Float, default=5.0)
    content: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(String(10), default="")  # 사진 리뷰 이모지(없으면 빈 값)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"))
    region: Mapped[str] = mapped_column(String(100))
    schedule: Mapped[str] = mapped_column(String(100), default="")
    detail: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="open")  # open | closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    service: Mapped[Service] = relationship()
    quotes: Mapped[list["Quote"]] = relationship(back_populates="request")


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("quote_requests.id"))
    pro_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    price: Mapped[int] = mapped_column(Integer)
    message: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    request: Mapped[QuoteRequest] = relationship(back_populates="quotes")
    pro: Mapped[User] = relationship()


class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    pro_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    quote_id: Mapped[int | None] = mapped_column(ForeignKey("quotes.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    customer: Mapped[User] = relationship(foreign_keys=[customer_id])
    pro: Mapped[User] = relationship(foreign_keys=[pro_id])
    messages: Mapped[list["Message"]] = relationship(back_populates="room")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    room_id: Mapped[int] = mapped_column(ForeignKey("chat_rooms.id"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    room: Mapped[ChatRoom] = relationship(back_populates="messages")
