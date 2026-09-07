from datetime import date, timedelta
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import User, DailyActivity
from app.services.streak_service import update_user_streak_and_activity

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

def test_streak_consecutive_days():
    db = get_test_db()
    today = date.today()
    yesterday = today - timedelta(days=1)
    user = User(
        username="TestUser",
        email="test@duo.com",
        streak=5,
        last_active_date=yesterday,
        daily_xp=20
    )
    db.add(user)
    db.commit()

    streak, increased = update_user_streak_and_activity(db, user, xp_earned=15)
    assert streak == 6
    assert increased is True
    assert user.last_active_date == today
    assert user.daily_xp == 15

def test_streak_same_day_repeat():
    db = get_test_db()
    today = date.today()
    user = User(
        username="TestUser2",
        email="test2@duo.com",
        streak=3,
        last_active_date=today,
        daily_xp=10
    )
    db.add(user)
    db.commit()

    streak, increased = update_user_streak_and_activity(db, user, xp_earned=15)
    assert streak == 3
    assert increased is False
    assert user.daily_xp == 25  # 10 + 15

def test_streak_missed_days_reset():
    db = get_test_db()
    three_days_ago = date.today() - timedelta(days=3)
    user = User(
        username="TestUser3",
        email="test3@duo.com",
        streak=10,
        last_active_date=three_days_ago,
        daily_xp=50
    )
    db.add(user)
    db.commit()

    streak, increased = update_user_streak_and_activity(db, user, xp_earned=10)
    assert streak == 1
    assert increased is True
    assert user.daily_xp == 10
