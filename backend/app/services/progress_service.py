from typing import Tuple
from sqlalchemy.orm import Session
from app.models import User, Lesson, Skill, Unit, UserProgress, LessonAttempt

def complete_lesson_progress(
    db: Session,
    user: User,
    lesson_id: int,
    mistakes_count: int,
    xp_earned: int
) -> Tuple[bool, bool]:
    """
    Records lesson attempt, advances skill progress, and unlocks the next skill if completed.
    
    Returns: (skill_completed_flag, next_skill_unlocked_flag)
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise ValueError(f"Lesson with id {lesson_id} not found")

    skill = db.query(Skill).filter(Skill.id == lesson.skill_id).first()
    if not skill:
        raise ValueError(f"Skill with id {lesson.skill_id} not found")

    # 1. Record LessonAttempt
    score = max(0, 100 - (mistakes_count * 20))
    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson.id,
        score=score,
        xp_earned=xp_earned,
        mistakes_count=mistakes_count,
        is_completed=True
    )
    db.add(attempt)

    # 2. Update user totals (XP and small gem bonus)
    user.total_xp += xp_earned
    user.gems += 15  # Reward learner with gems on lesson completion

    # 3. Fetch or initialize UserProgress for this skill
    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.skill_id == skill.id)
        .first()
    )
    if not progress:
        progress = UserProgress(
            user_id=user.id,
            skill_id=skill.id,
            lessons_completed=0,
            is_unlocked=True,
            is_completed=False
        )
        db.add(progress)

    # Advance progress
    if progress.lessons_completed < skill.total_lessons:
        progress.lessons_completed += 1

    skill_completed = False
    next_skill_unlocked = False

    if progress.lessons_completed >= skill.total_lessons:
        skill_completed = True
        progress.is_completed = True

        # 4. Unlock the next skill along the learning path
        # Look for next skill in the same unit
        next_skill = (
            db.query(Skill)
            .filter(Skill.unit_id == skill.unit_id, Skill.order_index == skill.order_index + 1)
            .first()
        )

        # If last skill in this unit, look for first skill of next unit
        if not next_skill:
            current_unit = db.query(Unit).filter(Unit.id == skill.unit_id).first()
            if current_unit:
                next_unit = (
                    db.query(Unit)
                    .filter(
                        Unit.course_id == current_unit.course_id,
                        Unit.unit_number == current_unit.unit_number + 1
                    )
                    .first()
                )
                if next_unit:
                    next_skill = (
                        db.query(Skill)
                        .filter(Skill.unit_id == next_unit.id)
                        .order_by(Skill.order_index.asc())
                        .first()
                    )

        if next_skill:
            next_progress = (
                db.query(UserProgress)
                .filter(UserProgress.user_id == user.id, UserProgress.skill_id == next_skill.id)
                .first()
            )
            if not next_progress:
                next_progress = UserProgress(
                    user_id=user.id,
                    skill_id=next_skill.id,
                    lessons_completed=0,
                    is_unlocked=True,
                    is_completed=False
                )
                db.add(next_progress)
            else:
                next_progress.is_unlocked = True
            next_skill_unlocked = True

    db.commit()
    db.refresh(user)

    return skill_completed, next_skill_unlocked
