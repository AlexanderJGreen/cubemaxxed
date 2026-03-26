# Analytics — Explained

This document explains what `lib/analytics.ts` does, what data it returns, and why it works the way it does.

---

## What the file does

`lib/analytics.ts` is a data layer — it fetches raw solve data from the database and shapes it into clean structures that the UI can consume directly. It exports two functions: `getSolveChartData` and `getPersonalBests`.

---

## `getSolveChartData(userId)`

### What it does

Fetches every solve the user has ever logged (from oldest to newest), then for each solve calculates what their rolling ao5 and ao12 were **at that exact point in time**.

Returns an array of data points, one per solve, ready to be passed straight into a Recharts line chart.

### What it returns

```ts
type SolveDataPoint = {
  solveNumber: number;      // 1, 2, 3... (the x-axis)
  time_ms: number;          // raw solve time in milliseconds
  timeFormatted: string;    // human-readable version, e.g. "1:23.45" or "58.32s"
  ao5: number | null;       // rolling average of last 5 solves (null if fewer than 5 solves so far)
  ao12: number | null;      // rolling average of last 12 solves (null if fewer than 12 solves so far)
};
```

### Real example

Say the user has logged 14 solves. The returned array would look like:

```json
[
  { "solveNumber": 1,  "time_ms": 95000,  "timeFormatted": "1:35.00", "ao5": null,  "ao12": null  },
  { "solveNumber": 2,  "time_ms": 88000,  "timeFormatted": "1:28.00", "ao5": null,  "ao12": null  },
  { "solveNumber": 3,  "time_ms": 91000,  "timeFormatted": "1:31.00", "ao5": null,  "ao12": null  },
  { "solveNumber": 4,  "time_ms": 84000,  "timeFormatted": "1:24.00", "ao5": null,  "ao12": null  },
  { "solveNumber": 5,  "time_ms": 79000,  "timeFormatted": "1:19.00", "ao5": 87000, "ao12": null  },
  { "solveNumber": 6,  "time_ms": 76000,  "timeFormatted": "1:16.00", "ao5": 85000, "ao12": null  },
  ...
  { "solveNumber": 12, "time_ms": 65000,  "timeFormatted": "1:05.00", "ao5": 72000, "ao12": 80000 },
  { "solveNumber": 13, "time_ms": 62000,  "timeFormatted": "1:02.00", "ao5": 69000, "ao12": 77000 },
  { "solveNumber": 14, "time_ms": 58000,  "timeFormatted": "58.00s",  "ao5": 66000, "ao12": 74000 }
]
```

Notice that solve 5 is the first one with an ao5 value, and solve 12 is the first one with an ao12. Before that they're `null`, which tells the chart not to draw those lines yet.

### Why rolling averages are calculated the way they are

A "rolling" average means: at each point, only look at the most recent N solves up to that point — not all solves, and not the most recent N solves overall.

**Why this matters:** If you just took the most recent 5 solves for every data point, every point on the graph would show today's ao5, which is useless. The graph would be flat. Rolling averages let you see how your ao5 *changed over time* — you can watch it trend downward as you improve.

**How the math works:** For solve number 7, the ao5 uses solves 3, 4, 5, 6, and 7. For solve number 8, it uses solves 4, 5, 6, 7, and 8. The window slides forward one solve at a time.

**The trim:** The `calcAo` function from `lib/rank.ts` doesn't take a plain mean — it drops the best and worst times first, then averages the rest. This is how official speedcubing averages work. A lucky sub-30 or a fumbled 3-minute solve won't skew the average wildly. For ao5, it drops 1 best and 1 worst, then averages the middle 3. For ao12, same idea but the middle 10.

---

## `getPersonalBests(userId)`

### What it does

Finds the **first time** the user ever broke each speed milestone. Fetches solves oldest-to-newest and walks through them looking for the first solve that dipped under each threshold.

### What it returns

```ts
type PersonalBest = {
  milestone: string;        // internal ID, e.g. "sub_120" — matches achievement IDs
  label: string;            // display name, e.g. "Sub-2:00"
  threshold: number;        // the cutoff in milliseconds, e.g. 120000
  time_ms: number | null;   // the actual time that broke the milestone (null = not yet achieved)
  timeFormatted: string | null; // e.g. "1:47.23" (null if not achieved)
  achievedAt: string | null;    // ISO timestamp of when it happened (null if not achieved)
};
```

### Real example

```json
[
  { "milestone": "sub_120", "label": "Sub-2:00", "threshold": 120000, "time_ms": 114000, "timeFormatted": "1:54.00", "achievedAt": "2025-11-03T18:22:10Z" },
  { "milestone": "sub_60",  "label": "Sub-1:00", "threshold": 60000,  "time_ms": 58000,  "timeFormatted": "58.00s",  "achievedAt": "2025-12-01T20:05:33Z" },
  { "milestone": "sub_45",  "label": "Sub-45",   "threshold": 45000,  "time_ms": null,   "timeFormatted": null,      "achievedAt": null },
  { "milestone": "sub_30",  "label": "Sub-30",   "threshold": 30000,  "time_ms": null,   "timeFormatted": null,      "achievedAt": null }
]
```

In this example the user has broken sub-2:00 and sub-1:00, but not sub-45 or sub-30 yet. Those last two return `null` for all the value fields — the UI uses that to show a locked state.

### Why "first time" and not "best time"

The goal of this section is to show the user's progression — when they first crossed each barrier. The best single is already shown in the main stats section. This is about the journey: "I first went sub-1:00 on December 1st." That moment feels different from "my best is 58 seconds." Both are worth showing.

---

## Why these functions live in `lib/analytics.ts` and not in the page

The profile page (`app/profile/page.tsx`) is a server component that already does several database queries. Adding more inline data-fetching logic there would make it hard to read and harder to reuse.

`lib/analytics.ts` keeps the data-shaping logic separate and named clearly. The chart component and the stats sections (Part 3) can both import from here without duplicating any logic.

---

## `SolveChart.tsx` — Why it's a separate client component

### The problem

Next.js has two kinds of React components: **server components** and **client components**.

Server components run on the server during the request. They can talk to the database, read files, and do async work — but they cannot use React hooks (`useState`, `useEffect`) or browser APIs.

Client components run in the browser. They can respond to user interaction, animate, and use browser features — but they cannot do async server-side work directly.

The profile page (`app/profile/page.tsx`) is a server component. That's intentional — it fetches all the user's data directly from Supabase before the page loads, which is fast and keeps sensitive queries off the client.

### Why Recharts needs to be a client component

Recharts is a charting library built on top of browser SVG APIs and React hooks. It needs access to the DOM to measure container widths (`ResponsiveContainer`), respond to mouse events (hover tooltips), and render interactive SVG elements. None of that is available on the server.

If you tried to use a Recharts component directly inside a server component, Next.js would throw an error at build time because those browser APIs don't exist in the server environment.

### The solution: extract just the chart

Rather than converting the entire profile page to a client component (which would mean losing server-side data fetching), only the chart itself is extracted into its own client component: `app/profile/SolveChart.tsx`.

The profile page stays a server component and fetches the data. It passes the already-shaped data down to `SolveChart` as a prop. `SolveChart` is marked `"use client"` and handles all the browser-side rendering.

This pattern — **server component fetches data, client component renders interactivity** — is the standard way to use interactive UI libraries in Next.js App Router.

---

## Personal Bests Timeline

### What it shows

Four milestone cards: Sub-2:00, Sub-1:00, Sub-45, Sub-30. For each one, the profile page calls `getPersonalBests(userId)` (from `lib/analytics.ts`) and displays the time and date the user first broke it. Milestones they haven't hit yet show a locked/greyed state, matching the visual language of locked achievements on the same page.

### How it decides "achieved" vs "locked"

`getPersonalBests` returns `time_ms: null` for any milestone the user hasn't hit. The profile page checks `pb.time_ms !== null` — if true, it renders the green achieved state with the time and date. If false, it renders the greyed locked state with "not yet achieved".

### Why "first time" not "best time"

The personal bests timeline is about progression milestones, not leaderboard numbers. "I first went sub-1:00 on December 1st" is a meaningful personal moment. The best single is already shown in the stats section above.

---

## Session Breakdown

### What it shows

A compact 4-card row showing today's activity at a glance:
- **Solves** — how many solves logged today
- **Best** — today's fastest single
- **AO5** — average of today's first 5 solves (shows "need N more" if under 5)
- **VS AVG** — whether today's average is better, worse, or on par with the all-time average

### How "today" is defined

The profile page computes the start of the current UTC day and queries `solve_times` with `.gte("created_at", todayUTCStart)`. This is consistent with how Supabase stores timestamps (UTC).

### How VS AVG is calculated

- **All-time average**: mean of every `time_ms` value in `chartData` (which has every solve ever)
- **Today's average**: mean of today's solves
- **Comparison**: if today's average is more than 2% lower than all-time → "BETTER" (green). More than 2% higher → "WORSE" (red). Within 2% either way → "ON PAR" (white). The 2% buffer avoids flickering between states when times are nearly identical.

If the user has no solves today, the section shows a simple "No solves logged today yet." message instead of the cards.
