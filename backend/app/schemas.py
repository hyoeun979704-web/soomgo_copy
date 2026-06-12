from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SignupIn(BaseModel):
    email: str
    password: str
    name: str
    role: str = "customer"


class LoginIn(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: str


class TokenOut(BaseModel):
    access_token: str
    user: UserOut


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon: str


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    image: str
    request_count: int
    category_id: int


class BannerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    subtitle: str
    bg_color: str


class ProOut(BaseModel):
    id: int
    name: str
    intro: str
    region: str
    career_years: int
    rating: float
    review_count: int
    hire_count: int
    service_name: str
    business_name: str
    category: str


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author: str
    service_name: str
    rating: float
    content: str
    image: str
    created_at: datetime


class ProDetailOut(ProOut):
    service_id: int | None  # 견적 요청하기 CTA가 이동할 서비스
    reviews: list[ReviewOut]


class PostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    body: str
    region: str
    likes: int
    comments: int
    image: str


class PortfolioOut(BaseModel):
    id: int
    title: str
    region: str
    images: list[str]
    business_name: str


class CuratedSectionOut(BaseModel):
    title: str
    services: list[ServiceOut]


class BundleOut(BaseModel):
    caption: str
    title: str
    label: str
    image: str


class MagazineOut(BaseModel):
    badge: str
    title: str
    body: str
    views: str
    image: str
    bg_color: str


class DashboardOut(BaseModel):
    location: str
    categories: list[CategoryOut]
    banners: list[BannerOut]
    review_highlights: list[PortfolioOut]
    today_pros: list[ProOut]
    bundles: list[BundleOut]
    portfolios: list[PortfolioOut]
    posts: list[PostOut]
    curated_sections: list[CuratedSectionOut]
    magazine: list[MagazineOut]


class RequestCreateIn(BaseModel):
    service_id: int
    region: str
    schedule: str = ""
    detail: str = ""


class QuoteOut(BaseModel):
    id: int
    price: int
    message: str
    created_at: datetime
    pro: ProOut


class RequestOut(BaseModel):
    id: int
    service: ServiceOut
    region: str
    schedule: str
    detail: str
    status: str
    created_at: datetime
    quote_count: int


class RequestDetailOut(RequestOut):
    quotes: list[QuoteOut]


class QuoteAcceptOut(BaseModel):
    room_id: int


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    room_id: int
    sender_id: int
    content: str
    created_at: datetime


class RoomOut(BaseModel):
    id: int
    partner_name: str
    last_message: str | None
    last_message_at: datetime | None


class RoomQuoteOut(BaseModel):
    service_name: str
    price: int
    pro_id: int


class RoomDetailOut(BaseModel):
    id: int
    partner_name: str
    quote: RoomQuoteOut | None
    created_at: datetime


class MessageSendIn(BaseModel):
    content: str
