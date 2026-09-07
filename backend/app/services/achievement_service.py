from typing import List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models import User, Achievement, UserAchievement, LessonAttempt, UserProgress

def check_and_unlock_achievements(db: Session, user: User) -> List[str]:
    """
    Evaluates all achievement conditions against the learner's persisted stats.
    Awards any new achievements earned and returns a list of newly unlocked titles.
    """
    # Get IDs of already unlocked achievements for this user
    existing_unlocks = {
        ua.achievement_id for ua in (
            db.query(UserAchievement)
            .filter(UserAchievement.user_id == user.id)
            .all()
        )
    }

    all_achievements = db.query(Achievement).all()
    newly_unlocked = []

    # Pre-fetch counts for efficiency
    lesson_attempts_count = db.query(LessonAttempt).filter(LessonAttempt.user_id == user.id).count()
    flawless_attempts_count = (
        db.query(LessonAttempt)
        .filter(LessonAttempt.user_id == user.id, LessonAttempt.mistakes_count == 0)
        .count()
    )
    completed_skills_count = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.is_completed == True)
        .count()
    )

    for ach in all_achievements:
        if ach.id in existing_unlocks:
            continue

        should_unlock = False

        if ach.code == "first_lesson" and lesson_attempts_count >= 1:
            should_unlock = True
        elif ach.code == "perfectionist" and flawless_attempts_count >= 1:
            should_unlock = True
        elif ach.code == "streak_3" and user.streak >= 3:
            should_unlock = True
        elif ach.code == "streak_7" and user.streak >= 7:
            should_unlock = True
        elif ach.code == "xp_50" and user.total_xp >= 50:
            should_unlock = True
        elif ach.code == "xp_200" and user.total_xp >= 200:
            should_unlock = True
        elif ach.code == "xp_500" and user.total_xp >= 500:
            should_unlock = True
        elif ach.code == "skill_master" and completed_skills_count >= 1:
            should_unlock = True
        elif ach.code == "gems_600" and user.gems >= 600:
            should_unlock = True

        if should_unlock:
            user_ach = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                unlocked_at=datetime.now(timezone.utc)
            )
            db.add(user_ach)
            newly_unlocked.append(ach.title)

    if newly_unlocked:
        db.commit()

    return newly_unlocked
