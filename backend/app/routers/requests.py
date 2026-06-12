import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import ChatRoom, ProProfile, Quote, QuoteRequest, Service, User
from ..schemas import (
    QuoteAcceptOut,
    QuoteOut,
    RequestCreateIn,
    RequestDetailOut,
    RequestOut,
    ServiceOut,
)
from ..security import get_current_user
from .home import pro_to_out

router = APIRouter(prefix="/requests", tags=["requests"])


def _auto_quote(db: Session, request: QuoteRequest) -> None:
    """데모용: 요청이 생성되면 고수들이 견적을 보낸 상황을 만들어 받은견적 탭이 동작하게 한다."""
    pros = db.scalars(select(ProProfile)).all()
    base = random.randint(5, 30) * 10_000
    for profile in random.sample(pros, k=min(3, len(pros))):
        db.add(Quote(
            request_id=request.id,
            pro_id=profile.user_id,
            price=base + random.randint(0, 10) * 5_000,
            message=f"안녕하세요, {profile.user.name}입니다. 요청 내용 확인했고 바로 진행 가능합니다.",
        ))


def _request_out(db: Session, req: QuoteRequest) -> RequestOut:
    quote_count = db.scalar(select(func.count(Quote.id)).where(Quote.request_id == req.id)) or 0
    return RequestOut(
        id=req.id,
        service=ServiceOut.model_validate(req.service),
        region=req.region,
        schedule=req.schedule,
        detail=req.detail,
        status=req.status,
        created_at=req.created_at,
        quote_count=quote_count,
    )


@router.post("", response_model=RequestOut)
def create_request(body: RequestCreateIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db.get(Service, body.service_id) is None:
        raise HTTPException(status_code=404, detail="서비스를 찾을 수 없습니다.")
    req = QuoteRequest(
        user_id=user.id,
        service_id=body.service_id,
        region=body.region,
        schedule=body.schedule,
        detail=body.detail,
    )
    db.add(req)
    db.flush()
    _auto_quote(db, req)
    db.commit()
    db.refresh(req)
    return _request_out(db, req)


@router.get("/my", response_model=list[RequestOut])
def my_requests(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reqs = db.scalars(
        select(QuoteRequest)
        .options(joinedload(QuoteRequest.service))
        .where(QuoteRequest.user_id == user.id)
        .order_by(QuoteRequest.created_at.desc())
    ).all()
    return [_request_out(db, r) for r in reqs]


@router.get("/{request_id}", response_model=RequestDetailOut)
def request_detail(request_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    req = db.get(QuoteRequest, request_id)
    if req is None or req.user_id != user.id:
        raise HTTPException(status_code=404, detail="요청을 찾을 수 없습니다.")
    quotes = db.scalars(
        select(Quote).options(joinedload(Quote.pro)).where(Quote.request_id == req.id)
    ).all()
    quote_outs = []
    for quote in quotes:
        profile = quote.pro.pro_profile
        if profile is None:
            continue
        quote_outs.append(QuoteOut(
            id=quote.id,
            price=quote.price,
            message=quote.message,
            created_at=quote.created_at,
            pro=pro_to_out(profile),
        ))
    base = _request_out(db, req)
    return RequestDetailOut(**base.model_dump(), quotes=quote_outs)


@router.post("/quotes/{quote_id}/accept", response_model=QuoteAcceptOut)
def accept_quote(quote_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quote = db.get(Quote, quote_id)
    if quote is None or quote.request.user_id != user.id:
        raise HTTPException(status_code=404, detail="견적을 찾을 수 없습니다.")
    room = db.scalar(select(ChatRoom).where(ChatRoom.quote_id == quote.id))
    if room is None:
        room = ChatRoom(customer_id=user.id, pro_id=quote.pro_id, quote_id=quote.id)
        db.add(room)
        db.commit()
        db.refresh(room)
    return QuoteAcceptOut(room_id=room.id)
