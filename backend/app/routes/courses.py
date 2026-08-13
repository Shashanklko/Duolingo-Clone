from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/courses", tags=["Courses"])

@router.get("", response_model=List[schemas.CourseBase])
def list_courses(db: Session = Depends(get_db)):
    """Return all available courses."""
    return db.query(models.Course).order_by(models.Course.id).all()

@router.get("/{language_code}", response_model=schemas.CourseBase)
def get_course(language_code: str, db: Session = Depends(get_db)):
    """Return a single course by language code."""
    course = db.query(models.Course).filter(models.Course.language_code == language_code).first()
    if not course:
        raise HTTPException(status_code=404, detail=f"Course '{language_code}' not found")
    return course
