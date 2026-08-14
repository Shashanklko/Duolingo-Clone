from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
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
            streak=0,
            xp=0,
            hearts=5,
            gems=500,
            last_active_date=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user

@router.get("/me", response_model=schemas.UserProfileResponse)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # Create default guest user if database is fresh
        user = models.User(name="Guest Learner", is_guest=True, streak=0, xp=0, hearts=5, gems=500, last_active_date=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Get completed lesson ids
    progress_rows = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.completed == True
    ).all()
    completed_ids = [p.lesson_id for p in progress_rows if p.lesson_id is not None]

    return schemas.UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        streak=user.streak,
        xp=user.xp,
        hearts=user.hearts,
        gems=user.gems,
        is_guest=user.is_guest,
        last_active_date=user.last_active_date,
        completed_lesson_ids=completed_ids
    )

@router.post("/sync-progress", response_model=schemas.UserProfileResponse)
def sync_progress(req: schemas.ProgressSyncRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id, name="Learner", is_guest=True, streak=0, xp=0, hearts=5, gems=500, last_active_date=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    if req.xp is not None:
        user.xp = req.xp
    if req.streak is not None:
        user.streak = req.streak
    if req.hearts is not None:
        user.hearts = req.hearts
    if req.gems is not None:
        user.gems = req.gems
    if req.last_active_date is not None:
        user.last_active_date = req.last_active_date

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

    progress_rows = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.completed == True
    ).all()
    completed_ids = [p.lesson_id for p in progress_rows if p.lesson_id is not None]

    return schemas.UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        streak=user.streak,
        xp=user.xp,
        hearts=user.hearts,
        gems=user.gems,
        is_guest=user.is_guest,
        last_active_date=user.last_active_date,
        completed_lesson_ids=completed_ids
    )

@router.get("/leaderboard", response_model=List[schemas.LeaderboardUser])
def get_leaderboard(user_id: int = 1, db: Session = Depends(get_db)):
    # Fetch real users sorted by XP
    users = db.query(models.User).order_by(models.User.xp.desc()).limit(20).all()
    
    # Generate leaderboard entries with current user highlighted
    leaderboard = []
    user_in_top = False
    
    for rank, u in enumerate(users, start=1):
        is_curr = (u.id == user_id)
        if is_curr:
            user_in_top = True
        leaderboard.append(schemas.LeaderboardUser(
            id=u.id,
            name=u.name,
            xp=u.xp,
            streak=u.streak,
            rank=rank,
            is_current_user=is_curr
        ))

    # Add mock rivals if database has few users
    if len(leaderboard) < 5:
        mock_rivals = [
            ("Elena Rostova", 420, 14),
            ("Marco Rossi", 380, 8),
            ("Kenji Tanaka", 290, 12),
            ("Sarah Jenkins", 210, 5),
            ("Lucas Silva", 160, 3)
        ]
        for name, xp, streak in mock_rivals:
            leaderboard.append(schemas.LeaderboardUser(
                id=len(leaderboard) + 100,
                name=name,
                xp=xp,
                streak=streak,
                rank=len(leaderboard) + 1,
                is_current_user=False
            ))
            
    # Re-sort
    leaderboard.sort(key=lambda x: x.xp, reverse=True)
    for idx, item in enumerate(leaderboard, start=1):
        item.rank = idx
        
    return leaderboard

@router.post("/purchase", response_model=schemas.UserProfileResponse)
def handle_shop_purchase(req: schemas.PurchaseRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.gems < req.gem_cost:
        raise HTTPException(status_code=400, detail="Insufficient gems")

    user.gems -= req.gem_cost

    if req.item_type == "hearts_refill":
        user.hearts = 5
    elif req.item_type == "streak_freeze":
        user.streak += 1

    db.commit()
    db.refresh(user)

    progress_rows = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.completed == True
    ).all()
    completed_ids = [p.lesson_id for p in progress_rows if p.lesson_id is not None]

    return schemas.UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        streak=user.streak,
        xp=user.xp,
        hearts=user.hearts,
        gems=user.gems,
        is_guest=user.is_guest,
        last_active_date=user.last_active_date,
        completed_lesson_ids=completed_ids
    )
