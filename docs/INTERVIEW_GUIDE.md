# Duolingo Clone: SDE Interview Preparation Guide

This guide is written specifically for you to confidently explain and defend your full-stack engineering decisions during the Scaler AI Labs evaluation interview.

---

## 1. Project Pitches

### 30-Second Elevator Pitch
> "I built a full-stack Duolingo clone using Next.js with TypeScript on the frontend, a Python FastAPI backend, and an SQLite relational database managed via SQLAlchemy. The application replicates Duolingo's iconic Feather design system and the core learning loop, featuring all five official exercise types, server-side XP calculation, a daily streak engine, dynamic leaderboards, a heart life economy, audio synthesis, and dark mode."

### 1-Minute Architectural Pitch
> "My primary objective was to build a true full-stack pedagogical system rather than a superficial UI mock. The frontend is built in Next.js 16 with modular React components and responsive layouts for desktop and mobile. All state changes—such as exercise submissions, heart deductions, streak advances, and badge unlocks—are handled securely on the FastAPI backend to prevent client-side cheating. The backend separates concerns into dedicated service layers (`lesson_service`, `streak_service`, `progress_service`, `achievement_service`) backed by a normalized SQLite relational schema with 10 tables."

### 3-Minute Comprehensive Walkthrough
> "Let's walk through the architecture:
> 1. **Presentation**: The learner experiences a serpentine learning path with circular SVG progress rings. When clicking an unlocked node, a popover loads the lesson. The lesson player handles all 5 formats: Multiple Choice, Word Bank translation with draggable/tappable tokens, Match Pairs with animated pairing, Fill in the Blank, and Freeform Typing with accent helpers.
> 2. **Audio & Feedback**: I used the Web Audio API to synthesize harmonious chimes and buzzers without external asset dependencies, alongside the Web Speech API for Spanish pronunciation.
> 3. **Gamification Integrity**: When an answer is submitted to `/api/lessons/{id}/submit-exercise`, the backend normalizes the input, checks the correct answer, and decrements hearts if incorrect. If hearts reach zero, an Out-of-Hearts modal offers gem refills or free practice. On completion, the backend computes XP with accuracy bonuses, updates consecutive daily streaks in the `daily_activities` table, advances skill crowns, unlocks the next skill along the tree, and checks achievement thresholds.
> 4. **Scalability**: While SQLite is ideal for a local single-node assignment, I structured the domain models so that transitioning to a production PostgreSQL database with Redis caching and horizontally scaled FastAPI containers is seamless."

---

## 2. Top Technical Interview Questions & Model Answers

### Q1: Why did you choose FastAPI over Flask or Django?
- **Short Answer**: FastAPI provides native async support, automated OpenAPI documentation, high throughput with Starlette/Uvicorn, and built-in Pydantic validation.
- **Detailed Explanation**: Django is a heavyweight framework with built-in templates and admin, which creates unnecessary overhead for a decoupled REST API with Next.js. Flask lacks built-in asynchronous request handling and type validation without third-party plugins. FastAPI allows us to define strict Pydantic schemas that automatically validate incoming request bodies and generate OpenAPI Swagger documentation at `/docs`.
- **Project Example**: In `backend/app/routers/lessons.py`, the `ExerciseSubmissionRequest` schema guarantees that `exercise_id` is an integer and `answer` is present before the service layer executes.

### Q2: How do you prevent XP cheating?
- **Short Answer**: The frontend never calculates or submits XP values; XP is derived entirely server-side upon lesson validation.
- **Detailed Explanation**: If a client could send `{ "xp": 5000 }`, any user could inspect the network tab and forge requests. In our system, the client only sends the exercise ID and the chosen answer to `POST /api/lessons/{id}/submit-exercise`. On lesson completion, `services/lesson_service.py:calculate_lesson_xp()` inspects the recorded mistakes on the backend, calculates the base XP (10) plus combo accuracy bonuses, and commits the transaction directly to the database.
- **Project Example**: Look at `backend/app/services/lesson_service.py` lines 105-115.

### Q3: How does your streak calculation handle edge cases?
- **Short Answer**: It compares `date.today()` with `user.last_active_date`, distinguishing today, yesterday, and older dates.
- **Detailed Explanation**:
  - If `last_active_date == today`: The user already practiced today. The streak remains unchanged, and `user.daily_xp` accumulates.
  - If `last_active_date == yesterday`: The user practiced on consecutive days. The streak increments by 1 (`user.streak += 1`), and `user.daily_xp` resets for the new day.
  - If `last_active_date < yesterday` or `None`: The user missed one or more days. The streak resets to 1.
- **Project Example**: See `backend/app/services/streak_service.py:update_user_streak_and_activity()`.

### Q4: Why did you use React Context instead of Redux?
- **Short Answer**: Redux introduces unnecessary boilerplate and bundle overhead for an app whose source of truth is a REST database.
- **Detailed Explanation**: Duolingo's global state consists primarily of server-synced values (hearts, gems, streak, user profile) and UI preferences (sound toggle, dark mode). Three focused Context providers (`GameContext`, `SoundContext`, `ThemeContext`) provide reactive state without external dependencies or action creators.

---

## 3. "Show Me The Code" Quick Reference

| Interviewer Question | Code Location | What to Highlight |
|---|---|---|
| *"Where is answer validation implemented?"* | `backend/app/services/lesson_service.py:18` | Function `validate_exercise_answer()`: regex text normalization, lowercase comparison, and pair dictionary matching. |
| *"Where are hearts deducted on mistakes?"* | `backend/app/services/lesson_service.py:90` | `process_exercise_submission()`: `user.hearts = max(0, user.hearts - 1)` committed to SQLite. |
| *"Where is the streak logic?"* | `backend/app/services/streak_service.py:7` | `update_user_streak_and_activity()`: Calendar date arithmetic with `timedelta(days=1)`. |
| *"How does the next skill unlock?"* | `backend/app/services/progress_service.py:48` | `complete_lesson_progress()`: Queries the next skill by `order_index + 1` or the first skill of the next unit. |
| *"Where is Web Audio synthesis implemented?"* | `frontend/src/context/SoundContext.tsx:39` | `playCorrectSound()`: Generates sine wave oscillators at 523Hz, 659Hz, 784Hz, and 1046Hz with exponential decay. |
| *"Where is the SQLite connection configured?"* | `backend/app/database.py:17` | `set_sqlite_pragma()` connect event listener setting `foreign_keys=ON` and `journal_mode=MEMORY`. |
