# Speedcubing Platform — Gamification Spec

## Overview
The gamification system is the core differentiator of the platform. Every system is designed to reward learning and consistent practice, not just raw speed. All systems work together to keep users motivated and coming back daily.

---

## XP System

XP is the core currency that drives rank progression. Earned through learning, practice, and challenges.

### XP Sources

**Lesson Completion (scales by stage difficulty):**
- Stage 1 lessons: 50 XP each
- Stage 2 lessons: 75 XP each
- Stage 3 lessons: 100 XP each
- Stage 4 lessons: 125 XP each
- Stage 5 lessons: 150 XP each
- Stage 6 lessons: 150 XP each
- Stage 7 lessons: 175 XP each

**Quizzes / Lesson Checks:**
- 25 XP bonus for passing on the first try

**Daily Practice:**
- 25 XP for any XP-earning activity in a day (just for showing up)

**Timed Solves:**
- 5 XP per solve logged in the timer

**Algorithm Mastery:**
- 30 XP per algorithm mastered (correct 5 times in a row in the trainer)

**Challenges:**
- Daily and weekly challenges have their own XP rewards (see Challenge System)

### XP Cap
No daily XP cap at launch. Users can grind as much as they want. Guardrails can be added later if needed based on real usage data.

---

## Streak System

Streaks track consecutive days of practice and reward consistency.

### How It Works
- Any XP-earning activity in a day continues the streak
- Missing a full day resets the streak to zero
- One streak freeze per week (auto-activates on a missed day, does not stack)

### Streak Multiplier
The longer the streak, the more bonus XP earned on all activities:
- Days 1–7: No bonus (building the habit)
- Days 8–14: 1.1x multiplier (10% bonus)
- Days 15–30: 1.25x multiplier
- Days 31–60: 1.5x multiplier
- Days 61–100: 1.75x multiplier
- Days 100+: 2x multiplier

### Streak Milestone Achievements
- 7 days — "First Week"
- 30 days — "Monthly Grinder"
- 100 days — "Dedicated"
- 365 days — "One Year Strong"

---

## Rank System

Ranks are based on total XP thresholds. They reflect genuine engagement and learning, not just speed. Ranks are publicly visible next to usernames everywhere on the site.

### Rank Tiers
Each rank has 3 sub-tiers (I, II, III). XP is split evenly across sub-tiers within each rank.

| Rank | XP Threshold (Tier I) | XP Threshold (Tier II) | XP Threshold (Tier III) |
|------|----------------------|------------------------|------------------------|
| Unranked | 0 | — | — |
| Bronze | 500 | 833 | 1,166 |
| Silver | 1,500 | 2,333 | 3,166 |
| Gold | 4,000 | 5,333 | 6,666 |
| Platinum | 8,000 | 10,333 | 12,666 |
| Diamond | 15,000 | 18,333 | 21,666 |
| Master | 25,000 | 30,000 | 35,000 |
| Grandmaster | 40,000 | 50,000 | 60,000 |

**24 total rank milestones** (8 ranks × 3 tiers).

### Progression Context
- Completing all 43 lessons = ~4,500 XP (roughly Gold I)
- Higher ranks require sustained practice, algorithm mastery, challenges, and streaks
- Each sub-tier has a unique pixel art badge that visually evolves

---

## Achievement System

Achievements are separate from rank. They reward specific milestones and memorable moments. Each achievement has a pixel art badge displayed on the user's profile.

### Learning Milestones
- "First Steps" — Complete your first lesson
- "First Solve" — Complete Stage 2 (lesson 2.9)
- "Method Master" — Complete Stage 7 (full CFOP learned)
- "Perfect Student" — Pass every quiz on the first try within a stage
- "Scholar" — Complete all 43 lessons

### Speed Milestones
- "Sub-2:00 Club" — Log a solve under 2 minutes
- "Sub-1:00 Club" — Log a solve under 1 minute
- "Sub-45 Club" — Log a solve under 45 seconds
- "Sub-30 Club" — Log a solve under 30 seconds

### Practice Milestones
- "Getting Started" — Log 10 total solves
- "Century" — Log 100 total solves
- "Thousand Club" — Log 1,000 total solves
- "Algorithm Apprentice" — Master 10 algorithms
- "Algorithm Expert" — Master all 2-look OLL and PLL algorithms

### Streak Milestones
- "First Week" — 7-day streak
- "Monthly Grinder" — 30-day streak
- "Dedicated" — 100-day streak
- "One Year Strong" — 365-day streak

### Fun / Hidden Achievements
- "Night Owl" — Log a solve after midnight
- "Early Bird" — Log a solve before 6 AM
- "Speed Demon" — Solve 20 times in a single session
- "Perfectionist" — Get a personal best 5 times in one week

Hidden achievements are discovered by accident, encouraging sharing and word of mouth.

---

## Challenge System

Challenges give users a specific daily/weekly goal beyond streaks. One daily challenge and one weekly challenge, same for all users.

### Daily Challenges
One new challenge each day. Quick, completable in a single session. Example pool:
- "Log 5 solves" — 30 XP
- "Practice 3 different OLL cases" — 35 XP
- "Complete 1 lesson" — 40 XP
- "Do 10 cross-only solves" — 30 XP
- "Beat your average by 2 seconds in a session" — 50 XP

### Weekly Challenges
One new challenge each Monday. Takes sustained effort across the week. Example pool:
- "Log 30 solves this week" — 150 XP
- "Master 2 new algorithms" — 150 XP
- "Complete 3 lessons" — 200 XP
- "Maintain your streak all week" — 100 XP
- "Spend 60 total minutes practicing" — 175 XP

### Stage Challenges
One-time challenges tied to specific curriculum stages. Unlock when you reach that stage. Bonus XP for going above and beyond — like "boss fights."
- Stage 2: "Solve the cube 3 times in a row without looking at any hints" — 100 XP
- Stage 3: "Get your average under 2 minutes" — 100 XP
- Stage 5: "Solve all 4 F2L pairs without pausing longer than 3 seconds between each" — 125 XP
- Stage 7: "Get 3 solves in a row under 45 seconds" — 150 XP

---

## Playground Mode

Unstructured practice space. No required path — users come here to practice on their own terms. Timer and algorithm trainer still earn XP.

### Timer
- Generates a random scramble
- 15-second inspection countdown (optional, mirrors competition rules)
- Tap to start, tap to stop
- Tracks each solve: date, time, scramble used
- Session stats: current average of 5, average of 12, best single, best average
- Historical stats: all-time best, progress graph over time
- 5 XP per solve logged

### Algorithm Trainer
- Pick a category: OLL, PLL, F2L cases, or custom set
- Shows a cube state, user identifies or executes the correct algorithm
- Tracks accuracy and speed per algorithm
- Spaced repetition: algorithms you get wrong appear more often
- Mastery: correct 5 times in a row = "mastered" (30 XP)

### Free Practice
- Interactive 3D cube to turn and experiment with
- No scoring, no XP, no pressure
- Solve checker that tells you if the cube is solved
- The chill zone

---

## Anti-Cheating Philosophy (v1)
- Rank is XP-based (driven by learning and practice), NOT speed-based
- Speed milestones are achievement badges (profile trophies), not rank determinants
- No immediate validation needed — revisit if cheating becomes a real problem
- Focus on making the system fun first, add guardrails later based on real data

---

## Design Notes
- All rank badges and achievement icons should be pixel art matching the site's retro dark theme
- Rank badges visually evolve across sub-tiers (e.g., Bronze badge gets more detailed from I to II to III)
- Gamification should feel present throughout the entire experience, not just at certain milestones
- Streak freeze and multiplier info should be clearly visible on the dashboard
- Challenge progress should be trackable in real time
