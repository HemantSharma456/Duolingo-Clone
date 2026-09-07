# System Architecture Documentation: Duolingo Clone

## 1. High-Level Architecture

The Duolingo Clone is built on a decoupled, three-tier architecture ensuring separation of concerns, high maintainability, and clean code explainability:

```
┌──────────────────────────────────────────────────────────┐
│                 Next.js Frontend (Client)                │
│  - App Router (/src/app)                                 │
│  - Duolingo Feather Design System (globals.css)          │
│  - Context State (GameContext, SoundContext, Theme)      │
│  - 5 Interactive Exercise Components                     │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTP / JSON REST
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 FastAPI Application Layer                │
│  - Routers: users, courses, lessons, leaderboard, achs   │
│  - Request Validation & Response Serialization (Pydantic)│
│  - CORS Middleware & Dependency Injection (get_db)       │
└────────────────────────────┬─────────────────────────────┘
                             │ Python Method Invocations
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Business Logic Services                  │
│  - lesson_service: answer validation & combo XP          │
│  - streak_service: calendar-aware daily streak & activity│
│  - progress_service: crowns, completion & skill unlocks  │
│  - achievement_service: badge triggers & unlocking       │
└────────────────────────────┬─────────────────────────────┘
                             │ SQLAlchemy 2.0 ORM
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 SQLite Relational Database               │
│  - Enforced Foreign Keys (PRAGMA foreign_keys=ON)        │
│  - Fast In-Memory Rollback Journal                       │
│  - 10 Relational Tables (duolingo.db)                    │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Layer Separation & Responsibilities

### Tier 1: Presentation Layer (Next.js + TypeScript)
- **State Management**:
  - `GameContext`: Manages current user state (hearts, gems, streak, total XP, daily goal) and exposes synchronization callbacks (`refreshUser`).
  - `SoundContext`: Zero-dependency audio synthesizers utilizing the Web Audio API (`AudioContext`) for pleasant high-resolution chimes and buzzers, alongside the Web Speech API (`speechSynthesis`) for Spanish speech synthesis.
  - `ThemeContext`: Toggles between light and dark themes, dynamically updating root CSS variables and syncing with `localStorage`.
- **Component Modularity**:
  - `layout/`: Responsive sidebar, sticky status topbar, and mobile navigation tab bar.
  - `path/`: Unit banners and serpentine skill path nodes with dynamic SVG progress rings.
  - `lesson/`: Exercise player shell, feedback drawer, and celebratory completion modals.
  - `exercises/`: Isolated components for Multiple Choice, Word Bank, Match Pairs, Fill in the Blank, and Type Answer.

### Tier 2: API & Routing Layer (FastAPI)
- **Thin Route Handlers**: Routers do not contain complex mathematical or business logic. They authenticate/extract parameters, invoke services, and return validated schemas.
- **Security & Integrity**:
  - Correct answers are deliberately stripped from exercise responses sent to the client to prevent answer inspection in the browser DevTools.
  - XP and streaks are calculated entirely on the server; the frontend cannot forge arbitrary XP rewards.

### Tier 3: Business Logic Service Layer
- `lesson_service.py`: Normalizes user input (stripping punctuation, case-insensitive trims) and validates answers for all 5 formats. Manages heart deduction on mistakes.
- `streak_service.py`: Computes daily streaks by checking whether the learner's last activity date was today, yesterday, or older.
- `progress_service.py`: Handles skill mastery, records attempts, and sequentially unlocks the next skill along the learning tree.
- `achievement_service.py`: Evaluates achievement conditions on lesson completion and records unlock timestamps.

### Tier 4: Data Layer (SQLite + SQLAlchemy ORM)
- Uses SQLAlchemy 2.0 with type annotations and relationship cascades.
- Enables SQLite foreign key checks (`PRAGMA foreign_keys=ON`) and in-memory rollback journaling (`PRAGMA journal_mode=MEMORY`) for fast performance.

---

## 3. Production Scalability Roadmap (Interview Discussion)

During system design interviews, explain how this architecture transitions from a single-machine prototype to a multi-million user distributed platform:

| Scaling Dimension | Current Prototype | Production Architecture | Why the Change is Necessary |
|---|---|---|---|
| **Database** | SQLite file | PostgreSQL (Primary-Replica Cluster) | SQLite locks the database file during writes. PostgreSQL provides concurrent row-level locking, ACID transactions across instances, and read replicas. |
| **Backend Servers** | Single Uvicorn process | Multiple FastAPI Docker containers behind Nginx/ALB | Distributes CPU load, provides zero-downtime rolling deployments, and provides auto-scaling. |
| **Caching** | Direct DB queries | Redis Cluster | Caching course paths, user profiles, and active leaderboards reduces database read pressure by 90%+. |
| **Leaderboards** | SQL `ORDER BY total_xp DESC` | Redis Sorted Sets (`ZADD`, `ZREVRANGE`) | Computing ranks dynamically for millions of users with SQL is $O(N \log N)$. Redis Sorted Sets compute ranks in $O(\log N)$ time. |
| **Static Assets** | Local Next.js server | AWS CloudFront / Cloudflare CDN | Delivers audio files, mascot graphics, and JS bundles from edge locations closest to the user. |
| **Asynchronous Jobs** | In-process execution | Celery / RabbitMQ / Redis Queue | Offloads heavy workloads (sending daily streak reminder emails, analytics aggregation, weekly league reset jobs) from the main request thread. |
| **Authentication** | Default Demo Learner | JWT tokens + OAuth2 (Google/Apple) | Provides secure authentication, password hashing with bcrypt, and session management. |
