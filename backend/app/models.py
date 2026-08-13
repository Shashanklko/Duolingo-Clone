from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    language_code = Column(String, unique=True, index=True)  # "es", "fr", "de", etc.
    name = Column(String)              # "Spanish", "French", etc.
    flag_code = Column(String)         # flag CDN code: "es", "fr", "br", etc.
    learners = Column(String, nullable=True)  # "42M learners"

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    streak = Column(Integer, default=1)
    xp = Column(Integer, default=100)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=500)
    is_guest = Column(Boolean, default=True)

    progress = relationship("UserProgress", back_populates="user")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    title = Column(String)
    description = Column(String)
    color = Column(String)
    order_index = Column(Integer)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String)
    icon = Column(String) # star, chest, trophy, fast-forward
    position = Column(Integer, default=0) # offset along serpentine path
    character = Column(String, nullable=True) # duo

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    title = Column(String)
    xp_reward = Column(Integer, default=20)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String) # image_choice, word_bank, select_translation
    question = Column(String)
    options_json = Column(Text) # JSON string of options array
    correct_answer = Column(String)
    image_url = Column(String, nullable=True)

    lesson = relationship("Lesson", back_populates="exercises")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")
