# REST API Specification: Duolingo Clone

Base URL: `http://127.0.0.1:8000`  
Interactive OpenAPI / Swagger Documentation: `http://127.0.0.1:8000/docs`

---

## 1. User & Profile Endpoints

### `GET /api/users/me`
Retrieves current learner state and balances.
- **Response**: `200 OK`
```json
{
  "id": 1,
  "username": "Alex",
  "email": "alex@scaler.edu",
  "avatar_url": "/avatars/alex.png",
  "hearts": 5,
  "max_hearts": 5,
  "gems": 520,
  "total_xp": 37,
  "daily_xp": 12,
  "daily_goal": 20,
  "streak": 3,
  "last_active_date": "2026-09-07",
  "current_course_id": 1,
  "created_at": "2026-08-24T12:00:00Z"
}
```

### `PUT /api/users/me/daily-goal`
Updates learner's daily target XP.
- **Request Body**:
```json
{ "daily_goal": 30 }
```
- **Validation**: Accepts `10`, `20`, `30`, or `50`. Returns `400 Bad Request` on invalid values.
- **Response**: `200 OK` (Updated User object).

### `POST /api/users/me/refill-hearts`
Restores hearts via gems or free practice.
- **Request Body**:
```json
{ "method": "gems" }
```
- **Behavior**:
  - `gems`: Costs 350 gems, restores full 5 hearts. Returns `400` if gems < 350.
  - `practice`: Awards +1 heart up to maximum 5 hearts for free.
- **Response**: `200 OK`
```json
{
  "hearts": 5,
  "gems": 170,
  "message": "Hearts fully restored using 350 gems!"
}
```

### `GET /api/users/me/stats`
Returns aggregated stats for profile display.
- **Response**: `200 OK`
```json
{
  "username": "Alex",
  "avatar_url": "/avatars/alex.png",
  "total_xp": 37,
  "streak": 3,
  "hearts": 5,
  "gems": 170,
  "daily_goal": 20,
  "daily_xp": 12,
  "completed_skills": 1,
  "total_lessons_attempted": 2,
  "joined_date": "August 2026"
}
```

---

## 2. Learning Path Endpoints

### `GET /api/courses/current/path`
Returns the hierarchical curriculum tree (Units and Skills) enriched with the active user's unlock and crown progress.
- **Response**: `200 OK`
```json
{
  "course_id": 1,
  "course_title": "Spanish",
  "language_code": "es",
  "flag_emoji": "🇪🇸",
  "units": [
    {
      "id": 1,
      "unit_number": 1,
      "title": "Unit 1: Getting Started",
      "description": "Form basic sentences, greet people",
      "color_theme": "#58cc02",
      "skills": [
        {
          "id": 1,
          "unit_id": 1,
          "order_index": 1,
          "title": "Basics 1",
          "icon_name": "coffee",
          "total_lessons": 2,
          "lessons_completed": 2,
          "is_unlocked": true,
          "is_completed": true,
          "first_lesson_id": 1
        },
        {
          "id": 2,
          "unit_id": 1,
          "order_index": 2,
          "title": "Greetings",
          "icon_name": "chat",
          "total_lessons": 2,
          "lessons_completed": 0,
          "is_unlocked": true,
          "is_completed": false,
          "first_lesson_id": 3
        }
      ]
    }
  ]
}
```

---

## 3. Lesson & Exercise Endpoints

### `GET /api/lessons/{lesson_id}`
Delivers an ordered sequence of exercises for a lesson.
- **Security Note**: `correct_answer` is omitted from the JSON payload to prevent client-side inspection.
- **Response**: `200 OK`
```json
{
  "id": 1,
  "skill_id": 1,
  "skill_title": "Basics 1",
  "order_index": 1,
  "title": "Basic Greetings & Words",
  "xp_reward": 10,
  "exercises": [
    {
      "id": 1,
      "lesson_id": 1,
      "order_index": 1,
      "type": "multiple_choice",
      "prompt": "Which of these is 'the boy'?",
      "prompt_translation": "Select matching word",
      "audio_text": "el niño",
      "options": [
        {"text": "el niño", "translation": "the boy"},
        {"text": "la niña", "translation": "the girl"},
        {"text": "la manzana", "translation": "the apple"}
      ],
      "metadata": null
    }
  ]
}
```

### `POST /api/lessons/{lesson_id}/submit-exercise`
Evaluates a single exercise submission, deducts a heart on mistake, and returns instant feedback.
- **Request Body**:
```json
{
  "exercise_id": 1,
  "answer": "el niño"
}
```
- **Response (Correct)**: `200 OK`
```json
{
  "is_correct": true,
  "correct_answer": "el niño",
  "explanation": null,
  "hearts_remaining": 5
}
```
- **Response (Incorrect)**: `200 OK`
```json
{
  "is_correct": false,
  "correct_answer": "el niño",
  "explanation": null,
  "hearts_remaining": 4
}
```

### `POST /api/lessons/{lesson_id}/complete`
Finalizes a completed lesson attempt, awards XP, updates streak, advances skill progression, and awards achievements.
- **Request Body**:
```json
{
  "mistakes_count": 1,
  "time_spent_seconds": 45
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "xp_earned": 12,
  "total_xp": 37,
  "streak": 3,
  "streak_increased": true,
  "hearts_remaining": 4,
  "gems_earned": 15,
  "skill_completed": true,
  "next_skill_unlocked": true,
  "unlocked_achievements": ["Wildfire", "Champion"]
}
```

### `GET /api/lessons/practice/session`
Generates a virtual practice lesson drawing 5 randomized exercises across all unlocked skills. Completing awards +1 heart and 10 XP without deducting hearts on mistakes.

---

## 4. Gamification Endpoints

### `GET /api/leaderboard`
Returns dynamically calculated leaderboard league ranks.
- **Response**: `200 OK`
```json
{
  "league_name": "Bronze League",
  "days_remaining": 3,
  "entries": [
    { "rank": 1, "user_id": 2, "username": "Sophia", "avatar_url": "/avatars/sophia.png", "total_xp": 380, "is_current_user": false },
    { "rank": 8, "user_id": 1, "username": "Alex", "avatar_url": "/avatars/alex.png", "total_xp": 37, "is_current_user": true }
  ]
}
```

### `GET /api/achievements`
Returns the achievements catalog with the learner's unlock timestamps and progress.
- **Response**: `200 OK`
```json
{
  "achievements": [
    {
      "id": 1,
      "code": "first_lesson",
      "title": "First Step",
      "description": "Complete your very first Spanish lesson",
      "badge_icon": "🎯",
      "category": "lessons",
      "threshold": 1,
      "is_unlocked": true,
      "unlocked_at": "2026-09-07T14:35:00Z",
      "progress": 1
    }
  ]
}
```
