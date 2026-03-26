# CubeMaxxed — Claude Code Prompts

Work through these one at a time. After each prompt, verify it works correctly before moving to the next one. Notes under each prompt tell you what to check.

---

## 1. Solve Analytics — Part 1 (Data Layer)

> **Status:** Not started

"I want to build a solve analytics feature for CubeMaxxed. This is Part 1 — data layer only, no UI yet.

Create a utility file at `lib/analytics.ts` that exports functions for fetching and shaping solve data for graphing. It needs to handle the following:

- Fetch all solve times for a user from the `solve_times` table — columns are `time_ms` and `created_at`
- Return solves sorted oldest to newest (for graphing left to right)
- For each solve, calculate the rolling ao5 and ao12 at that point in time — so solve number 7 knows its ao5 is based on solves 3-7, not the most recent 5 overall. This is important for the graph to show accurate rolling averages
- Format `time_ms` into readable time strings using the existing `formatTime` function from `lib/rank.ts`
- Return a clean data structure that a Recharts line chart can consume directly — each data point should have: `solveNumber`, `time_ms`, `timeFormatted`, `ao5` (null if fewer than 5 solves), `ao12` (null if fewer than 12 solves)

Also add a `getPersonalBests` function that returns the first solve where the user broke each milestone: sub-120s, sub-60s, sub-45s, sub-30s — matching the achievement thresholds already defined in `app/profile/page.tsx`.

Important context:

- Use the existing `calcAo` function from `lib/rank.ts` rather than rewriting average calculation logic
- This is a Next.js 15 app with Supabase for data — follow the same Supabase client pattern used in `app/profile/page.tsx`
- TypeScript — make sure everything is properly typed

After building it, create `docs/analytics-explained.md` explaining what each function does, what the returned data structure looks like with a real example, and why rolling averages are calculated the way they are. Write it like I am new to this."

**Verify before moving on:** No UI to check yet — just make sure the file was created, there are no TypeScript errors, and the data structure makes sense by reading through `docs/analytics-explained.md`.

---

## 2. Solve Analytics — Part 2 (Main Graph)

> **Status:** Not started — complete Part 1 first

"Add the main solve time graph to the profile page at `app/profile/page.tsx`. This is Part 2 of the analytics feature — the data layer in `lib/analytics.ts` is already built, now build the UI.

The graph should:

- Be a line chart built with Recharts showing the user's solve times over time
- X axis: solve number (1, 2, 3...)
- Y axis: time in seconds, formatted as readable strings (e.g. '1:23' not '83000')
- Three lines on the same chart: individual solve times, rolling ao5, rolling ao12
- ao5 and ao12 lines should only appear once enough solves exist (5 and 12 respectively)
- Hovering a point on the graph shows a tooltip with: solve number, time, ao5, ao12
- If the user has fewer than 5 solves, show a friendly empty state message encouraging them to log more solves

The graph should sit in its own section on the profile page below the existing stats. Style it to match the dark retro theme exactly — dark background, no white backgrounds anywhere inside the chart, grid lines should be subtle (very low opacity white), line colors should use the existing site accent colors (yellow `#FFD500` for individual solves, red `#C41E3A` for ao5, blue `#0051A2` for ao12).

Important context:

- Use the `getSolveChartData` function from `lib/analytics.ts` for the data
- Install Recharts if not already installed: `npm install recharts`
- Recharts components need to be in a client component — create a separate `app/profile/SolveChart.tsx` client component and import it into the profile page
- Match the existing profile page layout and card styling
- The profile page is a server component — keep it that way, only the chart component itself needs to be a client component

Update `docs/analytics-explained.md` to add a section explaining why the chart needed to be a separate client component and what that means."

**Verify before moving on:** Log at least 12 solves in the playground timer, then visit the profile page and check that all three lines appear correctly, the tooltip works on hover, and the chart looks clean against the dark background.

---

## 3. Solve Analytics — Part 3 (Full Stats Dashboard)

> **Status:** Not started — complete Parts 1 and 2 first

"Add the remaining analytics sections to the profile page to complete the solve analytics feature. The main graph from Part 2 is already built. Now add:

**Personal Bests Timeline**
A section showing when the user first broke each speed milestone: sub-2:00, sub-1:00, sub-45s, sub-30s. For each milestone: show the milestone name, the time they achieved it, and the date. If they haven't hit a milestone yet, show it as locked with a subtle locked state. Use the `getPersonalBests` function from `lib/analytics.ts`.

**Session Breakdown**
A small summary section showing: solves logged today, today's best single, today's ao5 if applicable, and how today's average compares to the all-time average (better/worse/same). Keep it compact — this is a quick glance section not a detailed breakdown.

Important context:

- Follow the exact same card and section styling already established in Parts 1 and 2 of this feature
- Match the dark retro theme — `#0d0d14` background, `font-heading` for labels
- Personal bests that haven't been achieved yet should feel locked/greyed out, consistent with how locked achievements look in the existing achievements section on this page
- Session breakdown only needs today's solves — filter by `created_at` date

Update `docs/analytics-explained.md` with a final section covering the personal bests and session breakdown logic."

**Verify before moving on:** Check that personal bests show correctly for milestones you've hit and show locked for ones you haven't. Check the session breakdown updates after logging a new solve.

---

## 4. Memory Trainer — Speed Recognition Game

> **Status:** Not started — Flash & Recall, Case Recognition, and Sequence Builder already built

"Add a fourth game mode to the Memory Trainer page at `/memory-trainer` called Speed Recognition.

It works like this: an OLL or PLL case diagram flashes on screen and the user has to tap the correct case name as fast as possible from 4 options displayed as buttons. The faster they answer correctly, the more XP they earn — full XP for under 3 seconds, partial XP for under 6 seconds, minimum XP for anything slower. Wrong answers earn no XP. Track and display the user's average reaction time for the session.

Important context:

- The three existing game modes (Flash & Recall, Case Recognition, Sequence Builder) are already built on this page — use them as direct reference for how state, XP awarding, case tracking, and mode switching is handled. Follow the same patterns exactly
- Reuse the existing `CaseDiagram` and `PLLCaseDiagram` components for displaying the case
- The 4 answer options should be text buttons showing case names, not diagrams — this tests pure recognition speed
- The reaction timer starts the moment the case appears on screen, not when the options appear
- Display a running session average reaction time somewhere visible on screen during play
- Match the existing theme exactly — `#0d0d14` background, `font-heading`, same styles as the rest of the memory trainer page

Update `docs/memory-trainer-explained.md` to add a section explaining Speed Recognition — what new state was added, how the reaction timer works, and how the tiered XP scoring is calculated."
