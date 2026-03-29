# Cubemaxxed

**[cubemaxxed.vercel.app](https://cubemaxxed.vercel.app)**

A gamified speedcubing learning platform. Think boot.dev meets Duolingo, but for people who want to get fast at solving a Rubik's cube.

This was built to have fun while learning/playing, rather than having the feeling of reading a textbook.

## What it does

- **Structured curriculum** — 20 lessons currently available covering the beginner course, with more stages on the way (full CFOP planned)
- **Algorithm trainer** — drill OLL, PLL, and F2L algorithms with spaced repetition vibes
- **Timer** — solve timer with scramble generation (powered by cstimer's scramble engine), subset modes, and session stats
- **XP + ranks** — earn XP for completing lessons, hitting solve targets, and maintaining streaks. Progress through 24 rank milestones from Unranked to Grandmaster
- **Achievements** — pixel art badges for milestones, hidden achievements for doing weird things
- **Profile** — your stats, rank history, and solve analytics all in one place

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Supabase** — auth and Postgres
- **cubing.js** — 3D cube rendering
- **Vercel** — deployed here

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

You'll need a `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Project structure

```
app/
  page.tsx          # Dashboard
  learn/            # Curriculum map
  playground/       # Timer + algorithm trainer
  algorithms/       # Algorithm catalog
  profile/          # User profile + stats
docs/               # Project briefs, curriculum outline, gamification spec
```

## Docs

The `docs/` folder has more detail on the vision and design decisions if you want to understand why things are the way they are:

- `docs/full-project-brief.md` — full vision and art direction
- `docs/curriculum-outline.md` — full planned curriculum broken down by stage
- `docs/gamification-spec.md` — how XP, ranks, and streaks work
- `docs/tech-stack-brief.md` — why we picked this stack
