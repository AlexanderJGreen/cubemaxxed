# Cubemaxxed Theme System

## How it works

Themes are implemented as sets of CSS custom properties. The active theme is controlled by a `data-theme` attribute on `<html>`. Tailwind utilities and inline styles reference these variables, so all themed components update instantly on switch.

### CSS variable tokens

Defined in `app/globals.css`. `:root` holds the default (retro-dark) values; each other theme overrides them via `[data-theme="..."]` attribute selectors.

| Token | Role |
|---|---|
| `--bg-base` | Page background |
| `--bg-surface` | Card/panel background |
| `--bg-elevated` | Dropdowns, modals, avatar bg |
| `--bg-inset` | Progress bars, logo cube, dividers |
| `--bg-deep` | Darkest recessed surface |
| `--border-subtle` | Very subtle card borders |
| `--border-ring` | Focus rings and glow borders |
| `--text-primary` | Main body text |
| `--text-muted` | Subdued labels |
| `--text-dim` | Very faint labels |
| `--accent` | Primary CTA color (buttons, highlights) |
| `--accent-shadow` | Darker shade of accent for pixel shadows |
| `--accent-danger` | Red/danger actions |
| `--accent-success` | Green/success states |
| `--accent-streak` | Orange streak counter |
| `--accent-ice` | Cyan/ice (freeze timer, weekly challenge) |
| `--chart-1/2/3` | Recharts line colors (single, ao5, ao12) |
| `--accent-border` | `color-mix` alpha of accent at 15% — for tinted borders |
| `--accent-bg` | `color-mix` alpha of accent at 8% — for tinted backgrounds |
| `--success-border/bg` | Same pattern for success color |
| `--streak-border/bg` | Same pattern for streak color |
| `--ice-border/bg` | Same pattern for ice color |
| `--danger-bg` | Same pattern for danger color |

Derived alpha tokens use `color-mix(in srgb, var(--token) X%, transparent)` — they automatically adapt to whatever color is defined for that token in the active theme, with no per-theme duplication.

### Tailwind exposure

The `@theme inline` block in `globals.css` exposes the surface and accent tokens as Tailwind color utilities:

```css
@theme inline {
  --color-bg-base:    var(--bg-base);
  --color-bg-surface: var(--bg-surface);
  --color-accent:     var(--accent);
  /* etc. */
}
```

This lets you write `bg-bg-surface`, `text-accent`, `border-accent-danger` in Tailwind class names. For arbitrary values, use `bg-[var(--bg-surface)]`.

## Themes

| ID | Label | Tier | Accent | BG |
|---|---|---|---|---|
| `retro-dark` | Dark Retro | Free | `#FFD500` yellow | `#0d0d14` dark navy |
| `midnight` | Midnight | Free | `#60a5fa` blue | `#080812` near-black |
| `paper-light` | Paper Light | Free | `#C41E3A` red | `#f4f1eb` cream |
| `vaporwave` | Vaporwave | Pro | `#ff6ec7` pink | `#1a0a2e` deep purple |
| `gan` | GAN | Pro | `#e0e0e0` silver | `#0a0a0a` true black |

## How to add a new theme

1. Add its ID to `THEME_IDS` in `lib/themes.ts` and add an entry to the `THEMES` array (label, tier, preview colors).
2. Add a `[data-theme="your-id"]` block in `app/globals.css` overriding every token (copy from an existing theme and adjust).
3. Add the new ID to the SQL check constraint in `supabase/migrations/` (or run `ALTER TABLE profiles DROP CONSTRAINT profiles_theme_check; ALTER TABLE profiles ADD CONSTRAINT profiles_theme_check CHECK (theme IN (..., 'your-id'));`).

That's it — ThemeProvider, ThemeSwitcher, and the CSS cascade all pick it up automatically.

## Pro gating flow

```
Supabase profiles.is_pro
  → fetched server-side in app/layout.tsx
  → passed as initialIsPro to ThemeProvider
  → exposed as isPro via useTheme()
  → ThemeSwitcher checks isPro before allowing Pro theme selection
  → Pro themes show a lock badge and are non-clickable when isPro = false
```

To give a user Pro access: `UPDATE profiles SET is_pro = true WHERE id = '<user-id>';`

When Stripe is wired up, update `is_pro` in the webhook handler on `checkout.session.completed`.

## Theme persistence

1. **Logged-in**: Theme saved to `profiles.theme` via `saveTheme()` server action on every switch. Also mirrored to `localStorage` under `cm-theme` for instant paint.
2. **Logged-out**: Stored in `localStorage` only under `cm-theme`.
3. **SSR anti-flash**: `app/layout.tsx` reads `profiles.theme` server-side and sets `data-theme` on `<html>` before the page sends. An inline `<script>` in `<head>` also syncs from `localStorage` before React hydrates, preventing flash for logged-out users or when the localStorage theme differs from the DB value.
