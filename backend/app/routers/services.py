from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Service
from ..schemas import ServiceOut

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
def list_services(category_id: int | None = None, q: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Service).order_by(Service.request_count.desc())
    if category_id is not None:
        stmt = stmt.where(Service.category_id == category_id)
    if q:
        stmt = stmt.where(Service.name.contains(q))
    return db.scalars(stmt).all()


@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="서비스를 찾을 수 없습니다.")
    return service
