from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User
from app.routers.users import get_current_user
from app.schemas import LeaderboardResponse, LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Computes dynamic leaderboard by querying users ordered by total XP descending.
    Places the logged-in learner in their true rank alongside seeded competitors.
    """
    users = (
        db.query(User)
        .order_by(desc(User.total_xp), desc(User.streak), User.id.asc())
        .limit(25)
        .all()
    )

    entries = []
    for rank, u in enumerate(users, start=1):
        entries.append(
            LeaderboardEntry(
                rank=rank,
                user_id=u.id,
                username=u.username,
                avatar_url=u.avatar_url or "/avatars/duo_default.png",
                total_xp=u.total_xp,
                is_current_user=(u.id == user.id)
            )
        )

    # Determine league based on user total XP
    league_name = "Bronze League"
    if user.total_xp >= 200:
        league_name = "Gold League"
    elif user.total_xp >= 80:
        league_name = "Silver League"

    return LeaderboardResponse(
        league_name=league_name,
        days_remaining=3,
        entries=entries
    )
