from datetime import date, timedelta
from typing import Tuple
from sqlalchemy.orm import Session
from app.models import User, DailyActivity

def update_user_streak_and_activity(db: Session, user: User, xp_earned: int) -> Tuple[int, bool]:
    """
    Computes and persists user's daily streak and daily activity record.
    
    Rules:
    1. If user already practiced today:
       - Streak remains the same.
       - Daily XP increases.
    2. If user practiced yesterday (consecutive day):
       - Streak increments by 1.
       - Daily XP resets for the new day and adds current XP.
    3. If user missed one or more days (or first time user):
       - Streak resets to 1.
       - Daily XP resets for the new day and adds current XP.
    
    Returns: (current_streak, streak_increased_flag)
    """
    today = date.today()
    yesterday = today - timedelta(days=1)
    streak_increased = False

    if user.last_active_date == today:
        # Already active today: keep streak, accumulate daily XP
        user.daily_xp += xp_earned
    elif user.last_active_date == yesterday:
        # Practiced yesterday: streak continues!
        user.streak += 1
        user.daily_xp = xp_earned
        streak_increased = True
    else:
        # First day or missed days: start new streak at 1
        user.streak = 1
        user.daily_xp = xp_earned
        streak_increased = True

    user.last_active_date = today

    # Update or insert into DailyActivity table
    activity = (
        db.query(DailyActivity)
        .filter(DailyActivity.user_id == user.id, DailyActivity.activity_date == today)
        .first()
    )
    if activity:
        activity.xp_earned += xp_earned
        activity.lessons_completed += 1
    else:
        activity = DailyActivity(
            user_id=user.id,
            activity_date=today,
            xp_earned=xp_earned,
            lessons_completed=1
        )
        db.add(activity)

    db.commit()
    db.refresh(user)

    return user.streak, streak_increased
