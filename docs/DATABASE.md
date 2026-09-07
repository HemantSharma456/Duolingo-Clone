# Database Design & Schema Documentation: Duolingo Clone

## 1. Schema Overview & Entity Relationship

The database is designed according to **Third Normal Form (3NF)** principles to eliminate redundancy, ensure referential integrity, and accurately reflect Duolingo's pedagogical and gamification domain.

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   courses    │──1:N───▶│    units     │──1:N───▶│    skills    │
└──────────────┘         └──────────────┘         └──────┬───────┘
                                                         │ 1:N
                                                         ▼
                                                  ┌──────────────┐
                                                  │   lessons    │
                                                  └──────┬───────┘
                                                         │ 1:N
                                                         ▼
                                                  ┌──────────────┐
                                                  │  exercises   │
                                                  └──────────────┘

┌──────────────┐ 1:N     ┌──────────────┐ N:1     ┌──────────────┐
│    users     │◀───────▶│user_progress │◀───────▶│    skills    │
└──────┬───────┘         └──────────────┘         └──────────────┘
       │
       ├──1:N──▶┌───────────────────┐
       │        │  lesson_attempts  │
       │        └───────────────────┘
       ├──1:N──▶┌───────────────────┐
       │        │ daily_activities  │
       │        └───────────────────┘
       └──1:N──▶┌───────────────────┐ N:1 ┌──────────────┐
                │ user_achievements │◀───▶│ achievements │
                └───────────────────┘     └──────────────┘
```

---

## 2. Table Specifications

### 1. `users`
Stores learner profile information, current game status, and currency balances.
- `id` (INTEGER, Primary Key)
- `username` (VARCHAR(50), Unique, Indexed)
- `email` (VARCHAR(100), Unique, Indexed)
- `avatar_url` (VARCHAR(255))
- `hearts` (INTEGER, Default: 5)
- `max_hearts` (INTEGER, Default: 5)
- `gems` (INTEGER, Default: 500)
- `total_xp` (INTEGER, Default: 0)
- `daily_xp` (INTEGER, Default: 0)
- `daily_goal` (INTEGER, Default: 20)
- `streak` (INTEGER, Default: 0)
- `last_active_date` (DATE, Nullable)
- `current_course_id` (INTEGER, FK -> `courses.id`, Nullable)
- `created_at` (DATETIME, Default: UTC Now)

### 2. `courses`
Represents language courses offered.
- `id` (INTEGER, Primary Key)
- `title` (VARCHAR(100)) — e.g., "Spanish"
- `language_code` (VARCHAR(10)) — e.g., "es"
- `flag_emoji` (VARCHAR(10)) — e.g., "🇪🇸"
- `description` (VARCHAR(255))

### 3. `units`
High-level curriculum chapters within a course.
- `id` (INTEGER, Primary Key)
- `course_id` (INTEGER, FK -> `courses.id`, Not Null)
- `unit_number` (INTEGER, Not Null)
- `title` (VARCHAR(100)) — e.g., "Unit 1: Getting Started"
- `description` (VARCHAR(255))
- `color_theme` (VARCHAR(20)) — Hex code (e.g. `#58cc02`)

### 4. `skills`
Individual interactive nodes along the learning path.
- `id` (INTEGER, Primary Key)
- `unit_id` (INTEGER, FK -> `units.id`, Not Null)
- `order_index` (INTEGER, Not Null)
- `title` (VARCHAR(100)) — e.g., "Basics 1"
- `icon_name` (VARCHAR(50)) — e.g., "coffee", "chat"
- `total_lessons` (INTEGER, Default: 3)

### 5. `lessons`
Individual practice sessions within a skill.
- `id` (INTEGER, Primary Key)
- `skill_id` (INTEGER, FK -> `skills.id`, Not Null)
- `order_index` (INTEGER, Not Null)
- `title` (VARCHAR(100)) — e.g., "Lesson 1 of 2"
- `xp_reward` (INTEGER, Default: 10)

### 6. `exercises`
The atomic challenges delivered during a lesson.
- `id` (INTEGER, Primary Key)
- `lesson_id` (INTEGER, FK -> `lessons.id`, Not Null)
- `order_index` (INTEGER, Not Null)
- `type` (VARCHAR(50), Not Null) — Enum: `multiple_choice`, `word_bank`, `match_pairs`, `fill_in_blank`, `type_answer`
- `prompt` (VARCHAR(255), Not Null) — e.g., "Translate this sentence"
- `prompt_translation` (VARCHAR(255), Nullable)
- `audio_text` (VARCHAR(255), Nullable) — Text for TTS speech synthesis
- `options_json` (TEXT, Nullable) — Serialized JSON options/word bank array
- `correct_answer` (TEXT, Not Null) — Exact string or serialized JSON dictionary of matching pairs
- `metadata_json` (TEXT, Nullable) — Extra hints, prefix/suffix cloze tokens

### 7. `user_progress`
Tracks learner progress and unlock states for every skill.
- `id` (INTEGER, Primary Key)
- `user_id` (INTEGER, FK -> `users.id`, Not Null)
- `skill_id` (INTEGER, FK -> `skills.id`, Not Null)
- `lessons_completed` (INTEGER, Default: 0)
- `is_unlocked` (BOOLEAN, Default: False)
- `is_completed` (BOOLEAN, Default: False)

### 8. `lesson_attempts`
Auditable log of finished lesson attempts.
- `id` (INTEGER, Primary Key)
- `user_id` (INTEGER, FK -> `users.id`, Not Null)
- `lesson_id` (INTEGER, FK -> `lessons.id`, Not Null)
- `score` (INTEGER, 0 to 100)
- `xp_earned` (INTEGER, Not Null)
- `mistakes_count` (INTEGER, Default: 0)
- `is_completed` (BOOLEAN, Default: True)
- `completed_at` (DATETIME, Default: UTC Now)

### 9. `daily_activities`
Aggregates activity per day for streak calculations and daily goal tracking.
- `id` (INTEGER, Primary Key)
- `user_id` (INTEGER, FK -> `users.id`, Not Null)
- `activity_date` (DATE, Not Null)
- `xp_earned` (INTEGER, Default: 0)
- `lessons_completed` (INTEGER, Default: 0)

### 10. `achievements`
Catalog of unlockable game badges.
- `id` (INTEGER, Primary Key)
- `code` (VARCHAR(50), Unique, Indexed) — e.g. "streak_3", "xp_50"
- `title` (VARCHAR(100), Not Null)
- `description` (VARCHAR(255), Not Null)
- `badge_icon` (VARCHAR(50), Not Null) — e.g., "🔥", "🎯"
- `category` (VARCHAR(50), Not Null) — `streak`, `xp`, `lessons`, `skills`, `gems`
- `threshold` (INTEGER, Default: 1)

### 11. `user_achievements`
Many-to-many junction recording when learners unlock badges.
- `id` (INTEGER, Primary Key)
- `user_id` (INTEGER, FK -> `users.id`, Not Null)
- `achievement_id` (INTEGER, FK -> `achievements.id`, Not Null)
- `unlocked_at` (DATETIME, Default: UTC Now)

---

## 3. Key Design Decisions

1. **Normalized Exercise Model**: Rather than creating 5 separate tables for 5 exercise formats, a single `exercises` table uses a `type` discriminator column with JSON payload storage for flexible options (`options_json`) and answers (`correct_answer`). This makes creating new lessons seamless and reduces schema complexity.
2. **Server-Side Security**: The client API serializer deliberately excludes the `correct_answer` column when serving exercises to prevent users from inspecting the network payload to solve questions.
3. **Optimistic Locking & Cascades**: All parent entities (`Course`, `Unit`, `Skill`, `Lesson`) configure `cascade="all, delete-orphan"` in SQLAlchemy, ensuring data cleanliness when content is updated.
