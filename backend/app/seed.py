"""초기 데이터 시드: 실제 숨고 앱 홈탭 구성에 맞춘 카테고리·서비스·고수·인기글·포트폴리오.

문구·업체명·후기는 모두 데모용 자체 제작 콘텐츠다.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Banner, Category, Portfolio, Post, ProProfile, Review, Service, User
from .security import hash_password

# 실제 앱 홈탭 카테고리 그리드 순서 (전체보기는 프런트 UI 항목)
CATEGORIES = [
    ("이사/청소", "🚚"),
    ("설치/수리", "🔧"),
    ("인테리어", "🛋️"),
    ("외주", "💼"),
    ("이벤트", "🎉"),
    ("취업/직무", "🪪"),
    ("과외", "🎓"),
    ("취미/자기계발", "🏀"),
    ("자동차", "🚗"),
    ("법률/금융", "📘"),
    ("기타", "👕"),
]

SERVICES = {
    "이사/청소": [
        ("이사/입주 청소업체", "🧹", 21500),
        ("원룸/소형 이사", "📦", 18400),
        ("가정이사", "🚛", 12700),
        ("방충망 설치 및 수리", "🪟", 5400),
        ("바퀴벌레 퇴치", "🪳", 4800),
        ("해충방역", "🦟", 4100),
    ],
    "설치/수리": [
        ("에어컨 설치 및 수리", "❄️", 20300),
        ("에어컨 청소", "🌀", 15200),
        ("싱크대 교체", "🚰", 6900),
        ("도배장판 시공", "🖌️", 8600),
    ],
    "인테리어": [
        ("욕실/화장실 리모델링", "🛁", 7400),
        ("주방 인테리어", "🍳", 5200),
    ],
    "외주": [("쇼핑몰 창업", "🛒", 9800), ("로고 디자인", "🎨", 12800)],
    "이벤트": [("결혼식 준비", "💐", 7700), ("웨딩 스냅", "📸", 7100)],
    "취업/직무": [("이력서/자소서 컨설팅", "📄", 6300)],
    "과외": [("영어 과외", "🇬🇧", 16700), ("수학 과외", "➗", 15400)],
    "취미/자기계발": [
        ("퍼스널트레이닝(PT)", "💪", 19800),
        ("수영 레슨", "🏊", 8200),
        ("보컬 레슨", "🎤", 6900),
    ],
    "자동차": [("자동차 출장 정비", "🔩", 4500)],
    "법률/금융": [("세무 상담", "🧾", 3900)],
    "기타": [("심부름", "🛵", 5100)],
}

BANNERS = [
    ("최대 1,000만 원 보증되는", "안전결제로 거래해요", "#693BF2"),
    ("조건별 추가 혜택까지", "최대 52만 원 드려요!", "#F2A1D2"),
    ("처음이라면", "첫 견적 요청하고 쿠폰 받기", "#4B2ECC"),
]

# (이름, 이메일, 카테고리, 서비스명, 상호명, 소개, 지역, 경력, 평점, 리뷰, 고용)
PROS = [
    ("김민준", "kim.pro@soomgo.test", "설치/수리", "열쇠/도어락 설치 및 수리", "스피드출장 도어락안심센터",
     "24시간 출장, 당일 방문 가능합니다.", "서울 강남구", 6, 5.0, 54, 540),
    ("이서연", "lee.pro@soomgo.test", "이사/청소", "이사/입주 청소업체", "반짝홈 클리닝",
     "입주 청소 전문, 꼼꼼한 마무리를 약속드립니다.", "서울 마포구", 7, 4.8, 198, 350),
    ("박지훈", "park.pro@soomgo.test", "과외", "수학 과외", "박지훈 수학연구소",
     "내신/수능 모두 대응하는 수학 전문 과외입니다.", "경기 성남시", 5, 5.0, 87, 120),
    ("최수아", "choi.pro@soomgo.test", "이벤트", "웨딩 스냅", "수아 스튜디오",
     "자연스러운 순간을 담는 웨딩 전문 포토그래퍼입니다.", "서울 송파구", 8, 4.9, 264, 410),
    ("정도윤", "jung.pro@soomgo.test", "설치/수리", "에어컨 설치 및 수리", "시원테크 설비",
     "벽걸이/스탠드/시스템 에어컨 전 기종 시공합니다.", "서울 강남구", 10, 4.9, 321, 620),
    ("한지민", "han.pro@soomgo.test", "취미/자기계발", "퍼스널트레이닝(PT)", "지민핏 스튜디오",
     "체형 교정과 다이어트 전문 1:1 트레이닝.", "서울 서초구", 4, 5.0, 142, 230),
]

# (제목, 본문, 지역, 좋아요, 댓글, 이미지)
POSTS = [
    ("벽걸이 에어컨 청소", "거실 벽걸이 에어컨에서 냄새가 나는데 분해 청소 가능한 고수님 계실까요?", "서울 강남구", 0, 0, "🌀"),
    ("입주청소", "다음 주 입주 예정인데 급하게 청소 가능한 고수님 시간 되실까요?", "서울 강남구", 1, 4, "🧹"),
    ("사무실 입주청소", "전용 22평 사무실입니다. 짐은 모두 뺄 예정이고 바닥 왁싱까지 부탁드려요.", "서울 강남구", 0, 0, "🏢"),
]

# (고수 이메일, 작성자 마스킹, 서비스명, 평점, 내용, 사진 이모지)
REVIEWS = [
    ("lee.pro@soomgo.test", "홍**", "이사/입주 청소업체", 5.0,
     "아침 일찍 오셔서 반나절 만에 깔끔하게 끝내주셨어요. 창틀과 베란다 구석까지 꼼꼼했습니다.", "🪟"),
    ("lee.pro@soomgo.test", "박**", "이사/입주 청소업체", 5.0,
     "상담이 친절했고 가격 대비 만족스러운 서비스였습니다.", ""),
    ("lee.pro@soomgo.test", "김**", "이사/입주 청소업체", 4.5,
     "예약 변경에도 유연하게 대응해주셨어요. 다음에도 맡길 생각입니다.", "🧹"),
    ("kim.pro@soomgo.test", "이**", "열쇠/도어락 설치 및 수리", 5.0,
     "밤늦게 연락드렸는데 30분 만에 도착해서 바로 해결해주셨습니다.", "🚪"),
    ("kim.pro@soomgo.test", "정**", "열쇠/도어락 설치 및 수리", 5.0,
     "설치 후 사용법까지 차근차근 알려주셔서 좋았어요.", ""),
    ("jung.pro@soomgo.test", "최**", "에어컨 설치 및 수리", 4.8,
     "배관 정리까지 깔끔하게 마무리해주셨습니다. 시운전도 꼼꼼히 해주셨어요.", "❄️"),
    ("park.pro@soomgo.test", "윤**", "수학 과외", 5.0,
     "개념 설명이 명확해서 아이 성적이 한 학기 만에 많이 올랐습니다.", ""),
    ("choi.pro@soomgo.test", "강**", "웨딩 스냅", 5.0,
     "원하는 분위기를 잘 잡아주셨고 보정본도 빨리 받았습니다.", "📸"),
    ("han.pro@soomgo.test", "서**", "퍼스널트레이닝(PT)", 5.0,
     "체형 분석부터 식단까지 체계적으로 관리해주십니다.", "💪"),
]

# (고수 이메일, 제목, 지역)
PORTFOLIOS = [
    ("lee.pro@soomgo.test", "역삼동 100평 사무실 리모델링 청소", "서울 강남구"),
    ("lee.pro@soomgo.test", "남양주 70평 단독주택 입주 청소", "경기 남양주시"),
    ("jung.pro@soomgo.test", "강남 천장형 시스템 에어컨 설치", "서울 강남구"),
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

    pros_by_email: dict[str, User] = {}
    for name, email, category, service_name, business_name, intro, region, years, rating, reviews, hires in PROS:
        pro = User(email=email, password_hash=hash_password("soomgo123!"), name=name, role="pro")
        db.add(pro)
        db.add(ProProfile(
            user=pro, intro=intro, region=region, career_years=years,
            rating=rating, review_count=reviews, hire_count=hires,
            service_name=service_name, business_name=business_name, category=category,
        ))
        pros_by_email[email] = pro

    db.flush()  # 리뷰가 pro_id FK를 참조할 수 있도록 id를 확정한다

    for email, author, service_name, rating, content, image in REVIEWS:
        db.add(Review(
            pro_id=pros_by_email[email].id, author=author, service_name=service_name,
            rating=rating, content=content, image=image,
        ))

    for title, body, region, likes, comments, image in POSTS:
        db.add(Post(title=title, body=body, region=region, likes=likes, comments=comments, image=image))

    for email, title, region in PORTFOLIOS:
        db.add(Portfolio(pro=pros_by_email[email], title=title, region=region))

    db.commit()
