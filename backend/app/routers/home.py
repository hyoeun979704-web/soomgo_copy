from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Banner, Category, Portfolio, Post, ProProfile, Service
from ..schemas import (
    BundleOut,
    CuratedSectionOut,
    DashboardOut,
    MagazineOut,
    PortfolioOut,
    PostOut,
    ProOut,
    ServiceOut,
)

router = APIRouter(prefix="/home", tags=["home"])

# 큐레이션 섹션·번들·매거진은 운영 데이터가 아니라 기획 데이터라 코드에 둔다.
CURATED_SECTIONS = [
    ("로망을 현실로, 집 꾸미기 시작", ["욕실/화장실 리모델링", "도배장판 시공", "싱크대 교체"]),
    ("복잡한 이사 준비도 걱정 없이", ["이사/입주 청소업체", "원룸/소형 이사", "가정이사"]),
    ("벌레 때문에 신경 쓰인다면", ["방충망 설치 및 수리", "바퀴벌레 퇴치", "해충방역"]),
    ("나에게 딱 맞는 선생님 찾기", ["퍼스널트레이닝(PT)", "영어 과외", "수영 레슨"]),
]

BUNDLES = [
    BundleOut(caption="오픈부터 운영까지", title="쇼핑몰 창업", label="외주 서비스 9종", image="🖥️"),
    BundleOut(caption="특별한 날을 완성하는", title="결혼식 준비", label="웨딩 서비스 9종", image="💐"),
]

MAGAZINE = [
    MagazineOut(
        badge="생활의 기술",
        title="여름휴가 준비, 이것만 챙기면 끝",
        body="휴가철을 앞두고 미리 준비하면 좋은 것들을 모아봤어요.",
        views="2.6천",
        image="🤿",
        bg_color="#1E9BF0",
    ),
    MagazineOut(
        badge="안전 거래",
        title="안전결제로 거래해야 하는 이유",
        body="결제 대금을 안전하게 보관하는 구조를 소개합니다.",
        views="1.5천",
        image="✅",
        bg_color="#693BF2",
    ),
]


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
        service_name=profile.service_name,
        business_name=profile.business_name,
        category=profile.category,
    )


def portfolio_to_out(portfolio: Portfolio) -> PortfolioOut:
    profile = portfolio.pro.pro_profile
    return PortfolioOut(
        id=portfolio.id,
        title=portfolio.title,
        region=portfolio.region,
        images=portfolio.images.split(","),
        business_name=profile.business_name if profile else portfolio.pro.name,
    )


@router.get("/dashboard", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db)):
    """홈탭 전체 섹션 데이터를 1회 호출로 묶어 내려준다."""
    categories = db.scalars(select(Category).order_by(Category.sort)).all()
    banners = db.scalars(select(Banner).order_by(Banner.sort)).all()
    pros = db.scalars(
        select(ProProfile).options(joinedload(ProProfile.user))
        .order_by(ProProfile.rating.desc(), ProProfile.review_count.desc())
    ).all()
    portfolios = db.scalars(
        select(Portfolio).options(joinedload(Portfolio.pro))
    ).all()
    posts = db.scalars(select(Post).order_by(Post.likes.desc(), Post.id)).all()

    services_by_name = {
        s.name: s for s in db.scalars(select(Service)).all()
    }
    curated = [
        CuratedSectionOut(
            title=title,
            services=[
                ServiceOut.model_validate(services_by_name[name])
                for name in names
                if name in services_by_name
            ],
        )
        for title, names in CURATED_SECTIONS
    ]

    portfolio_outs = [portfolio_to_out(p) for p in portfolios]
    return DashboardOut(
        location="강남구",
        categories=categories,
        banners=banners,
        review_highlights=portfolio_outs[:3],
        today_pros=[pro_to_out(p) for p in pros],
        bundles=BUNDLES,
        portfolios=portfolio_outs,
        posts=posts[:3],
        curated_sections=curated,
        magazine=MAGAZINE,
    )


@router.get("/pros", response_model=list[ProOut])
def list_pros(category: str | None = None, db: Session = Depends(get_db)):
    """고수찾기 탭: 카테고리 칩 필터를 지원하는 고수 목록."""
    stmt = select(ProProfile).options(joinedload(ProProfile.user)).order_by(
        ProProfile.rating.desc(), ProProfile.review_count.desc()
    )
    if category:
        stmt = stmt.where(ProProfile.category == category)
    return [pro_to_out(p) for p in db.scalars(stmt).all()]


@router.get("/posts", response_model=list[PostOut])
def list_posts(db: Session = Depends(get_db)):
    """커뮤니티 탭: 인기글 전체 목록."""
    return db.scalars(select(Post).order_by(Post.likes.desc(), Post.id)).all()
