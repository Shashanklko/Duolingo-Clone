from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/units", tags=["Units"])

@router.get("", response_model=List[schemas.UnitBase])
def get_learning_path(
    course: Optional[str] = Query(None, description="Language code, e.g. 'es', 'fr', 'hi'"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Unit)

    if course:
        course_obj = db.query(models.Course).filter(models.Course.language_code == course).first()
        if course_obj:
            query = query.filter(models.Unit.course_id == course_obj.id)
        else:
            # Fallback for unlisted/custom courses to return default units roadmap
            first_course = db.query(models.Course).first()
            if first_course:
                query = query.filter(models.Unit.course_id == first_course.id)

    units = query.order_by(models.Unit.order_index).all()
    
    result = []
    for idx, u in enumerate(units):
        unit_skills = db.query(models.Skill).filter(models.Skill.unit_id == u.id).all()
        
        # Calculate lock status
        skills_data = []
        for s_idx, s in enumerate(unit_skills):
            status = "locked"
            if idx == 0 and s_idx == 0:
                status = "current"

            lesson = db.query(models.Lesson).filter(models.Lesson.skill_id == s.id).first()
            lesson_id = lesson.id if lesson else None
            
            skills_data.append(schemas.SkillBase(
                id=s.id,
                title=s.title,
                icon=s.icon,
                position=s.position,
                character=s.character,
                status=status,
                lesson_id=lesson_id
            ))
            
        result.append(schemas.UnitBase(
            id=u.id,
            title=u.title,
            description=u.description,
            color=u.color,
            order_index=u.order_index,
            skills=skills_data
        ))
        
    return result
