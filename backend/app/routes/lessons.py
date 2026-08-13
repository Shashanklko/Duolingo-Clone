import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/lessons", tags=["Lessons"])

@router.get("/{lesson_id}", response_model=schemas.LessonBase)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = db.query(models.Exercise).filter(models.Exercise.lesson_id == lesson_id).all()
    
    exercise_schemas = []
    for ex in exercises:
        try:
            options = json.loads(ex.options_json)
        except Exception:
            options = []
            
        exercise_schemas.append(schemas.ExerciseBase(
            id=ex.id,
            type=ex.type,
            question=ex.question,
            options=options,
            correct_answer=ex.correct_answer,
            image_url=ex.image_url
        ))

    return schemas.LessonBase(
        id=lesson.id,
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        exercises=exercise_schemas
    )
