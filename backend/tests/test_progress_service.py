from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import User, Course, Unit, Skill, Lesson, UserProgress, Achievement
from app.services.progress_service import complete_lesson_progress
from app.services.achievement_service import check_and_unlock_achievements

def get_test_db():
    engine = create_engine("sqlite:///:memory:")
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return TestingSessionLocal()

def test_progress_and_skill_unlocking():
    db = get_test_db()
    # Setup Course, Unit, 2 Skills, and Lessons
    course = Course(title="Spanish", language_code="es", flag_emoji="🇪🇸")
    db.add(course)
    db.flush()

    unit = Unit(course_id=course.id, unit_number=1, title="Unit 1", color_theme="#58cc02")
    db.add(unit)
    db.flush()

    s1 = Skill(unit_id=unit.id, order_index=1, title="Basics", total_lessons=1)
    s2 = Skill(unit_id=unit.id, order_index=2, title="Greetings", total_lessons=1)
    db.add_all([s1, s2])
    db.flush()

    l1 = Lesson(skill_id=s1.id, order_index=1, title="Lesson 1", xp_reward=10)
    l2 = Lesson(skill_id=s2.id, order_index=1, title="Lesson 2", xp_reward=10)
    db.add_all([l1, l2])
    db.flush()

    user = User(username="Learner", email="learner@test.com", total_xp=0, gems=100)
    db.add(user)
    db.commit()

    # Complete lesson 1 of skill 1
    skill_completed, next_unlocked = complete_lesson_progress(
        db, user, lesson_id=l1.id, mistakes_count=0, xp_earned=15
    )

    assert skill_completed is True
    assert next_unlocked is True
    assert user.total_xp == 15
    assert user.gems == 115

    # Check that skill 2 progress is now unlocked
    prog2 = db.query(UserProgress).filter(UserProgress.user_id == user.id, UserProgress.skill_id == s2.id).first()
    assert prog2 is not None
    assert prog2.is_unlocked is True

def test_achievement_unlocking():
    db = get_test_db()
    user = User(username="Achiever", email="ach@test.com", total_xp=60, streak=3, gems=650)
    db.add(user)

    ach_xp = Achievement(code="xp_50", title="Scholar", description="Earn 50 XP", badge_icon="📚", category="xp", threshold=50)
    ach_str = Achievement(code="streak_3", title="Wildfire", description="3-day streak", badge_icon="🔥", category="streak", threshold=3)
    db.add_all([ach_xp, ach_str])
    db.commit()

    unlocked = check_and_unlock_achievements(db, user)
    assert "Scholar" in unlocked
    assert "Wildfire" in unlocked
