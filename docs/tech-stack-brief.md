# Speedcubing Platform — Tech Stack Brief

## Overview
Tech stack recommendation for a gamified speedcubing learning platform. Chosen for beginner-friendliness, industry relevance, scalability, and fit for the project's specific needs (user accounts, progress tracking, interactive features, relational data).

---

## Frontend: React + Next.js

React is the most widely used frontend framework, with the largest ecosystem of tutorials, libraries, and community support. Next.js is a framework built on top of React that handles routing, server-side rendering, and configuration that you'd otherwise set up manually.

**Why React + Next.js:**
- Largest community and most learning resources available
- Aligns with the most job postings in frontend development
- Next.js provides built-in routing, performance optimization, and server-side rendering
- Massive library ecosystem for anything you might need

---

## Styling: Tailwind CSS

A utility-based CSS framework that lets you style elements quickly using class names instead of writing custom CSS files. Industry standard for modern projects.

**Why Tailwind:**
- Fast to build with, especially for custom dark-themed UIs
- Works perfectly with React / Next.js
- Huge community and documentation
- Makes responsive design (mobile + desktop) straightforward

---

## Backend / Database: Supabase

Supabase is an open-source backend-as-a-service built on PostgreSQL. Instead of building a separate backend server from scratch, Supabase provides everything in one platform.

**What Supabase handles out of the box:**
- User accounts and authentication (sign up, login, social logins like Google/GitHub)
- PostgreSQL database (stores user progress, XP, solve times, achievements, lesson completion)
- Auto-generated API (frontend can talk to data without building a custom API)
- Real-time features (for leaderboards or multiplayer features down the line)
- File storage (if needed for user avatars, etc.)
- Row-Level Security (control who can access what data at the database level)

**Why Supabase over Firebase:**
- PostgreSQL is a relational database — perfect for the app's structured data (users → ranks → XP, users → lessons → stages, users → achievements)
- Open source — no vendor lock-in, data is always portable
- Free tier is generous enough for development and early launch
- SQL is a transferable skill worth learning
- Predictable pricing as the app scales

**Why not build a custom backend (Express.js etc)?**
- Building auth, database connections, API routes, and security from scratch is a massive lift for a solo beginner
- Supabase handles all of that so you can focus on the actual product
- You can always add custom backend logic later with Supabase Edge Functions

---

## Deployment: Vercel

Vercel is the company behind Next.js. It offers seamless deployment — push code to GitHub and it deploys automatically.

**Why Vercel:**
- Free tier is generous for indie developers and small projects
- Best-in-class integration with Next.js
- Automatic deployments from GitHub pushes
- Preview deployments for testing changes before going live
- Scales automatically as traffic grows

---

## Other Key Tools

### TypeScript
JavaScript with type safety. Catches bugs before they happen by ensuring variables and functions have defined types. Not required to learn immediately — start with JavaScript, then migrate to TypeScript once comfortable.

### Git + GitHub
Version control system that tracks every change to your code. Non-negotiable for any project. Learn this early — it's used everywhere in the industry.

### cubing.js
An existing open-source library for interactive 3D Rubik's cube visualizations. Handles scramble generation, cube rendering, and move animation. No need to build cube graphics from scratch.

---

## Full Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Next.js | UI, pages, routing, app logic |
| Styling | Tailwind CSS | Visual design, dark retro theme |
| Backend / DB | Supabase (PostgreSQL) | Auth, database, API, real-time |
| Deployment | Vercel | Hosting, automatic deploys |
| Version Control | Git + GitHub | Code tracking, collaboration |
| Cube Visuals | cubing.js | 3D cube rendering, scrambles |

---

## Learning Path for This Stack
Recommended order to learn these technologies:
1. **JavaScript fundamentals** (currently in progress)
2. **Git + GitHub** (learn alongside JS, use it from day one)
3. **React basics** (components, state, props, hooks)
4. **Tailwind CSS** (can learn alongside React)
5. **Next.js** (routing, pages, server components)
6. **Supabase** (database setup, auth, connecting to frontend)
7. **TypeScript** (add type safety once comfortable with the above)
8. **cubing.js** (integrate when building cube-specific features)
