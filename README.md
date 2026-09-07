# Duolingo Full-Stack Web Application Clone
> **Scaler AI Labs Full-Stack SDE Assignment Submission**  
> Built with **Next.js 16 (TypeScript, React 19, Turbopack)**, **Python FastAPI**, **SQLAlchemy ORM**, and **SQLite**.

---

## 🌟 Executive Summary

This project is an authentic, production-grade replica of the modern **Duolingo Web Application**. It faithfully replicates Duolingo’s signature **Feather design system**, **3D push-down buttons**, **winding learning path**, **interactive lesson player loop**, and **complete gamification mechanics** (XP calculation, daily streaks, heart management, gems economy, dynamic leaderboards, and achievements).

Unlike a superficial UI mock or hardcoded single-language demo, this application is a **data-driven multi-language engine**:
```
Learner Interaction (Next.js 16 TypeScript Frontend)
       ↓  HTTP REST API
FastAPI Application Layer (Routers & Pydantic v2 Schemas)
       ↓
Business Logic Services (Lesson, Streak, Progress, Achievements)
       ↓  SQLAlchemy 2.0 ORM
SQLite Relational Database (Strict Foreign Keys & In-Memory Journal)
```

---

## 🚀 Key Features

### 1. Multi-Language Curriculum Engine (8 World Languages)
The application dynamically drives curriculum content through relational models (`Course → Unit → Skill → Lesson → Exercise`). The frontend components consume database-provided data, meaning changing the course ID completely alters units, skills, exercises, vocabulary, and audio without any frontend code changes:
- 🇪🇸 **Spanish** (35.2M learners)
- 🇫🇷 **French** (24.8M learners)
- 🇩🇪 **German** (16.5M learners)
- 🇮🇹 **Italian** (9.8M learners)
- 🇧🇷 **Portuguese** (6.4M learners)
- 🇯🇵 **Japanese** (18.2M learners)
- 🇮🇳 **Hindi** (11.4M learners)
- 🇺🇸 **English** (45.0M learners)

### 2. Authentic Landing & Guided Onboarding Flow
- **Welcome Landing Page (`/welcome`)**: Hero section with globe graphics, animated Duo owl, bold headline, 3D "GET STARTED" and "I ALREADY HAVE AN ACCOUNT" buttons, and an 8-language preview strip.
- **7-Step Guided Onboarding (`/onboarding`)**:
  1. Language Selection (Cards with flags, learner counts, and selection states)
  2. Discovery Channel (How did you hear about Duolingo?) with animated mascot & speech bubble
  3. Motivation (Why are you learning?)
  4. Curriculum Overview Breakdown (Words, phrases, conversational ability)
  5. Daily Learning Goal (Casual 10 XP, Regular 20 XP, Serious 30 XP, Intense 50 XP)
  6. Starting Point Placement (Start from scratch vs intermediate)
  7. Profile Creation (Username, email, password or quick guest access)

### 3. Shell Layout Isolation
- Full-screen immersion for the **Lesson Player** (`/lesson/*`), **Onboarding** (`/onboarding`), and **Welcome Landing** (`/welcome`), removing the desktop sidebar and topbar for focused user experiences.
- Dashboard pages (`/`, `/practice`, `/leaderboard`, `/profile`, `/shop`, `/settings`) render the desktop navigation sidebar, topbar stats, and mobile navigation bar.

### 4. Interactive Topbar Course Switcher
- Clicking the flag badge in the Topbar opens an interactive popover listing all 8 courses with flag emojis, titles, and learner counts.
- Selecting any course calls `POST /api/courses/select`, updates active course in database, and reloads the learning path immediately.

### 5. Interactive Lesson Player (5 Exercise Formats)
1. **Multiple Choice**: Chunky 3D selectable option cards with keyboard shortcuts (`1`, `2`, `3`).
2. **Translate / Word Bank**: Source sentence with audio pronunciation; interactive assembly area with slotted word chips.
3. **Match Pairs**: Two-column vocabulary matching grid with immediate color-coded pairing and shake animations on mismatch.
4. **Fill in the Blank**: Sentence with dynamic missing slot and selectable options.
5. **Type the Answer**: Text input with real-time accent keyboard helpers and Enter-key submission.
- **Multilingual Native Audio**: Reusable `AudioButton` utilizing Web Speech API with native BCP-47 voices (`fr-FR`, `es-ES`, `de-DE`, `ja-JP`, `it-IT`, `pt-BR`, `hi-IN`, `en-US`).
- **Signature Feedback Drawer**: Sliding bottom bar displaying green checkmark + praise on correct answers, or red cross + correct solution on mistakes.
- **Heart Life System**: 5 hearts max; -1 heart on mistake; heart recovery via practice or shop.
- **Lesson Complete Celebration**: Confetti explosion, celebration fanfare, XP tally, accuracy percentage, streak flame animation, and achievement badges.

### 6. Gamification & Economy
- **Daily Streak Engine**: Compares activity dates distinguishing today, yesterday (+1 streak), and missed days (reset to 1).
- **Server-Determined XP**: Base 10 XP per lesson + accuracy combo bonuses calculated strictly on the backend.
- **Shop & Power-ups**: Functional purchases with gems balance checks:
  - Full Heart Refill (350 💎)
  - Streak Freeze (200 💎)
- **Dynamic Leaderboard**: Real database query ranking the learner dynamically against 10 seeded competitors across leagues (Bronze, Silver, Gold).
- **Achievements**: Automatic server-side evaluation unlocking 9 badges (*First Step*, *Sharpshooter*, *Wildfire*, *Sage*, *Scholar*, *Mastermind*, *Legend*, *Champion*, *Polyglot*).
- **Dark Mode**: System-wide dark mode toggle persisted in local storage with crisp slate-navy palette.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | Next.js 16 + TypeScript | App Router, Server-Side Rendering, Client Components, Context API |
| **Styling** | Vanilla CSS + Design System | Duolingo Feather color tokens, 3D bottom bevels, responsive layouts |
| **Backend** | Python 3.13 + FastAPI | Asynchronous REST endpoints, Pydantic v2 schemas, Dependency Injection |
| **Database** | SQLite + SQLAlchemy 2.0 | Relational schema, Foreign Keys, Memory rollback journal |
| **Audio** | Web Audio API + SpeechSynthesis | Zero-dependency synth sounds (chimes, fanfare) and native language voice TTS |
| **Testing** | Pytest + Custom E2E Suite | 12 backend unit tests + 14 end-to-end integration tests |

---

## 📂 Project Architecture & Directory Structure

```
d:/Duolingo/
├── backend/
│   ├── app/
│   │   ├── database.py          # SQLite engine, pragmas, Base, get_db
│   │   ├── models.py            # SQLAlchemy tables (User, Course, Unit, Skill, Lesson, Exercise, etc.)
│   │   ├── schemas.py           # Pydantic request/response validation
│   │   ├── seed.py              # Curriculum seeder for all 8 languages, achievements, leaderboard
│   │   ├── main.py              # FastAPI app, CORS, lifespan, router mounting
│   │   ├── routers/
│   │   │   ├── auth.py          # Registration, login, session /me, logout
│   │   │   ├── users.py         # Profile, daily goal, heart refills, shop purchase, stats
│   │   │   ├── courses.py       # All 8 courses, course selector, path with user unlock states
│   │   │   ├── lessons.py       # Exercise retrieval, answer validation, lesson completion, practice
│   │   │   ├── leaderboard.py   # Dynamic league rankings
│   │   │   └── achievements.py  # Badges catalog and user unlocks
│   │   └── services/
│   │       ├── lesson_service.py      # Answer verification across 5 types & XP calculation
│   │       ├── streak_service.py      # Daily streak calendar logic & daily activity
│   │       ├── progress_service.py    # Skill advancement & sequential unlocking
│   │       └── achievement_service.py # Criteria evaluation & badge awarding
│   ├── tests/
│   │   ├── test_lesson_service.py     # Tests for validation, XP, normalization
│   │   ├── test_streak_service.py     # Tests for consecutive, same-day, missed days
│   │   └── test_progress_service.py   # Tests for skill completion & achievements
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── welcome/page.tsx       # Landing page (Get Started & Login)
│   │   │   ├── onboarding/page.tsx    # 7-step guided onboarding flow
│   │   │   ├── page.tsx               # Serpentine learning path
│   │   │   ├── lesson/[id]/page.tsx   # Interactive lesson player
│   │   │   ├── practice/page.tsx      # Active course practice & heart recovery
│   │   │   ├── leaderboard/page.tsx   # Dynamic league rankings
│   │   │   ├── shop/page.tsx          # Power-ups shop (refills & streak freeze)
│   │   │   ├── profile/page.tsx       # Stats & achievements
│   │   │   ├── settings/page.tsx      # Preferences, goals, account actions
│   │   │   └── layout.tsx             # Root layout with AppShell
│   │   ├── components/
│   │   │   ├── layout/                # AppShell, Sidebar, Topbar (with course dropdown), MobileNav
│   │   │   ├── exercises/             # MultipleChoice, WordBank, MatchPairs, FillInBlank, TypeAnswer
│   │   │   ├── lesson/                # LessonHeader, FeedbackBar, OutOfHeartsModal, LessonCompleteModal
│   │   │   ├── mascot/                # DuoOwl SVG animated mascot
│   │   │   ├── path/                  # UnitBanner, SkillNode, SkillPopover
│   │   │   └── ui/                    # Button (3D), Modal, ProgressBar, AudioButton
│   │   ├── context/                   # GameContext, SoundContext, ThemeContext
│   │   └── services/                  # api.ts (Typed API client)
├── docs/                              # Technical architecture, API, and DB documentation
│   ├── API.md                         # Complete REST API endpoint documentation
│   ├── ARCHITECTURE.md                # System design & architecture
│   ├── DATABASE.md                    # Relational schema & entity relationships
│   ├── DATA_FLOW.md                   # Sequence diagrams of lesson & streak workflows
│   ├── INTERVIEW_GUIDE.md             # Code-level interview preparation guide
│   └── REQUIREMENTS_CHECKLIST.md      # Full assignment criteria checklist
└── scripts/
    └── test_full_experience.py        # Comprehensive 12-check E2E test script
```

---

## ⚡ How to Run Locally

### 1. Start FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Start Next.js Frontend
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- To experience the Landing & Onboarding flow: visit [http://localhost:3000/welcome](http://localhost:3000/welcome) or [http://localhost:3000/onboarding](http://localhost:3000/onboarding).
- To switch languages: click the flag in the Topbar (Spanish, French, German, Italian, Portuguese, Japanese, Hindi, English).
- To practice: visit [http://localhost:3000/practice](http://localhost:3000/practice).
- To view leaderboards: visit [http://localhost:3000/leaderboard](http://localhost:3000/leaderboard).

---

## 🧪 Testing & Verification

Run the full-scale automated test suite:
```bash
# Backend unit tests
python -m pytest backend/tests

# End-to-end multi-language verification
python scripts/test_full_experience.py
```

---

## 📄 Documentation & Evaluation Reference
A complete suite of architectural specifications, database schema diagrams, and interview preparation guides is provided in the `docs/` directory:
- 🏗️ **[System Architecture](docs/ARCHITECTURE.md)**: Detailed breakdown of presentation, API, service, and database tiers.
- 🗄️ **[Database Schema & ER Model](docs/DATABASE.md)**: 10 normalized tables with foreign keys and relationships.
- 🌐 **[REST API Reference](docs/API.md)**: Complete request/response schemas and endpoints.
- 🔄 **[Data Flow Diagrams](docs/DATA_FLOW.md)**: Sequence diagrams of lesson progression, streaks, and XP calculations.
- 🎯 **[Interview Preparation Guide](docs/INTERVIEW_GUIDE.md)**: Code-level answers to 50+ evaluation questions.
- ✅ **[Assignment Requirements Checklist](docs/REQUIREMENTS_CHECKLIST.md)**: Feature-by-feature verification matrix against assignment criteria.

