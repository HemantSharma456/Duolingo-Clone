from typing import List, Optional, Any, Dict
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict

class UserBase(BaseModel):
    username: str
    email: str
    avatar_url: Optional[str] = None
    hearts: int = 5
    max_hearts: int = 5
    gems: int = 500
    total_xp: int = 0
    daily_xp: int = 0
    daily_goal: int = 20
    streak: int = 0
    last_active_date: Optional[date] = None
    onboarding_completed: bool = True
    motivation: Optional[str] = None
    proficiency: Optional[str] = None

class UserResponse(UserBase):
    id: int
    current_course_id: Optional[int] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    course_id: int = 1
    daily_goal: int = 20
    motivation: Optional[str] = None
    proficiency: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class CourseItem(BaseModel):
    id: int
    title: str
    language_code: str
    flag_emoji: str
    description: Optional[str] = None
    learner_count: str
    model_config = ConfigDict(from_attributes=True)

class SelectCourseRequest(BaseModel):
    course_id: int

class UpdateDailyGoalRequest(BaseModel):
    daily_goal: int

class RefillHeartsRequest(BaseModel):
    method: str = "practice"  # "practice" (free +1 heart) or "gems" (cost 350 gems -> full 5 hearts)

class RefillHeartsResponse(BaseModel):
    hearts: int
    gems: int
    message: str


# --- LEARNING PATH SCHEMAS ---

class SkillPathItem(BaseModel):
    id: int
    unit_id: int
    order_index: int
    title: str
    icon_name: str
    total_lessons: int
    lessons_completed: int
    is_unlocked: bool
    is_completed: bool
    first_lesson_id: Optional[int] = None

class UnitPathItem(BaseModel):
    id: int
    unit_number: int
    title: str
    description: Optional[str]
    color_theme: str
    skills: List[SkillPathItem]

class CoursePathResponse(BaseModel):
    course_id: int
    course_title: str
    language_code: str
    flag_emoji: str
    units: List[UnitPathItem]


# --- EXERCISE & LESSON SCHEMAS ---

class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    order_index: int
    type: str  # multiple_choice, word_bank, match_pairs, fill_in_blank, type_answer
    prompt: str
    prompt_translation: Optional[str] = None
    audio_text: Optional[str] = None
    options: Any = None  # Parsed JSON options
    metadata: Any = None # Parsed JSON metadata

class LessonResponse(BaseModel):
    id: int
    skill_id: int
    skill_title: str
    order_index: int
    title: str
    xp_reward: int
    exercises: List[ExerciseResponse]

class ExerciseSubmissionRequest(BaseModel):
    exercise_id: int
    answer: Any  # can be str, list of str, or dict of pairs

class ExerciseSubmissionResponse(BaseModel):
    is_correct: bool
    correct_answer: Any
    explanation: Optional[str] = None
    hearts_remaining: int

class LessonCompleteRequest(BaseModel):
    mistakes_count: int = 0
    time_spent_seconds: Optional[int] = 0

class LessonCompleteResponse(BaseModel):
    success: bool
    xp_earned: int
    total_xp: int
    streak: int
    streak_increased: bool
    hearts_remaining: int
    gems_earned: int
    skill_completed: bool
    next_skill_unlocked: bool
    unlocked_achievements: List[str]


# --- LEADERBOARD SCHEMAS ---

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    avatar_url: str
    total_xp: int
    is_current_user: bool

class LeaderboardResponse(BaseModel):
    league_name: str
    days_remaining: int
    entries: List[LeaderboardEntry]


# --- ACHIEVEMENT SCHEMAS ---

class AchievementItem(BaseModel):
    id: int
    code: str
    title: str
    description: str
    badge_icon: str
    category: str
    threshold: int
    is_unlocked: bool
    unlocked_at: Optional[datetime] = None
    progress: int

class AchievementsResponse(BaseModel):
    achievements: List[AchievementItem]
