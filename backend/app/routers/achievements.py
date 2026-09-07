from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Achievement, UserAchievement, User, LessonAttempt, UserProgress
from app.routers.users import get_current_user
from app.schemas import AchievementsResponse, AchievementItem

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

@router.get("", response_model=AchievementsResponse)
def get_user_achievements(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Returns all game achievements along with current user's unlock status and numerical progress.
    """
    achievements = db.query(Achievement).all()
    user_unlocks = {
        ua.achievement_id: ua.unlocked_at for ua in (
            db.query(UserAchievement)
            .filter(UserAchievement.user_id == user.id)
            .all()
        )
    }

    # Gather user progress metrics
    lesson_attempts_count = db.query(LessonAttempt).filter(LessonAttempt.user_id == user.id).count()
    completed_skills_count = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.is_completed == True)
        .count()
    )

    items = []
    for ach in achievements:
        is_unlocked = ach.id in user_unlocks
        unlocked_at = user_unlocks.get(ach.id)

        # Calculate current progress count toward this achievement
        progress = 0
        if ach.category == "streak":
            progress = min(ach.threshold, user.streak)
        elif ach.category == "xp":
            progress = min(ach.threshold, user.total_xp)
        elif ach.category == "lessons":
            progress = min(ach.threshold, lesson_attempts_count)
        elif ach.category == "skills":
            progress = min(ach.threshold, completed_skills_count)
        elif ach.category == "gems":
            progress = min(ach.threshold, user.gems)
        else:
            progress = 1 if is_unlocked else 0

        items.append(
            AchievementItem(
                id=ach.id,
                code=ach.code,
                title=ach.title,
                description=ach.description,
                badge_icon=ach.badge_icon,
                category=ach.category,
                threshold=ach.threshold,
                is_unlocked=is_unlocked,
                unlocked_at=unlocked_at,
                progress=progress
            )
        )

    return AchievementsResponse(achievements=items)
