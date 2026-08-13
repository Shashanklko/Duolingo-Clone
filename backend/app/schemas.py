from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any

class ExerciseBase(BaseModel):
    id: int
    type: str
    question: str
    options: List[Any]
    correct_answer: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class LessonBase(BaseModel):
    id: int
    title: str
    xp_reward: int
    exercises: List[ExerciseBase] = []

    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    id: int
    title: str
    icon: str
    position: int
    character: Optional[str] = None
    status: str = "locked" # current, completed, locked
    lesson_id: Optional[int] = None

    class Config:
        from_attributes = True

class UnitBase(BaseModel):
    id: int
    title: str
    description: str
    color: str
    order_index: int
    skills: List[SkillBase] = []

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    id: int
    language_code: str
    name: str
    flag_code: str
    learners: Optional[str] = None

    class Config:
        from_attributes = True

class CourseWithUnits(CourseBase):
    units: List[UnitBase] = []

class UserBase(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    streak: int
    xp: int
    hearts: int
    gems: int
    is_guest: bool

    class Config:
        from_attributes = True

class UserLoginRequest(BaseModel):
    name: str
    email: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str
    email: Optional[str] = None
    initial_xp: Optional[int] = 100
    initial_hearts: Optional[int] = 5
    initial_gems: Optional[int] = 500

class ProgressSyncRequest(BaseModel):
    xp: Optional[int] = None
    streak: Optional[int] = None
    hearts: Optional[int] = None
    gems: Optional[int] = None
    completed_lesson_id: Optional[int] = None
