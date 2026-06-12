from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Banner, Category, ProProfile, Service
from ..schemas import DashboardOut, ProOut

router = APIRouter(prefix="/home", tags=["home"])


def pro_to_out(profile: ProProfile) -> ProOut:
    return ProOut(
        id=profile.user_id,
        name=profile.user.name,
        intro=profile.intro,
        region=profile.region,
        career_years=profile.career_years,
        rating=profile.rating,
        review_count=profile.review_count,
        hire_count=profile.hire_count,
    )


@router.get("/dashboard", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db)):
    """홈탭 첫 화면 데이터를 1회 호출로 묶어 내려준다."""
    categories = db.scalars(select(Category).order_by(Category.sort)).all()
    banners = db.scalars(select(Banner).order_by(Banner.sort)).all()
    popular = db.scalars(
        select(Service).order_by(Service.request_count.desc()).limit(8)
    ).all()
    pros = db.scalars(
        select(ProProfile).options(joinedload(ProProfile.user))
        .order_by(ProProfile.rating.desc(), ProProfile.review_count.desc())
        .limit(6)
    ).all()
    return DashboardOut(
        categories=categories,
        banners=banners,
        popular_services=popular,
        recommended_pros=[pro_to_out(p) for p in pros],
    )
