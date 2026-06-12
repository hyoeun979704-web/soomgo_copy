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


class DashboardOut(BaseModel):
    categories: list[CategoryOut]
    banners: list[BannerOut]
    popular_services: list[ServiceOut]
    recommended_pros: list[ProOut]


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


class MessageSendIn(BaseModel):
    content: str
