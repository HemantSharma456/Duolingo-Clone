from typing import Optional, List
import json
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Lesson, Exercise, User, Skill, Unit, Course
from app.routers.users import get_current_user
from app.schemas import (
    LessonResponse, ExerciseResponse,
    ExerciseSubmissionRequest, ExerciseSubmissionResponse,
    LessonCompleteRequest, LessonCompleteResponse
)
from app.services.lesson_service import process_exercise_submission, calculate_lesson_xp
from app.services.streak_service import update_user_streak_and_activity
from app.services.progress_service import complete_lesson_progress
from app.services.achievement_service import check_and_unlock_achievements
from app.services.curriculum_service import get_calibrated_level_exercises

router = APIRouter(prefix="/api/lessons", tags=["Lessons & Exercises"])

def shuffle_options_for_client(ex_type: str, options: Any) -> Any:
    """Ensures multiple choice, word bank, and fill-in-the-blank options are shuffled."""
    if not options or not isinstance(options, list):
        return options
    if ex_type in ("multiple_choice", "word_bank", "fill_in_blank"):
        shuffled = list(options)
        import random
        random.shuffle(shuffled)
        return shuffled
    return options

def parse_exercise_for_client(ex: Exercise) -> ExerciseResponse:
    """Helper to parse JSON fields safely while concealing the correct answer from client."""
    options = None
    if ex.options_json:
        try:
            options = json.loads(ex.options_json)
        except Exception:
            options = ex.options_json

    metadata = None
    if ex.metadata_json:
        try:
            metadata = json.loads(ex.metadata_json)
        except Exception:
            metadata = ex.metadata_json

    return ExerciseResponse(
        id=ex.id,
        lesson_id=ex.lesson_id,
        order_index=ex.order_index,
        type=ex.type,
        prompt=ex.prompt,
        prompt_translation=ex.prompt_translation,
        audio_text=ex.audio_text,
        options=shuffle_options_for_client(ex.type, options),
        metadata=metadata
    )

@router.get("/practice/session", response_model=LessonResponse)
def get_practice_session(
    course_id: Optional[int] = None,
    lang: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Generates an interactive practice session pulling 5 varied exercises
    across all 5 types strictly from the user's active language course.
    """
    # 1. Resolve language code
    lang_code = None
    if course_id:
        c = db.query(Course).filter(Course.id == course_id).first()
        if c:
            lang_code = c.language_code
    if not lang_code and lang:
        lang_code = lang.lower().strip()
    if not lang_code and user and user.current_course_id:
        c = db.query(Course).filter(Course.id == user.current_course_id).first()
        if c:
            lang_code = c.language_code
    if not lang_code:
        lang_code = "en"

    # Use calibrated exercises for the specific language
    calibrated = get_calibrated_level_exercises(lang_code, 1)
    if calibrated and calibrated.get("exercises") and len(calibrated["exercises"]) > 0:
        ex_list = calibrated["exercises"]
        sample_size = min(5, len(ex_list))
        sampled = random.sample(ex_list, sample_size)
        return LessonResponse(
            id=9999,
            skill_id=1,
            skill_title=f"{lang_code.upper()} Practice & Heart Refill",
            order_index=1,
            title="Heart Recovery Practice",
            xp_reward=10,
            exercises=[
                ExerciseResponse(
                    id=ex["id"],
                    lesson_id=9999,
                    order_index=idx,
                    type=ex["type"],
                    prompt=ex["prompt"],
                    prompt_translation=ex.get("prompt_translation"),
                    audio_text=ex.get("audio_text"),
                    options=shuffle_options_for_client(ex["type"], ex.get("options")),
                    metadata=ex.get("metadata")
                )
                for idx, ex in enumerate(sampled, 1)
            ]
        )

    # Fallback to database query specifically filtered by course
    active_course_id = course_id or user.current_course_id
    query = db.query(Exercise).join(Lesson).join(Skill).join(Unit)
    if active_course_id:
        query = query.filter(Unit.course_id == active_course_id)
    exercises = query.all()

    if not exercises:
        # Never fall back to Spanish! Pull from English calibrated
        calibrated = get_calibrated_level_exercises("en", 1)
        exercises = calibrated.get("exercises", [])
        return LessonResponse(
            id=9999,
            skill_id=1,
            skill_title="Practice & Heart Refill",
            order_index=1,
            title="Heart Recovery Practice",
            xp_reward=10,
            exercises=[
                ExerciseResponse(
                    id=ex["id"],
                    lesson_id=9999,
                    order_index=idx,
                    type=ex["type"],
                    prompt=ex["prompt"],
                    prompt_translation=ex.get("prompt_translation"),
                    audio_text=ex.get("audio_text"),
                    options=shuffle_options_for_client(ex["type"], ex.get("options")),
                    metadata=ex.get("metadata")
                )
                for idx, ex in enumerate(exercises[:5], 1)
            ]
        )

    sample_size = min(5, len(exercises))
    sampled = random.sample(exercises, sample_size)

    return LessonResponse(
        id=9999,
        skill_id=1,
        skill_title="Practice & Heart Refill",
        order_index=1,
        title="Heart Recovery Practice",
        xp_reward=10,
        exercises=[parse_exercise_for_client(e) for e in sampled]
    )

@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(
    lesson_id: int,
    course_id: Optional[int] = None,
    lang: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Fetch lesson with ordered exercises calibrated for ascending difficulty matching Duolingo.
    Guarantees questions strictly correspond to the chosen course/language.
    """
    lang_code = None

    # 1. Course ID query parameter takes highest precedence
    if course_id:
        course_obj = db.query(Course).filter(Course.id == course_id).first()
        if course_obj:
            lang_code = course_obj.language_code

    # 2. Explicit lang query parameter
    if not lang_code and lang:
        lang_code = lang.lower().strip()

    # 3. User's active course in database
    if not lang_code and user and user.current_course_id:
        course_obj = db.query(Course).filter(Course.id == user.current_course_id).first()
        if course_obj:
            lang_code = course_obj.language_code

    # 4. Fallback to English (NEVER Spanish!)
    if not lang_code:
        lang_code = "en"

    # Progressive calibrated curriculum for the active language & level
    calibrated = get_calibrated_level_exercises(lang_code, lesson_id)
    if calibrated and calibrated.get("exercises") and len(calibrated["exercises"]) > 0:
        ex_responses = []
        for idx, ex in enumerate(calibrated["exercises"], 1):
            ex_responses.append(
                ExerciseResponse(
                    id=ex["id"],
                    lesson_id=lesson_id,
                    order_index=idx,
                    type=ex["type"],
                    prompt=ex["prompt"],
                    prompt_translation=ex.get("prompt_translation"),
                    audio_text=ex.get("audio_text"),
                    options=shuffle_options_for_client(ex["type"], ex.get("options")),
                    metadata=ex.get("metadata")
                )
            )
        return LessonResponse(
            id=lesson_id,
            skill_id=1,
            skill_title=calibrated.get("skill_title", f"{lang_code.upper()} Skill"),
            order_index=lesson_id,
            title=calibrated.get("title", f"Level {lesson_id}"),
            xp_reward=calibrated.get("xp_reward", 10),
            exercises=ex_responses
        )

    # Fallback to database lesson strictly filtered for this course
    course_filter = db.query(Course).filter(Course.language_code == lang_code).first()
    target_course_id = course_filter.id if course_filter else (user.current_course_id or 1)

    lesson = (
        db.query(Lesson)
        .join(Skill)
        .join(Unit)
        .filter(Unit.course_id == target_course_id, Lesson.order_index == lesson_id)
        .first()
    )
    if not lesson:
        lesson = (
            db.query(Lesson)
            .join(Skill)
            .join(Unit)
            .filter(Unit.course_id == target_course_id)
            .first()
        )

    if not lesson:
        # Ultimate fallback: return English level 1
        calibrated_en = get_calibrated_level_exercises("en", 1)
        return LessonResponse(
            id=lesson_id,
            skill_id=1,
            skill_title="English Foundations",
            order_index=lesson_id,
            title="Basics 1",
            xp_reward=10,
            exercises=[
                ExerciseResponse(
                    id=ex["id"],
                    lesson_id=lesson_id,
                    order_index=idx,
                    type=ex["type"],
                    prompt=ex["prompt"],
                    prompt_translation=ex.get("prompt_translation"),
                    audio_text=ex.get("audio_text"),
                    options=shuffle_options_for_client(ex["type"], ex.get("options")),
                    metadata=ex.get("metadata")
                )
                for idx, ex in enumerate(calibrated_en["exercises"], 1)
            ]
        )

    skill = db.query(Skill).filter(Skill.id == lesson.skill_id).first()
    skill_title = skill.title if skill else f"{lang_code.upper()} Skill"

    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson.id)
        .order_by(Exercise.order_index.asc())
        .all()
    )

    return LessonResponse(
        id=lesson.id,
        skill_id=lesson.skill_id,
        skill_title=skill_title,
        order_index=lesson.order_index,
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        exercises=[parse_exercise_for_client(ex) for ex in exercises]
    )


@router.post("/{lesson_id}/submit-exercise", response_model=ExerciseSubmissionResponse)
def submit_exercise(
    lesson_id: int,
    req: ExerciseSubmissionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Validates learner's exercise answer, deducts heart on mistake,
    and returns immediate feedback with the correct solution.
    """
    try:
        is_correct, correct_display, explanation, hearts_remaining = process_exercise_submission(
            db=db,
            user=user,
            exercise_id=req.exercise_id,
            user_answer=req.answer
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return ExerciseSubmissionResponse(
        is_correct=is_correct,
        correct_answer=correct_display,
        explanation=explanation,
        hearts_remaining=hearts_remaining
    )

@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(
    lesson_id: int,
    req: LessonCompleteRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Finalizes completed lesson:
    1. Validates learner has hearts remaining (or is in practice mode).
    2. Calculates XP server-side (base + combo bonus).
    3. Updates daily streak and daily activity table.
    4. Advances skill progression and unlocks next skill.
    5. Evaluates and awards achievements.
    """
    # Check virtual practice lesson ID
    if lesson_id == 9999:
        # Virtual practice lesson: award +1 heart and 10 XP
        user.hearts = min(user.max_hearts, user.hearts + 1)
        xp_earned = 10
        user.total_xp += xp_earned
        streak, streak_increased = update_user_streak_and_activity(db, user, xp_earned)
        unlocked = check_and_unlock_achievements(db, user)
        db.commit()
        db.refresh(user)

        return LessonCompleteResponse(
            success=True,
            xp_earned=xp_earned,
            total_xp=user.total_xp,
            streak=streak,
            streak_increased=streak_increased,
            hearts_remaining=user.hearts,
            gems_earned=15,
            skill_completed=False,
            next_skill_unlocked=False,
            unlocked_achievements=unlocked
        )

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        # Virtual / progressive calibrated level completed
        base_xp = 25 if lesson_id in (6, 12, 18, 24) else 10
        if req.mistakes_count == 0:
            xp_earned = base_xp + 5
        elif req.mistakes_count <= 2:
            xp_earned = base_xp + 2
        else:
            xp_earned = base_xp

        user.total_xp += xp_earned
        streak, streak_increased = update_user_streak_and_activity(db, user, xp_earned)
        unlocked_achievements = check_and_unlock_achievements(db, user)
        db.commit()
        db.refresh(user)

        return LessonCompleteResponse(
            success=True,
            xp_earned=xp_earned,
            total_xp=user.total_xp,
            streak=streak,
            streak_increased=streak_increased,
            hearts_remaining=user.hearts,
            gems_earned=15,
            skill_completed=True,
            next_skill_unlocked=True,
            unlocked_achievements=unlocked_achievements
        )

    # Calculate XP safely on the backend
    xp_earned = calculate_lesson_xp(lesson, req.mistakes_count)

    # Advance streak & daily activity
    streak, streak_increased = update_user_streak_and_activity(db, user, xp_earned)

    # Advance skill progress & unlock next skill if finished
    skill_completed, next_skill_unlocked = complete_lesson_progress(
        db=db,
        user=user,
        lesson_id=lesson.id,
        mistakes_count=req.mistakes_count,
        xp_earned=xp_earned
    )

    # Check and award achievements
    unlocked_achievements = check_and_unlock_achievements(db, user)

    return LessonCompleteResponse(
        success=True,
        xp_earned=xp_earned,
        total_xp=user.total_xp,
        streak=streak,
        streak_increased=streak_increased,
        hearts_remaining=user.hearts,
        gems_earned=15,
        skill_completed=skill_completed,
        next_skill_unlocked=next_skill_unlocked,
        unlocked_achievements=unlocked_achievements
    )
