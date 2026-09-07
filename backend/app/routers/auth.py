import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Course, Skill, UserProgress
from app.schemas import RegisterRequest, LoginRequest, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    """Hash password using SHA-256 with a project salt."""
    salt = "duo_secure_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

@router.post("/register", response_model=UserResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new learner account from onboarding flow."""
    # Check if username or email is already taken
    existing = db.query(User).filter(
        (User.username == req.username) | (User.email == req.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered. Please login."
        )

    # Verify course exists
    course = db.query(Course).filter(Course.id == req.course_id).first()
    if not course:
        course = db.query(Course).first()
    course_id = course.id if course else 1

    new_user = User(
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        current_course_id=course_id,
        daily_goal=req.daily_goal,
        motivation=req.motivation or "Learn for travel and culture",
        proficiency=req.proficiency or "Beginner",
        onboarding_completed=True,
        hearts=5,
        max_hearts=5,
        gems=500,
        total_xp=0,
        daily_xp=0,
        streak=1
    )
    db.add(new_user)
    db.flush()

    # Unlock the first skill in this user's chosen course
    first_skill = (
        db.query(Skill)
        .join(Skill.unit)
        .filter(Skill.unit.has(course_id=course_id))
        .order_by(Skill.order_index.asc())
        .first()
    )
    if first_skill:
        prog = UserProgress(
            user_id=new_user.id,
            skill_id=first_skill.id,
            lessons_completed=0,
            is_unlocked=True,
            is_completed=False
        )
        db.add(prog)

    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=UserResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate existing learner."""
    hashed = hash_password(req.password)
    user = db.query(User).filter(
        (User.username == req.username) | (User.email == req.username)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found with provided username or email"
        )

    # For seeded demo users or password check
    if user.password_hash != "pbkdf2_demo_hash" and user.password_hash != hashed:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    return user

@router.get("/me", response_model=UserResponse)
def get_auth_me(db: Session = Depends(get_db)):
    """Get active session learner."""
    # Default to Alex or the most recently active user
    user = db.query(User).filter(User.username == "Alex").first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No learners exist.")
    return user

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out."}
