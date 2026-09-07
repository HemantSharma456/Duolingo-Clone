from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserProgress, LessonAttempt
from app.schemas import UserResponse, UpdateDailyGoalRequest, RefillHeartsRequest, RefillHeartsResponse

router = APIRouter(prefix="/api/users", tags=["Users"])

def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    Returns the active demo user ('Alex'). If database is unseeded, raises 404.
    """
    user = db.query(User).filter(User.username == "Alex").first()
    if not user:
        # Fallback to first user in database
        user = db.query(User).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Default learner not found. Please seed the database."
        )
    return user

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    """Fetch current learner profile, XP, streak, hearts, and gems."""
    return user

@router.put("/me/daily-goal", response_model=UserResponse)
def update_daily_goal(
    req: UpdateDailyGoalRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Update learner's daily XP goal target."""
    if req.daily_goal not in [10, 20, 30, 50]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Daily goal must be 10, 20, 30, or 50 XP"
        )
    user.daily_goal = req.daily_goal
    db.commit()
    db.refresh(user)
    return user

@router.post("/me/refill-hearts", response_model=RefillHeartsResponse)
def refill_hearts(
    req: RefillHeartsRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Refills hearts either by:
    1. 'practice': free +1 heart (max 5)
    2. 'gems': spends 350 gems to completely restore all 5 hearts
    """
    if req.method == "gems":
        cost = 350
        if user.gems < cost:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not enough gems! Practice to earn hearts or complete lessons."
            )
        user.gems -= cost
        user.hearts = user.max_hearts
        message = "Hearts fully restored using 350 gems!"
    elif req.method == "practice":
        user.hearts = min(user.max_hearts, user.hearts + 1)
        message = "Practice completed! Restored +1 heart."
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refill method. Use 'gems' or 'practice'."
        )

    db.commit()
    db.refresh(user)

    return RefillHeartsResponse(
        hearts=user.hearts,
        gems=user.gems,
        message=message
    )

@router.get("/me/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Returns comprehensive learning stats for profile display."""
    completed_skills = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.is_completed == True)
        .count()
    )
    total_lessons_attempted = (
        db.query(LessonAttempt)
        .filter(LessonAttempt.user_id == user.id)
        .count()
    )

    return {
        "username": user.username,
        "avatar_url": user.avatar_url,
        "total_xp": user.total_xp,
        "streak": user.streak,
        "hearts": user.hearts,
        "gems": user.gems,
        "daily_goal": user.daily_goal,
        "daily_xp": user.daily_xp,
        "completed_skills": completed_skills,
        "total_lessons_attempted": total_lessons_attempted,
        "joined_date": user.created_at.strftime("%B %Y")
    }

@router.post("/shop/purchase")
def purchase_shop_item(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Handles mock in-game purchases using gems."""
    item_type = payload.get("item_type")
    if item_type == "heart_refill":
        cost = 350
        if user.gems < cost:
            raise HTTPException(status_code=400, detail="Not enough gems for Heart Refill!")
        user.gems -= cost
        user.hearts = user.max_hearts
        msg = "Hearts fully restored to 5!"
    elif item_type == "streak_freeze":
        cost = 200
        if user.gems < cost:
            raise HTTPException(status_code=400, detail="Not enough gems for Streak Freeze!")
        user.gems -= cost
        msg = "Streak Freeze activated! Your streak is protected."
    elif item_type == "super_trial":
        user.hearts = user.max_hearts
        msg = "Super Duolingo activated for your account!"
    else:
        raise HTTPException(status_code=400, detail="Unknown shop item.")

    db.commit()
    db.refresh(user)
    return {
        "success": True,
        "message": msg,
        "hearts": user.hearts,
        "gems": user.gems
    }
