from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/login", response_model=schemas.UserBase)
def login_or_create_user(req: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    user = None
    if req.email:
        user = db.query(models.User).filter(models.User.email == req.email).first()
    
    if not user:
        user = models.User(
            name=req.name,
            email=req.email,
            is_guest=False if req.email else True,
            streak=1,
            xp=100,
            hearts=5,
            gems=500
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

@router.get("/me", response_model=schemas.UserBase)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Create default guest user if database is fresh
        user = models.User(name="Guest Learner", is_guest=True, streak=1, xp=100, hearts=5, gems=500)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/sync-progress", response_model=schemas.UserBase)
def sync_progress(req: schemas.ProgressSyncRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.xp is not None:
        user.xp = req.xp
    if req.streak is not None:
        user.streak = req.streak
    if req.hearts is not None:
        user.hearts = req.hearts
    if req.gems is not None:
        user.gems = req.gems

    if req.completed_lesson_id is not None:
        prog = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == user_id,
            models.UserProgress.lesson_id == req.completed_lesson_id
        ).first()
        
        if not prog:
            prog = models.UserProgress(user_id=user_id, lesson_id=req.completed_lesson_id, completed=True)
            db.add(prog)
        else:
            prog.completed = True

    db.commit()
    db.refresh(user)
    return user
