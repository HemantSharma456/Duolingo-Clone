from datetime import datetime, date, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), default="pbkdf2_demo_hash", nullable=False)
    avatar_url = Column(String(255), default="/avatars/duo_default.png")
    hearts = Column(Integer, default=5, nullable=False)
    max_hearts = Column(Integer, default=5, nullable=False)
    gems = Column(Integer, default=500, nullable=False)
    total_xp = Column(Integer, default=0, nullable=False)
    daily_xp = Column(Integer, default=0, nullable=False)
    daily_goal = Column(Integer, default=20, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    last_active_date = Column(Date, nullable=True)
    current_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    onboarding_completed = Column(Boolean, default=False, nullable=False)
    motivation = Column(String(100), nullable=True)
    proficiency = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    progresses = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    daily_activities = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    language_code = Column(String(10), nullable=False)
    flag_emoji = Column(String(10), nullable=False)
    description = Column(String(255), nullable=True)
    learner_count = Column(String(50), default="10M learners", nullable=False)

    # Relationships
    units = relationship("Unit", back_populates="course", order_by="Unit.unit_number", cascade="all, delete-orphan")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    color_theme = Column(String(20), default="#58cc02", nullable=False)

    # Relationships
    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order_index", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    icon_name = Column(String(50), default="book", nullable=False)
    total_lessons = Column(Integer, default=3, nullable=False)

    # Relationships
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order_index", cascade="all, delete-orphan")
    user_progresses = relationship("UserProgress", back_populates="skill", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, default=10, nullable=False)

    # Relationships
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order_index", cascade="all, delete-orphan")
    attempts = relationship("LessonAttempt", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)  # multiple_choice, word_bank, match_pairs, fill_in_blank, type_answer
    prompt = Column(String(255), nullable=False)
    prompt_translation = Column(String(255), nullable=True)
    audio_text = Column(String(255), nullable=True)
    options_json = Column(Text, nullable=True)     # JSON array or object
    correct_answer = Column(Text, nullable=False)  # exact string or JSON string
    metadata_json = Column(Text, nullable=True)    # extra hints, sentence tokens, etc.

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    lessons_completed = Column(Integer, default=0, nullable=False)
    is_unlocked = Column(Boolean, default=False, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)

    # Relationships
    user = relationship("User", back_populates="progresses")
    skill = relationship("Skill", back_populates="user_progresses")


class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    score = Column(Integer, default=100, nullable=False)
    xp_earned = Column(Integer, default=10, nullable=False)
    mistakes_count = Column(Integer, default=0, nullable=False)
    is_completed = Column(Boolean, default=True, nullable=False)
    completed_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="attempts")
    lesson = relationship("Lesson", back_populates="attempts")


class DailyActivity(Base):
    __tablename__ = "daily_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_date = Column(Date, default=date.today, nullable=False)
    xp_earned = Column(Integer, default=0, nullable=False)
    lessons_completed = Column(Integer, default=0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="daily_activities")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    badge_icon = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)  # streak, xp, lessons, skills
    threshold = Column(Integer, default=1, nullable=False)

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
