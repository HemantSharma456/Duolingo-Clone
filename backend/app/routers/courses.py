from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Course, Unit, Skill, Lesson, UserProgress, User
from app.routers.users import get_current_user
from app.schemas import CoursePathResponse, UnitPathItem, SkillPathItem, CourseItem, SelectCourseRequest

router = APIRouter(prefix="/api/courses", tags=["Courses & Learning Path"])

def build_course_path(db: Session, user: User, course: Course) -> CoursePathResponse:
    """Helper to build full hierarchical learning path with user progression for a course."""
    user_progresses = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id)
        .all()
    )
    progress_map = {p.skill_id: p for p in user_progresses}

    units = (
        db.query(Unit)
        .filter(Unit.course_id == course.id)
        .order_by(Unit.unit_number.asc())
        .all()
    )

    unit_items = []
    is_first_skill_overall = True

    for u in units:
        skills = (
            db.query(Skill)
            .filter(Skill.unit_id == u.id)
            .order_by(Skill.order_index.asc())
            .all()
        )

        skill_items = []
        for s in skills:
            prog = progress_map.get(s.id)

            lessons_completed = prog.lessons_completed if prog else 0
            is_completed = prog.is_completed if prog else False
            is_unlocked = prog.is_unlocked if prog else is_first_skill_overall

            first_lesson = (
                db.query(Lesson)
                .filter(Lesson.skill_id == s.id)
                .order_by(Lesson.order_index.asc())
                .first()
            )
            first_lesson_id = first_lesson.id if first_lesson else None

            skill_items.append(
                SkillPathItem(
                    id=s.id,
                    unit_id=s.unit_id,
                    order_index=s.order_index,
                    title=s.title,
                    icon_name=s.icon_name,
                    total_lessons=s.total_lessons,
                    lessons_completed=lessons_completed,
                    is_unlocked=is_unlocked,
                    is_completed=is_completed,
                    first_lesson_id=first_lesson_id
                )
            )
            is_first_skill_overall = False

        unit_items.append(
            UnitPathItem(
                id=u.id,
                unit_number=u.unit_number,
                title=u.title,
                description=u.description,
                color_theme=u.color_theme,
                skills=skill_items
            )
        )

    return CoursePathResponse(
        course_id=course.id,
        course_title=course.title,
        language_code=course.language_code,
        flag_emoji=course.flag_emoji,
        units=unit_items
    )

@router.get("/current/path", response_model=CoursePathResponse)
def get_current_learning_path(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Returns path for user's currently selected language course."""
    course = None
    if user.current_course_id:
        course = db.query(Course).filter(Course.id == user.current_course_id).first()
    if not course:
        course = db.query(Course).first()

    if not course:
        raise HTTPException(status_code=404, detail="No courses found.")

    return build_course_path(db, user, course)

@router.get("/{course_id}/path", response_model=CoursePathResponse)
def get_specific_course_path(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Returns path for any chosen course ID."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found.")

    return build_course_path(db, user, course)

@router.post("/select", response_model=CoursePathResponse)
def select_active_course(
    req: SelectCourseRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Switches active course for the learner.
    Ensures the first skill in the newly selected course is unlocked for the user.
    """
    course = db.query(Course).filter(Course.id == req.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail=f"Course {req.course_id} not found.")

    user.current_course_id = course.id

    # Ensure first skill is unlocked for this user in this course
    first_skill = (
        db.query(Skill)
        .join(Skill.unit)
        .filter(Skill.unit.has(course_id=course.id))
        .order_by(Skill.order_index.asc())
        .first()
    )
    if first_skill:
        prog = (
            db.query(UserProgress)
            .filter(UserProgress.user_id == user.id, UserProgress.skill_id == first_skill.id)
            .first()
        )
        if not prog:
            prog = UserProgress(
                user_id=user.id,
                skill_id=first_skill.id,
                lessons_completed=0,
                is_unlocked=True,
                is_completed=False
            )
            db.add(prog)
        else:
            prog.is_unlocked = True

    db.commit()
    db.refresh(user)

    return build_course_path(db, user, course)

@router.get("", response_model=List[CourseItem])
def list_available_courses(db: Session = Depends(get_db)):
    """List all available language courses with flags and learner statistics."""
    courses = db.query(Course).all()
    return courses


