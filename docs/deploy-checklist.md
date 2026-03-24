# Deploy Readiness Checklist

---

## 🔴 Critical — Do These First

### 1. Check `.env.local` is not committed to git
Run `git log --all --full-history -- .env.local` to check if the file was ever committed.
- If it was → rotate your Supabase keys immediately
- Verify `.env.local` is listed in `.gitignore`
- When deploying to Vercel, add env vars manually in the Vercel dashboard — never commit the file

### 2. Remove the "Coming Soon" overlay from the Learn page
Delete the overlay JSX block (~lines 86–163) in `app/learn/page.tsx`.
The full curriculum map and lesson infrastructure behind it are complete and functional.
This overlay is the only thing blocking users from accessing any lesson.

### 3. Wire the timer to save solves to Supabase
In `app/playground/page.tsx`, the Timer stores solves in local React state only — lost on refresh, never reach the DB.
Add a server action that on timer stop:
- Inserts the solve into `solve_times` (user_id, time_ms, scramble, created_at)
- Awards 5 XP via the `increment_xp` RPC
- Revalidates /dashboard
- Silently skips if user is not logged in

This makes dashboard stats, profile stats, and speed achievements all functional.

---

## 🟠 High Priority

### 4. Add speed + practice achievement checks to the timer save action
After saving a solve, check if it qualifies for achievements and upsert to `user_achievements`:
- `sub_120` — under 2:00 (120,000ms)
- `sub_60` — under 1:00 (60,000ms)
- `sub_45` — under 45 seconds (45,000ms)
- `sub_30` — under 30 seconds (30,000ms)
- `getting_started` — 10 total solves
- `century` — 100 total solves
- `thousand_club` — 1,000 total solves

Query total solve count after insert to check practice milestones.
**Depends on task #3.**

### 5. Add dynamic scramble generation to the timer
The timer shows the same hardcoded scramble every session.
`sr-puzzlegen` is already in `package.json` but unused — integrate it to generate a
new random 3x3 scramble after each solve is logged.

### 6. Verify the streak system actually increments
The profile and dashboard read `current_streak` and `longest_streak` from Supabase,
but it's unclear if anything actually writes to these fields.
- Audit `learn/actions.ts` and any Supabase RPC functions
- If no increment logic exists, add it — streak should increment when XP is earned on a new calendar day
- Verify `streak_freeze_available` resets weekly

### 7. Write Stage 6 lesson content — 2-Look OLL (5 lessons)
Lessons 6.1–6.5 in `app/learn/content.ts` are empty stubs.
- 6.1 — What is OLL?
- 6.2 — Step 1: Edge Orientation (Yellow Cross)
- 6.3 — Step 2: Corner Orientation (Complete Yellow Face)
- 6.4 — OLL Recognition Practice
- 6.5 — Putting OLL Together

Reference `docs/curriculum-outline.md` for what each lesson covers.

### 8. Write Stage 7 lesson content — 2-Look PLL (6 lessons)
Lessons 7.1–7.6 in `app/learn/content.ts` are empty stubs.
- 7.1 — What is PLL?
- 7.2 — Step 1: Corner Permutation
- 7.3 — Step 2: Edge Permutation
- 7.4 — PLL Recognition Practice
- 7.5 — Full CFOP Solve ← finale, give it weight
- 7.6 — The Path to Sub-30 ← strong closing message

Reference `docs/curriculum-outline.md` for what each lesson covers.

---

## 🟡 Medium Priority

### 9. Implement algorithm mastery marking in the Memory Trainer
The Memory Trainer awards XP for correct answers but never writes to `algorithm_progress`,
so "algorithms mastered" is always 0 on the dashboard and profile.
On a correct answer in any game mode, upsert to `algorithm_progress`:
`(user_id, algorithm_id, mastered: true)`
The `awardMemoryXP` action in `app/memory-trainer/actions.ts` is the right place to extend.

---

## 🏁 Final Steps

### 10. Test the full end-to-end user flow
Manually run through the complete journey before shipping:
1. Land on home as guest → browse algorithms → visit learn page (no overlay)
2. Sign up → redirected to dashboard
3. Complete a lesson → XP awarded → dashboard updates
4. Log a solve on the timer → solve saved → dashboard stats update → achievement triggers if applicable
5. Complete a memory trainer round → XP awarded
6. Check profile — rank badge correct, stats populated, achievements show
7. Log out → protected routes redirect to login

Fix any bugs found before proceeding to step 11.

### 11. Set up environment variables in Vercel and deploy
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel dashboard
- Connect the GitHub repo to Vercel if not already done
- Trigger a production deploy
- After deploy: verify auth works on the live URL, complete a lesson to confirm Supabase writes work, check for console errors

---

## Summary Table

| # | Task | Priority |
|---|------|----------|
| 1 | Check `.env.local` not in git | 🔴 Do first |
| 2 | Remove learn page overlay | 🔴 Blocking |
| 3 | Wire timer → Supabase | 🔴 Blocking |
| 4 | Speed + practice achievements | 🟠 Depends on #3 |
| 5 | Dynamic scrambles | 🟠 High UX value |
| 6 | Verify streak incrementing | 🟠 Core feature |
| 7 | Stage 6 content (OLL) | 🟠 26% of curriculum |
| 8 | Stage 7 content (PLL) | 🟠 26% of curriculum |
| 9 | Algorithm mastery tracking | 🟡 Stats gap |
| 10 | Full end-to-end test | 🔴 Before shipping |
| 11 | Vercel deploy | 🏁 Final step |
