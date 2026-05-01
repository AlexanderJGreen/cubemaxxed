# CubeMaxxed Theme System — Claude Code Prompt

## Scope

v1 theme system: foundation + 5 themes (3 free, 2 Pro). Ship the architecture and paywall logic; additional themes can be added later as content drops.

---

## Prompt

Audit the codebase for hardcoded color usage (hex values, Tailwind arbitrary values like `bg-[#0d0d14]`, cube color constants). Report back a summary of where colors live and propose a CSS-variable-based theme architecture using Tailwind's theme config — do NOT write code yet.

After I approve the plan, implement a theme system with:

- 5 themes total: 3 free (Default Dark Retro, Midnight, Paper Light), 2 Pro (Vaporwave, GAN)
- Theme stored in Supabase user profile, with localStorage fallback for logged-out users
- Theme switcher UI in user settings, with Pro themes visibly locked (lock icon + "Pro" badge) for free users
- Pro gating reads from existing user subscription state — if no Pro flag exists yet in Supabase, add an `is_pro` boolean column with default `false` and stub the check
- Recharts colors must pull from theme tokens so analytics don't break on theme switch

Also write `themes.md` explaining: how the CSS variable system works, how to add a new theme, and how the Pro gating check flows from Supabase to the UI.

---

## Notes for me

- Audit step is non-negotiable — review the plan before approving implementation
- `is_pro` column is a stub; wire it to real payments later when Stripe is set up
- Theme list is intentionally short — add more themes in follow-up prompts once the architecture is proven
- If file paths or Supabase schema conventions matter, add hints to the prompt before running
