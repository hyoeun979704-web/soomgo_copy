from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from ..database import SessionLocal, get_db
from ..models import ChatRoom, Message, User
from ..schemas import MessageOut, MessageSendIn, RoomOut
from ..security import decode_token, get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


def _get_room(db: Session, room_id: int, user_id: int) -> ChatRoom:
    room = db.get(ChatRoom, room_id)
    if room is None or user_id not in (room.customer_id, room.pro_id):
        raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다.")
    return room


@router.get("/rooms", response_model=list[RoomOut])
def my_rooms(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rooms = db.scalars(
        select(ChatRoom)
        .options(joinedload(ChatRoom.customer), joinedload(ChatRoom.pro))
        .where(or_(ChatRoom.customer_id == user.id, ChatRoom.pro_id == user.id))
        .order_by(ChatRoom.created_at.desc())
    ).all()
    result = []
    for room in rooms:
        partner = room.pro if room.customer_id == user.id else room.customer
        last = db.scalar(
            select(Message).where(Message.room_id == room.id).order_by(Message.created_at.desc()).limit(1)
        )
        result.append(RoomOut(
            id=room.id,
            partner_name=partner.name,
            last_message=last.content if last else None,
            last_message_at=last.created_at if last else None,
        ))
    return result


@router.get("/rooms/{room_id}/messages", response_model=list[MessageOut])
def room_messages(room_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _get_room(db, room_id, user.id)
    return db.scalars(
        select(Message).where(Message.room_id == room_id).order_by(Message.created_at)
    ).all()


@router.post("/rooms/{room_id}/messages", response_model=MessageOut)
async def send_message(
    room_id: int,
    body: MessageSendIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _get_room(db, room_id, user.id)
    message = Message(room_id=room_id, sender_id=user.id, content=body.content)
    db.add(message)
    db.commit()
    db.refresh(message)
    out = MessageOut.model_validate(message)
    await manager.broadcast(room_id, out)
    return out


class ConnectionManager:
    """방별 WebSocket 연결을 관리한다. 단일 인스턴스(레일웨이 1 dyno) 전제."""

    def __init__(self) -> None:
        self.rooms: dict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: int, ws: WebSocket) -> None:
        await ws.accept()
        self.rooms[room_id].append(ws)

    def disconnect(self, room_id: int, ws: WebSocket) -> None:
        if ws in self.rooms[room_id]:
            self.rooms[room_id].remove(ws)

    async def broadcast(self, room_id: int, message: MessageOut) -> None:
        for ws in list(self.rooms[room_id]):
            try:
                await ws.send_text(message.model_dump_json())
            except Exception:
                self.disconnect(room_id, ws)


manager = ConnectionManager()


@router.websocket("/ws/{room_id}")
async def chat_ws(ws: WebSocket, room_id: int, token: str):
    """앱 웹뷰는 쿠키가 불안정하므로 토큰을 쿼리 파라미터로 받는다."""
    db = SessionLocal()
    try:
        try:
            user_id = decode_token(token)
            _get_room(db, room_id, user_id)
        except HTTPException:
            await ws.close(code=4401)
            return
        await manager.connect(room_id, ws)
        try:
            while True:
                content = await ws.receive_text()
                message = Message(room_id=room_id, sender_id=user_id, content=content)
                db.add(message)
                db.commit()
                db.refresh(message)
                await manager.broadcast(room_id, MessageOut.model_validate(message))
        except WebSocketDisconnect:
            manager.disconnect(room_id, ws)
    finally:
        db.close()
