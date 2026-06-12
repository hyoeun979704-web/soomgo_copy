"""초기 데이터 시드: 숨고 앱 홈탭 구성(카테고리·배너·인기 서비스·추천 고수)을 채운다."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Banner, Category, ProProfile, Service, User
from .security import hash_password

CATEGORIES = [
    ("이사/청소", "🚚"),
    ("설치/수리", "🔧"),
    ("인테리어", "🏠"),
    ("외주", "💻"),
    ("이벤트/뷰티", "💄"),
    ("취미/자기계발", "🎨"),
    ("과외", "📚"),
    ("알바", "🧑‍💼"),
    ("심부름", "🛵"),
    ("더보기", "➕"),
]

SERVICES = {
    "이사/청소": [("원룸 이사", "📦", 18420), ("입주 청소", "🧹", 15210), ("사무실 이사", "🏢", 7300)],
    "설치/수리": [("에어컨 설치", "❄️", 21300), ("보일러 수리", "🔥", 9800), ("도배", "🖌️", 8600)],
    "인테리어": [("욕실 리모델링", "🛁", 6400), ("주방 인테리어", "🍳", 5200)],
    "외주": [("로고 디자인", "🎨", 12800), ("웹사이트 제작", "🖥️", 11000)],
    "이벤트/뷰티": [("웨딩 스냅", "📸", 7700), ("퍼스널 컬러", "🌈", 9100)],
    "취미/자기계발": [("보컬 레슨", "🎤", 6900), ("PT", "💪", 19800)],
    "과외": [("영어 과외", "🇬🇧", 16700), ("수학 과외", "➗", 15400)],
}

BANNERS = [
    ("첫 견적 요청하고", "최대 1만원 쿠폰 받기", "#00C7AE"),
    ("이사 시즌 특집", "입주 청소 고수 모아보기", "#5C6BC0"),
    ("숨은고수 모집", "전문가로 활동을 시작해보세요", "#26A69A"),
]

PROS = [
    ("김민준", "kim.pro@soomgo.test", "에어컨 설치 10년 경력, 당일 방문 가능합니다.", "서울 강남구", 10, 4.9, 321, 540),
    ("이서연", "lee.pro@soomgo.test", "입주 청소 전문 업체 운영, 꼼꼼한 마무리 약속드립니다.", "서울 마포구", 7, 4.8, 198, 350),
    ("박지훈", "park.pro@soomgo.test", "수학 전문 과외, 내신/수능 모두 대응합니다.", "경기 성남시", 5, 5.0, 87, 120),
    ("최수아", "choi.pro@soomgo.test", "웨딩 스냅 전문 포토그래퍼입니다.", "서울 송파구", 8, 4.9, 264, 410),
]


def seed(db: Session) -> None:
    if db.scalar(select(Category).limit(1)) is not None:
        return

    categories: dict[str, Category] = {}
    for sort, (name, icon) in enumerate(CATEGORIES):
        category = Category(name=name, icon=icon, sort=sort)
        db.add(category)
        categories[name] = category

    for category_name, services in SERVICES.items():
        for name, image, count in services:
            db.add(Service(category=categories[category_name], name=name, image=image, request_count=count))

    for sort, (title, subtitle, color) in enumerate(BANNERS):
        db.add(Banner(title=title, subtitle=subtitle, bg_color=color, sort=sort))

    for name, email, intro, region, years, rating, reviews, hires in PROS:
        pro = User(email=email, password_hash=hash_password("soomgo123!"), name=name, role="pro")
        db.add(pro)
        db.add(ProProfile(
            user=pro, intro=intro, region=region, career_years=years,
            rating=rating, review_count=reviews, hire_count=hires,
        ))

    db.commit()
