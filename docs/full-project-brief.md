# Speedcubing Platform — Full Project Brief

## Table of Contents
1. Vision & Mission
2. Target Audience
3. What Makes It Unique
4. Art Direction
5. Curriculum Overview
6. Gamification Overview
7. Site Structure
8. Tech Stack
9. MVP Scope
10. Future Roadmap

---

## 1. Vision & Mission

A gamified web platform where people learn to speedcube (starting with the 3x3 Rubik's Cube) through a structured, fun, and addicting experience. Inspired by platforms like boot.dev and Duolingo — educational but designed to keep users motivated, engaged, and coming back daily.

The site combines the practical utility of a cubing resource (like jperm.net — timers, algorithm catalogs, method guides) with deep gamification systems (XP, ranks, streaks, challenges, achievements) that make the learning process feel like a game.

**Core Principle:** Reward learning and effort, not just raw speed. A beginner who practices daily should feel just as rewarded as a naturally fast solver.

---

## 2. Target Audience

**Primary audience:** Complete beginners who have never solved a Rubik's Cube and want to learn, all the way through intermediate solvers pushing toward sub-30 seconds.

**User journey:** Someone who just bought a cube → learns to solve it → gets faster → learns CFOP → approaches sub-30 and beyond.

**Secondary audience (future):** Advanced cubers looking for algorithm trainers, timers, and practice tools in the Playground mode.

---

## 3. What Makes It Unique

**The problem with existing resources:**
- jperm.net is excellent for algorithms and timers but has no gamification or structured learning path
- YouTube tutorials are scattered and passive — no interactivity, no progress tracking
- Most cubing resources are reference tools, not learning platforms

**What this platform does differently:**
- Structured curriculum that takes you from zero to CFOP (43 lessons across 7 stages)
- Full gamification system (XP, ranks, streaks, challenges, achievements) that makes practice addicting
- Playground mode for unstructured practice that still feeds into the progression system
- Algorithm trainer with spaced repetition for long-term retention
- A distinct visual identity (retro pixel art, dark theme) that stands out from every other cubing site

---

## 4. Art Direction

**Style:** Retro pixel art with a dark theme. Not too bright, but vibrant enough to pop visually.

**Color palette:**
- Dark backgrounds (near-black, very dark navy, or charcoal)
- Accent colors pulled from Rubik's Cube face colors — red, blue, green, orange, yellow, white
- These vibrant colors pop against the dark background without being overwhelming

**Pixel art elements:**
- Logo: A vibrant pixelated 3x3 cube (header placement)
- Rank badges that visually evolve across sub-tiers
- Achievement icons
- Decorative UI elements and possible mascot character
- The UI itself (buttons, cards, layouts) can be clean and modern — pixel art adds personality, not clutter

**Typography:**
- Pixel/retro font for headings and titles
- Clean, readable font for body text and lesson content (readability matters for instructional content)

**Inspiration references:**
- Games: Celeste, Shovel Knight (pixel art aesthetic)
- Platforms: boot.dev (gamification feel), Habitica (pixel art + gamification)
- The overall vibe should feel like a retro game crossed with a modern learning platform

---

## 5. Curriculum Overview

43 lessons across 7 stages. Takes a user from never touching a cube to a complete CFOP solve approaching sub-30 seconds.

| Stage | Topic | Lessons | Goal |
|-------|-------|---------|------|
| 1 | The Basics | 5 | Understand the cube, read notation, do basic moves |
| 2 | Your First Solve | 9 | Solve the cube using beginner layer-by-layer method |
| 3 | Getting Comfortable | 6 | Finger tricks, efficiency, reduce pauses. Target: sub-2:00 |
| 4 | Intro to CFOP & The Cross | 5 | Understand CFOP, master the cross at a higher level |
| 5 | F2L (First Two Layers) | 7 | Learn intuitive F2L (hardest stage) |
| 6 | 2-Look OLL | 5 | Orient last layer in two steps (~9 algorithms) |
| 7 | 2-Look PLL | 6 | Permute last layer in two steps (6 algorithms). Complete CFOP. |

**Lesson structure (each lesson contains):**
- Short explanation (text + visuals/animations)
- Demonstration (video or animated 3D cube)
- Practice task
- Quiz or knowledge check
- Completion reward (XP, potential achievement)

**Note:** Stage 4 Lesson 1 briefly mentions other methods (Roux, ZZ) but emphasizes CFOP as the most popular route. Other methods are for later when users are more advanced.

Full lesson-by-lesson breakdown available in: `curriculum-outline.md`

---

## 6. Gamification Overview

The gamification system is the core differentiator. All systems work together.

### XP System
- Earned through lesson completion, quizzes, daily practice, timed solves, algorithm mastery, and challenges
- XP scales by stage difficulty (Stage 1: 50 XP/lesson → Stage 7: 175 XP/lesson)
- 25 XP bonus for passing quizzes on first try
- 25 XP daily practice bonus (just for showing up)
- 5 XP per timed solve logged
- 30 XP per algorithm mastered (correct 5x in a row)
- No daily XP cap at launch

### Streak System
- Any XP-earning activity continues the streak
- Missing a full day resets to zero
- One streak freeze per week (auto-activates, doesn't stack)
- Multiplier grows over time: 1x (days 1-7) → 1.1x (8-14) → 1.25x (15-30) → 1.5x (31-60) → 1.75x (61-100) → 2x (100+)

### Rank System
- 8 ranks × 3 sub-tiers each = 24 milestones
- Unranked → Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster
- Based on total XP (reflects engagement + learning, not just speed)
- Completing all 43 lessons ≈ 4,500 XP (roughly Gold I)
- Higher ranks require sustained practice, mastery, challenges, and streaks
- Ranks are publicly visible next to usernames everywhere
- Each sub-tier has a unique pixel art badge that evolves visually

### Achievement System
- Separate from rank — trophy case on profile
- Categories: Learning milestones, Speed milestones, Practice milestones, Streak milestones, Hidden/fun achievements
- Each achievement has a pixel art badge
- Hidden achievements discovered by accident (encourages sharing and word of mouth)

### Challenge System
- One daily challenge + one weekly challenge (same for all users)
- Daily examples: "Log 5 solves" (30 XP), "Complete 1 lesson" (40 XP)
- Weekly examples: "Log 30 solves this week" (150 XP), "Master 2 new algorithms" (150 XP)
- Stage challenges: one-time "boss fight" challenges tied to curriculum stages (100-150 XP)

### Playground Mode
- Timer: random scrambles, optional 15-sec inspection, session/historical stats, 5 XP per solve
- Algorithm Trainer: pick a category, spaced repetition, mastery tracking, 30 XP per algorithm mastered
- Free Practice: interactive 3D cube, no XP, no pressure — the chill zone

### Anti-Cheating Philosophy (v1)
- Rank is XP-based, not speed-based
- Speed milestones are achievement badges (trophies), not rank determinants
- Focus on making the system fun first, add guardrails later based on real data

Full system breakdown available in: `gamification-spec.md`

---

## 7. Site Structure

### Pages / Sections

**Home / Dashboard**
- Progress overview, current rank, streak counter
- Daily/weekly challenge progress
- "Continue where you left off" button
- Quick stats (total solves, current average, algorithms mastered)

**Learn**
- The structured curriculum path (visual stage/lesson map)
- Progress indicators for each stage and lesson
- Locked/unlocked lesson states

**Playground**
- Timer (with scramble generator and stats)
- Algorithm Trainer (with spaced repetition)
- Free Practice (interactive 3D cube)

**Algorithms**
- Reference catalog of all algorithms with visual demonstrations
- Organized by category (OLL, PLL, F2L cases)
- Each algorithm shows notation, 3D animation, and mastery status

**Profile**
- Rank badge and username
- Achievement trophy case
- Solve history and progress graphs
- Stats (total solves, best times, averages, algorithms mastered, streak record)

**Leaderboard (future / optional)**
- Based on XP or challenge completions rather than raw solve times
- Reduces incentive to cheat

---

## 8. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Next.js | UI, pages, routing, app logic |
| Styling | Tailwind CSS | Visual design, dark retro theme |
| Backend / DB | Supabase (PostgreSQL) | Auth, database, API, real-time |
| Deployment | Vercel | Hosting, automatic deploys |
| Version Control | Git + GitHub | Code tracking, collaboration |
| Cube Visuals | cubing.js | 3D cube rendering, scrambles |

**Why this stack:**
- React + Next.js: Industry standard, largest community, most beginner resources, most job-relevant
- Tailwind CSS: Fast styling, perfect for custom dark themes, works seamlessly with React
- Supabase: Handles auth, database, and API in one platform. PostgreSQL fits the app's relational data perfectly (users → ranks → XP, users → lessons → stages, users → achievements). Open source, no vendor lock-in, generous free tier
- Vercel: Free tier, seamless Next.js deployment, automatic GitHub deploys
- cubing.js: Existing open-source library for 3D cube visualization — no need to build from scratch

**Learning path for this stack:**
1. JavaScript fundamentals (currently in progress)
2. Git + GitHub (learn alongside JS)
3. React basics (components, state, props, hooks)
4. Tailwind CSS (learn alongside React)
5. Next.js (routing, pages, server components)
6. Supabase (database setup, auth, connecting to frontend)
7. TypeScript (add type safety once comfortable)
8. cubing.js (integrate when building cube-specific features)

Full tech stack breakdown available in: `tech-stack-brief.md`

---

## 9. MVP Scope

What must be in the first launch version:

**Must-have:**
- User accounts (sign up, login, save progress)
- Structured curriculum (all 7 stages, 43 lessons)
- Basic gamification (XP, ranks, streaks)
- Timer with scramble generator and basic stats
- Algorithm catalog with visual demonstrations
- Dashboard showing progress

**Nice-to-have for launch (if time allows):**
- Algorithm trainer with spaced repetition
- Achievement system
- Daily/weekly challenges
- Progress graphs

**Not in MVP (future versions):**
- Leaderboards
- Community features
- Other cube types (2x2, 4x4, pyraminx)
- Mobile app
- Video lessons from real speedcubers

---

## 10. Future Roadmap

**Phase 1 — MVP Launch**
Core curriculum, basic gamification, timer, algorithm catalog.

**Phase 2 — Full Gamification**
Achievements, challenges, algorithm trainer with spaced repetition, progress graphs.

**Phase 3 — Community**
Leaderboards, user profiles visible to others, social sharing.

**Phase 4 — Content Expansion**
Advanced curriculum stages (full OLL, full PLL, advanced F2L, sub-15 techniques). Other cube types if demand exists (2x2, 4x4, pyraminx, megaminx).

**Phase 5 — Platform Growth**
Mobile app, partnerships with speedcubing content creators, competition integration.

---

## Reference Documents
- `curriculum-outline.md` — Full lesson-by-lesson curriculum breakdown
- `gamification-spec.md` — Detailed gamification system specification
- `tech-stack-brief.md` — Tech stack rationale and learning path
