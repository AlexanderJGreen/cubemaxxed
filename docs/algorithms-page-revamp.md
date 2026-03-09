# CubeMaxxed — Algorithms Page Revamp (Updated)

## Goal
Rebuild the algorithms page to be clean, simple, and functional. Inspired by jperm.net's layout. Pure CSS/HTML diagrams — no cubing.js or external libraries for visuals.

## Important
- Do NOT use cubing.js for the diagrams. Use pure CSS grid-based diagrams.
- Keep it simple. This is a reference page.
- Match our existing dark theme.
- Use the EXACT case names and algorithms listed below. These are the standard community names.

---

## Layout Structure

### Page Layout
- Tab navigation at top: "2-Look OLL" | "2-Look PLL"
- Each tab shows its algorithm cases in a clean grid
- Cases are grouped by sub-category with a section header

### OLL Tab Sections
1. **Edge Orientation** (3 cases) — section header: "Edge Orientation — Make the Yellow Cross"
2. **Corner Orientation** (7 cases) — section header: "Corner Orientation — Complete the Yellow Face"

### PLL Tab Sections
1. **Corner Permutation** (2 cases) — section header: "Corner Permutation — Position the Corners"
2. **Edge Permutation** (4 cases) — section header: "Edge Permutation — Position the Edges"

---

## Algorithm Card Design

Each case is displayed as a card in a responsive grid (2-3 cards per row depending on screen size).

### Card Contents (top to bottom)
1. **Case name** — bold, e.g. "Sune" or "Ua-Perm"
2. **Cube diagram** — CSS-drawn top-down view with side stickers (details below)
3. **Algorithm** — monospace font, e.g. `R U R' U R U2 R'`

That's it. Keep it clean.

---

## CSS Cube Diagram Spec

### Structure
Top-down view of the last layer with side sticker strips on all four edges.

```
        [s] [s] [s]
   [s]  [c] [e] [c]  [s]
   [s]  [e] [X] [e]  [s]
   [s]  [c] [e] [c]  [s]
        [s] [s] [s]
```

- [X] = center (always yellow)
- [e] = edge sticker on top face
- [c] = corner sticker on top face
- [s] = side-facing sticker of top layer piece

### Colors for OLL
- **Yellow (#FFD700)** — oriented (yellow facing up)
- **Dark grey (#3a3a3a)** — not oriented (yellow not facing up)

### Colors for PLL
- Top face: all yellow (OLL is done)
- Side stickers use 4 colors for the 4 sides:
  - Front: Red (#E74C3C)
  - Right: Blue (#3498DB)
  - Back: Green (#2ECC71)
  - Left: Orange (#E67E22)

### Diagram Sizing
- Each sticker square: ~28-32px
- Side sticker strips: ~28-32px wide × 10-12px tall
- Small gap (1-2px) between stickers
- Dark background behind diagram

---

## 2-Look OLL — Complete Case List (10 cases)

Use this grid reference for top face positions:
```
[TL] [TE] [TR]
[LE] [CC] [RE]
[BL] [BE] [BR]
```
Y = yellow (oriented), G = grey (not oriented). CC (center) is always Y.

### Edge Orientation (3 cases)

#### 1. Dot Shape
- **Top face:** TE=G, LE=G, RE=G, BE=G. TL=G, TR=G, BL=G, BR=G.
- **Description:** No edges oriented. Only center is yellow.
- **Algorithm:** F R U R' U' F' f R U R' U' f'

#### 2. I-Shape
- **Top face:** TE=G, LE=Y, RE=Y, BE=G. TL=G, TR=G, BL=G, BR=G.
- **Description:** Two opposite edges oriented, forming a horizontal line.
- **Algorithm:** F R U R' U' F'
- **Note:** Hold the line horizontal (left-right) before executing.

#### 3. L-Shape
- **Top face:** TE=G, LE=Y, RE=G, BE=Y. TL=G, TR=G, BL=G, BR=G.
- **Description:** Two adjacent edges oriented, forming an L in the back-left.
- **Algorithm:** f R U R' U' f'
- **Note:** Hold the L pointing to the back-left corner.

---

### Corner Orientation (7 cases)

All edges are yellow (cross is done). Only corners vary.

#### 4. Antisune
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=Y, TR=G, BL=G, BR=G.
- **Description:** One corner oriented (TL). Three corners not. Mirror of Sune.
- **Algorithm:** R U2 R' U' R U' R'

#### 5. Sune
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=G, BL=G, BR=Y.
- **Description:** One corner oriented (BR). Three corners not. Fish shape.
- **Algorithm:** R U R' U R U2 R'

#### 6. H
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=G, BL=G, BR=G.
- **Description:** Zero corners oriented. Side stickers: front and back each show two yellow corner stickers.
- **Side stickers (key detail):** Top side: G G G. Bottom side: G G G. Left side: Y G Y. Right side: Y G Y.
- **Algorithm:** R U R' U R U' R' U R U2 R'

#### 7. L
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=G, BL=G, BR=G.
- **Description:** Zero corners oriented. Same top face as H but different side sticker pattern.
- **Side stickers (key detail):** Top side: G G G. Right side: G G G. Bottom side: Y G Y. Left side: Y G Y.
- **Algorithm:** F R' F' r U R U' r'
- **Note:** H and L look identical on top. The SIDE stickers distinguish them.

#### 8. Pi
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=G, BL=G, BR=G.
- **Description:** Zero corners oriented. Different side sticker pattern from H and L.
- **Side stickers (key detail):** Top side: Y G Y. Bottom side: Y G Y. Left side: G G G. Right side: G G G.
- **Algorithm:** R U2 R2 U' R2 U' R2 U2 R

#### 9. T
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=Y, BL=Y, BR=G.
- **Description:** Two corners oriented diagonally (TR, BL).
- **Algorithm:** r U R' U' r' F R F'

#### 10. U
- **Top face:** TE=Y, LE=Y, RE=Y, BE=Y. TL=G, TR=G, BL=Y, BR=Y.
- **Description:** Two corners oriented on same side (BL, BR). Headlights — the two unoriented corners have yellow facing the front.
- **Algorithm:** R2 D R' U2 R D' R' U2 R'

---

## 2-Look PLL — Complete Case List (6 cases)

### Corner Permutation (2 cases)

#### 1. T-Perm (Adjacent Corner Swap)
- **Description:** One face has matching corner colors (headlights). Hold headlights on LEFT.
- **Algorithm:** R U R' U' R' F R2 U' R' U' R U R' F'

#### 2. Y-Perm (Diagonal Corner Swap)
- **Description:** No face has matching corners. Hold any direction.
- **Algorithm:** F R U' R' U' R U R' F' R U R' U' R' F R F'

### Edge Permutation (4 cases)

#### 3. Ua-Perm (Clockwise 3-cycle)
- **Description:** Three edges cycle clockwise. One edge solved. One face has all stickers matching.
- **Algorithm:** R U' R U R U R U' R' U' R2

#### 4. Ub-Perm (Counter-clockwise 3-cycle)
- **Description:** Three edges cycle counter-clockwise. One edge solved.
- **Algorithm:** R2 U R U R' U' R' U' R' U R'

#### 5. H-Perm (Opposite Edge Swap)
- **Description:** Opposite edges swap. No face has matching edge.
- **Algorithm:** M2 U M2 U2 M2 U M2

#### 6. Z-Perm (Adjacent Edge Swap)
- **Description:** Adjacent edge pairs swap with neighbors.
- **Algorithm:** M2 U M2 U M' U2 M2 U2 M' U2

---

## Summary Tables

### 2-Look OLL (10 cases)
| # | Case | Category | Algorithm |
|---|------|----------|-----------|
| 1 | Dot Shape | Edge Orientation | F R U R' U' F' f R U R' U' f' |
| 2 | I-Shape | Edge Orientation | F R U R' U' F' |
| 3 | L-Shape | Edge Orientation | f R U R' U' f' |
| 4 | Antisune | Corner Orientation | R U2 R' U' R U' R' |
| 5 | Sune | Corner Orientation | R U R' U R U2 R' |
| 6 | H | Corner Orientation | R U R' U R U' R' U R U2 R' |
| 7 | L | Corner Orientation | F R' F' r U R U' r' |
| 8 | Pi | Corner Orientation | R U2 R2 U' R2 U' R2 U2 R |
| 9 | T | Corner Orientation | r U R' U' r' F R F' |
| 10 | U | Corner Orientation | R2 D R' U2 R D' R' U2 R' |

### 2-Look PLL (6 cases)
| # | Case | Category | Algorithm |
|---|------|----------|-----------|
| 1 | T-Perm | Corner Permutation | R U R' U' R' F R2 U' R' U' R U R' F' |
| 2 | Y-Perm | Corner Permutation | F R U' R' U' R U R' F' R U R' U' R' F R F' |
| 3 | Ua-Perm | Edge Permutation | R U' R U R U R U' R' U' R2 |
| 4 | Ub-Perm | Edge Permutation | R2 U R U R' U' R' U' R' U R' |
| 5 | H-Perm | Edge Permutation | M2 U M2 U2 M2 U M2 |
| 6 | Z-Perm | Edge Permutation | M2 U M2 U M' U2 M2 U2 M' U2 |

---

## Prompt Suggestions for Claude Code

### Prompt 1 — Build the CSS diagram component
"Read docs/algorithms-page-revamp.md. Build a reusable CSS-only cube diagram component that renders a top-down view of the top face as a 3x3 grid with side sticker strips on all four sides. Yellow (#FFD700) for oriented stickers, dark grey (#3a3a3a) for unoriented. The component should accept a prop that defines which stickers are yellow vs grey, including the side stickers. Test it by rendering the Sune case."

### Prompt 2 — Build the OLL section
"Using the diagram component, build the full OLL tab with all 10 cases from docs/algorithms-page-revamp.md. Group into Edge Orientation (Dot Shape, I-Shape, L-Shape) and Corner Orientation (Antisune, Sune, H, L, Pi, T, U). Each card shows case name, diagram, and algorithm. Use the exact sticker maps from the doc. Pay special attention to H, L, and Pi — they have the same top face but different side sticker patterns."

### Prompt 3 — Build the PLL section
"Build the PLL tab with all 6 cases. Top face all yellow. Side stickers use red, blue, green, orange to show which pieces need to move. Group into Corner Permutation (T-Perm, Y-Perm) and Edge Permutation (Ua, Ub, H-Perm, Z-Perm). Same card format."
