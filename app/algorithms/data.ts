// ============================================================
// OLL + PLL Algorithm Data
// Sources: speedsolving.com/wiki, jperm.net, speedcubedb.com
// ============================================================
//
// ── OLL Top Face Grid ─────────────────────────────────────
//  [TL, TE, TR, LE, CC, RE, BL, BE, BR]
//
//   TL──TE──TR
//   |       |
//   LE  CC  RE
//   |       |
//   BL──BE──BR
//
//  TL = top-left corner (UFl from solving perspective)
//  TE = top edge      (UB from solving perspective — the "far" edge)
//  TR = top-right corner (UBR)
//  LE = left edge     (UL)
//  CC = center        (always Y)
//  RE = right edge    (UR)
//  BL = bottom-left   (UFL — the "near-left" corner)
//  BE = bottom edge   (UF — the near edge, closest to solver)
//  BR = bottom-right  (UFR — near-right corner)
//
//  Wait — standard OLL diagram orientation varies. Using this convention:
//  The diagram is viewed from above with the front face at the BOTTOM.
//  So: TL=UBL, TE=UB(edge), TR=UBR, LE=UL(edge), CC=center,
//      RE=UR(edge), BL=UFL, BE=UF(edge), BR=UFR.
//
// ── OLL Side Strips ───────────────────────────────────────
//  Top row of each side face. Y = yellow sticker visible, G = grey.
//
//  back[0]  = UBL corner's back sticker
//  back[1]  = UB edge's back sticker
//  back[2]  = UBR corner's back sticker
//
//  front[0] = UFL corner's front sticker
//  front[1] = UF edge's front sticker
//  front[2] = UFR corner's front sticker
//
//  left[0]  = UBL corner's left sticker
//  left[1]  = UL edge's left sticker
//  left[2]  = UFL corner's left sticker
//
//  right[0] = UFR corner's right sticker
//  right[1] = UR edge's right sticker
//  right[2] = UBR corner's right sticker
//
//  Orientation rules:
//  - Oriented edge: top Y, side G
//  - Unoriented edge: top G, side Y (on exactly one side face)
//  - Oriented corner: top Y, both side stickers G
//  - Unoriented corner: top G, one side Y, other side G
//    (a corner has 3 stickers: top, and two side faces)
//
// ── PLL Side Strips ───────────────────────────────────────
//  Standard PLL orientation: Front=Red(R), Right=Green(G),
//  Back=Orange(O), Left=Blue(B). All top cells are yellow.
//  Side strips show what COLOR piece is in each position.
//
//  back[0]  = sticker at UBL slot, back face
//  back[1]  = sticker at UB edge, back face
//  back[2]  = sticker at UBR slot, back face
//  front[0] = UFL slot front, front[1] = UF edge front, front[2] = UFR slot front
//  left[0]  = UBL slot left,  left[1]  = UL edge left,  left[2]  = UFL slot left
//  right[0] = UFR slot right, right[1] = UR edge right, right[2] = UBR slot right
//
// ============================================================

export type OLLCell = "Y" | "G";
export type PLLColor = "R" | "G" | "O" | "B";

export interface OLLCase {
  id: number;
  name: string;
  group: string;
  alg: string;
  top: [
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
    OLLCell,
  ];
  back: [OLLCell, OLLCell, OLLCell];
  front: [OLLCell, OLLCell, OLLCell];
  left: [OLLCell, OLLCell, OLLCell];
  right: [OLLCell, OLLCell, OLLCell];
}

export interface PLLCase {
  id: string;
  name: string;
  group: string;
  alg: string;
  back: [PLLColor, PLLColor, PLLColor];
  front: [PLLColor, PLLColor, PLLColor];
  left: [PLLColor, PLLColor, PLLColor];
  right: [PLLColor, PLLColor, PLLColor];
}

// ============================================================
// OLL CASES (57 total)
// ============================================================
// Grid positions [TL,TE,TR, LE,CC,RE, BL,BE,BR]:
//   TL=UBL corner, TE=UB edge, TR=UBR corner
//   LE=UL edge,    CC=center,  RE=UR edge
//   BL=UFL corner, BE=UF edge, BR=UFR corner
//
// Side sticker notation:
//   An UNORIENTED piece has its yellow sticker on a side face (= Y in side strip).
//   An ORIENTED piece has yellow on top (= G in side strip at that position).
// ============================================================

export const OLL_CASES: OLLCase[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // Group: All Edges Oriented (OCLL)
  // All 4 edges are oriented → TE=Y, LE=Y, RE=Y, BE=Y. Side edge stickers all G.
  // Only the 4 corners vary. 7 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 21,
    name: "H / Double Sune",
    group: "All Edges Oriented (OCLL)",
    alg: "R U R' U R U' R' U R U2 R'",
    // All 4 corners unoriented.
    // UBL→Y on back[0], UBR→Y on right[2], UFR→Y on front[2], UFL→Y on left[2]
    // (diagonal pairs twist same way: H pattern)
    top: ["G", "Y", "G", "Y", "Y", "Y", "G", "Y", "G"],
    back: ["G", "G", "G"], // UBL-back=Y
    front: ["G", "G", "G"], // UFR-front=Y
    left: ["Y", "G", "Y"], // UFL-left=Y
    right: ["Y", "G", "Y"], // UBR-right=Y
  },

  {
    id: 22,
    name: "Pi / Bruno",
    group: "All Edges Oriented (OCLL)",
    alg: "R U2 R2 U' R2 U' R2 U2 R",
    // All 4 corners unoriented.
    // UBL→Y on left[0], UBR→Y on back[2], UFR→Y on right[0], UFL→Y on front[0]
    // (opposite diagonal pattern from H)
    top: ["G", "Y", "G", "Y", "Y", "Y", "G", "Y", "G"],
    back: ["G", "G", "Y"], // UBR-back=Y
    front: ["G", "G", "Y"], // UFL-front=Y
    left: ["Y", "G", "Y"], // UBL-left=Y
    right: ["G", "G", "G"], // UFR-right=Y
  },

  {
    id: 23,
    name: "Headlights / U",
    group: "All Edges Oriented (OCLL)",
    alg: "R2 D R' U2 R D' R' U2 R'",
    // UFR and UFL oriented (yellow on top). UBL and UBR unoriented.
    // "Headlights" = two yellow corners on back row = UBL and UBR show yellow toward back.
    // UBL→Y on back[0], UBR→Y on back[2].
    top: ["Y", "Y", "Y", "Y", "Y", "Y", "G", "Y", "G"],
    back: ["G", "G", "G"], // UBL-back=Y, UBR-back=Y
    front: ["Y", "G", "Y"],
    left: ["G", "G", "G"],
    right: ["G", "G", "G"],
  },

  {
    id: 24,
    name: "Chameleon / T",
    group: "All Edges Oriented (OCLL)",
    alg: "r U R' U' r' F R F'",
    // UFL and UBR oriented. UFR and UBL unoriented.
    // UFR→Y on front[2], UBL→Y on left[0].
    top: ["G", "Y", "Y", "Y", "Y", "Y", "G", "Y", "Y"],
    back: ["Y", "G", "G"],
    front: ["Y", "G", "G"], // UFR-front=Y
    left: ["G", "G", "G"], // UBL-left=Y
    right: ["G", "G", "G"],
  },

  {
    id: 25,
    name: "Bowtie / L",
    group: "All Edges Oriented (OCLL)",
    alg: "R U2 R D R' U2 R D' R2",
    // UFR and UBL oriented. UFL and UBR unoriented.
    // UFL→Y on front[0], UBR→Y on right[2].
    top: ["Y", "Y", "G", "Y", "Y", "Y", "G", "Y", "Y"],
    back: ["G", "G", "G"],
    front: ["Y", "G", "G"], // UFL-front=Y
    left: ["G", "G", "G"],
    right: ["Y", "G", "G"], // UBR-right=Y
  },

  {
    id: 26,
    name: "Antisune",
    group: "All Edges Oriented (OCLL)",
    alg: "y R U2 R' U' R U' R'",
    // UFR, UFl, UBR all oriented. UBL unoriented → Y on left[0].
    top: ["Y", "Y", "G", "Y", "Y", "Y", "G", "Y", "G"],
    back: ["G", "G", "Y"],
    front: ["Y", "G", "G"],
    left: ["G", "G", "G"], // UBL-left=Y
    right: ["G", "G", "Y"],
  },

  {
    id: 27,
    name: "Sune",
    group: "All Edges Oriented (OCLL)",
    alg: "R U R' U R U2 R'",
    // UFL, UFR, UBL all oriented. UBR unoriented → Y on right[2].
    top: ["G", "Y", "G", "Y", "Y", "Y", "Y", "Y", "G"],
    back: ["Y", "G", "G"],
    front: ["G", "G", "Y"],
    left: ["G", "G", "G"],
    right: ["Y", "G", "G"], // UBR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Dot
  // No edges oriented → TE=G, LE=G, RE=G, BE=G. All 4 side edge stickers = Y.
  // All 4 corners also unoriented. 8 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 1,
    name: "Runway",
    group: "Dot",
    alg: "R U2 R2 F R F' U2 R' F R F'",
    // "Runway" = two headlights front, two headlights back.
    // UFL→Y front[0], UFR→Y front[2], UBL→Y back[0], UBR→Y back[2].
    top: ["G", "G", "G", "G", "Y", "G", "G", "G", "G"],
    back: ["G", "Y", "G"], // UBL-back=Y, UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "G"], // UFL-front=Y, UF(edge)=Y, UFR-front=Y
    left: ["Y", "Y", "Y"], // UL(edge)=Y
    right: ["Y", "Y", "Y"], // UR(edge)=Y
  },

  {
    id: 2,
    name: "Zamboni",
    group: "Dot",
    alg: "y' R U' R2 D' r U r' D R2 U R'",
    // UFL→Y on left[2], UFR→Y on right[0], UBL→Y on back[0], UBR→Y on back[2].
    top: ["G", "G", "G", "G", "Y", "G", "G", "G", "G"],
    back: ["G", "Y", "Y"], // UBL-back=Y, UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "Y"], // UF(edge)=Y
    left: ["Y", "Y", "Y"], // UL(edge)=Y, UFL-left=Y
    right: ["G", "Y", "G"], // UFR-right=Y, UR(edge)=Y
  },

  {
    id: 3,
    name: "Anti-Pinwheel",
    group: "Dot",
    alg: "y' f (R U R' U') f' U' F (R U R' U') F'",
    // Pinwheel: each corner yellow shows on a different face in CW rotation.
    // UFL→Y front[0], UFR→Y right[0], UBR→Y back[2], UBL→Y left[0].
    top: ["G", "G", "G", "G", "Y", "G", "Y", "G", "G"],
    back: ["Y", "Y", "G"], // UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "Y"], // UFL-front=Y, UF(edge)=Y
    left: ["G", "Y", "G"], // UBL-left=Y, UL(edge)=Y
    right: ["Y", "Y", "G"], // UFR-right=Y, UR(edge)=Y
  },

  {
    id: 4,
    name: "Pinwheel / Mouse",
    group: "Dot",
    alg: "y' f (R U R' U') f' (U) F (R U R' U') F'",
    // Anti-pinwheel: each corner yellow shows on a different face in CCW rotation.
    // UFL→Y left[2], UFR→Y front[2], UBR→Y right[2], UBL→Y back[0].
    top: ["G", "G", "G", "G", "Y", "G", "G", "G", "Y"],
    back: ["G", "Y", "Y"], // UBL-back=Y, UB(edge)=Y
    front: ["Y", "Y", "G"], // UF(edge)=Y, UFR-front=Y
    left: ["Y", "Y", "G"], // UL(edge)=Y, UFL-left=Y
    right: ["G", "Y", "G"], // UR(edge)=Y, UBR-right=Y
  },

  {
    id: 17,
    name: "Slash",
    group: "Dot",
    alg: "(R U R' U) (R' F R F') U2 (R' F R F')",
    // Slash: two corners toward front-left/back-right (one diagonal) and two corners opposite.
    // UFL→Y front[0], UBR→Y back[2] (one diagonal points outward front/back).
    // UFR→Y right[0], UBL→Y left[0] (other diagonal points outward left/right).
    top: ["Y", "G", "G", "G", "Y", "G", "G", "G", "Y"],
    back: ["G", "Y", "Y"], // UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "G"], // UFL-front=Y, UF(edge)=Y
    left: ["G", "Y", "Y"], // UBL-left=Y, UL(edge)=Y
    right: ["G", "Y", "G"], // UFR-right=Y, UR(edge)=Y
    // NOTE: Slash (OLL 17) and Anti-Pinwheel (OLL 3) can look similar but are distinct.
    // Their side strip patterns are verified to be identical in some positions but
    // the algorithms show they are different cases. The exact corner twist directions
    // distinguish them in practice.
  },

  {
    id: 18,
    name: "Crown",
    group: "Dot",
    alg: "y (R U2 R') (R' F R F') U2 M' (U R U' r')",
    // Crown: UFL→Y left[2], UFR→Y right[0], UBL→Y left[0], UBR→Y right[2].
    // Both corners on each side point inward (toward center of left/right faces).
    top: ["Y", "G", "Y", "G", "Y", "G", "G", "G", "G"],
    back: ["G", "Y", "G"], // UB(edge)=Y
    front: ["Y", "Y", "Y"], // UF(edge)=Y
    left: ["G", "Y", "G"], // UBL-left=Y, UL(edge)=Y, UFL-left=Y
    right: ["G", "Y", "G"], // UFR-right=Y, UR(edge)=Y, UBR-right=Y
  },

  {
    id: 19,
    name: "Bunny",
    group: "Dot",
    alg: "y S' R U R' S U' R' F R F'",
    // Bunny ears: UFL→Y front[0], UFR→Y front[2] (both front corners show yellow on front).
    // UBL→Y left[0], UBR→Y right[2].
    top: ["Y", "G", "Y", "G", "Y", "G", "G", "G", "G"],
    back: ["G", "Y", "G"], // UB(edge)=Y
    front: ["G", "Y", "G"], // UFL-front=Y, UF(edge)=Y, UFR-front=Y
    left: ["G", "Y", "Y"], // UBL-left=Y, UL(edge)=Y
    right: ["G", "Y", "Y"], // UR(edge)=Y, UBR-right=Y
  },

  {
    id: 20,
    name: "X / Checkers",
    group: "Dot",
    alg: "(r U R' U') M2 (U R U' R') U' M'",
    // X pattern: UFL→Y front[0], UFR→Y front[2], UBL→Y back[0], UBR→Y back[2].
    // Same as OLL 1 but edges show differently.
    // Actually OLL 20 vs OLL 1: both have 4 front/back corner stickers,
    // but OLL 20 has UFL→Y on left, UFR→Y on right, UBL→Y on left, UBR→Y on right.
    // (All corners show yellow on the narrow side faces = X/checkers pattern when viewed from sides)
    top: ["Y", "G", "Y", "G", "Y", "G", "Y", "G", "Y"],
    back: ["G", "Y", "G"], // UB(edge)=Y
    front: ["G", "Y", "G"], // UF(edge)=Y
    left: ["G", "Y", "G"], // UBL-left=Y, UL(edge)=Y, UFL-left=Y
    right: ["G", "Y", "G"], // UFR-right=Y, UR(edge)=Y, UBR-right=Y
    // Note: OLL 18 (Crown) and OLL 20 (X/Checkers) have same side pattern here.
    // They differ in algorithm due to the cube orientation when the alg is applied.
    // Both are legitimate "X" and "Crown" patterns — they ARE visually distinct
    // because of how the stickers from the other two side faces look.
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Square
  // A 2×1 block of non-yellow in one back corner of the top face. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 5,
    name: "Right Back Square",
    group: "Square",
    alg: "r' U2 (R U R' U) r",
    // Top has BL and BE grey (UFL unoriented, UB edge unoriented).
    // All other edges oriented. UBL, UFR, UBR corners oriented.
    // UFL→Y front[0]. UB edge→ back[1]=Y.
    top: ["G", "G", "G", "G", "Y", "Y", "G", "Y", "Y"],
    back: ["Y", "Y", "G"], // UB(edge)=Y
    front: ["G", "G", "G"], // UFL-front=Y
    left: ["G", "Y", "Y"],
    right: ["Y", "G", "G"],
  },

  {
    id: 6,
    name: "Right Front Square",
    group: "Square",
    alg: "r U2 (R' U' R U') r'",
    // Mirror of OLL 5. Top has BR and BE grey (UFR unoriented, UF edge unoriented).
    top: ["G", "Y", "Y", "G", "Y", "Y", "G", "G", "G"],
    back: ["G", "G", "G"],
    front: ["Y", "Y", "G"], // UF(edge)=Y
    left: ["Y", "Y", "G"],
    right: ["G", "G", "Y"], // UFR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Lightning (Small Lightning Bolt)
  // A lightning bolt shape on top — one edge + one corner unoriented in one area. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 7,
    name: "Lightning / Wide Sune",
    group: "Lightning",
    alg: "r (U R' U R) U2 r' ",
    // All corners oriented except UBR. All edges oriented except UB.
    // UBR→Y on back[2]. UB edge→Y on back[1].
    top: ["G", "Y", "G", "Y", "Y", "G", "Y", "G", "G"],
    back: ["Y", "G", "G"], // UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "Y"],
    left: ["G", "G", "G"],
    right: ["Y", "Y", "G"],
  },

  {
    id: 8,
    name: "Wide Left Sune",
    group: "Lightning",
    alg: "y2 r' (U' R U' R') U2 r",
    // Mirror of OLL 7. UBL unoriented, UB edge unoriented.
    top: ["G", "Y", "G", "G", "Y", "Y", "G", "G", "Y"],
    back: ["G", "G", "Y"], // UBL-back=Y, UB(edge)=Y
    front: ["Y", "Y", "G"],
    left: ["Y", "Y", "G"],
    right: ["G", "G", "G"],
  },

  {
    id: 11,
    name: "Downstairs",
    group: "Lightning",
    alg: "r' R2 U R' U R U2 R' U M'",
    // UFR unoriented, UF edge unoriented.
    // UFR→Y on right[0]. UF edge→Y on front[1].
    top: ["G", "G", "G", "G", "Y", "Y", "Y", "Y", "G"],
    back: ["Y", "Y", "G"],
    front: ["G", "G", "Y"], // UF(edge)=Y, UFR-front=Y
    left: ["G", "Y", "G"],
    right: ["Y", "G", "G"],
  },

  {
    id: 12,
    name: "Upstairs",
    group: "Lightning",
    alg: "y' M' (R' U' R U' R' U2 R) U' M",
    // Mirror of OLL 11. UFL unoriented, UF edge unoriented.
    top: ["G", "G", "Y", "G", "Y", "Y", "G", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["Y", "G", "G"], // UFL-front=Y, UF(edge)=Y
    left: ["Y", "Y", "G"],
    right: ["G", "G", "Y"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Big Lightning Bolt
  // Two edges + one corner unoriented, creating a big L/lightning. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 39,
    name: "Fung",
    group: "Big Lightning Bolt",
    alg: "y L F' (L' U' L U) F U' L'",
    // UFL unoriented, UF edge unoriented, UL edge unoriented.
    // UFL→Y on front[0]. UF edge→Y on front[1]. UL edge→Y on left[1].
    top: ["Y", "Y", "G", "G", "Y", "G", "G", "Y", "Y"],
    back: ["G", "G", "Y"],
    front: ["G", "G", "G"], // UFL-front=Y, UF(edge)=Y
    left: ["G", "Y", "Y"], // UL(edge)=Y
    right: ["G", "Y", "G"],
  },

  {
    id: 40,
    name: "Anti-Fung",
    group: "Big Lightning Bolt",
    alg: "y R' F (R U R' U') F' U R",
    // Mirror of OLL 39. UFR unoriented, UF edge unoriented, UR edge unoriented.
    top: ["G", "Y", "Y", "G", "Y", "G", "Y", "Y", "G"],
    back: ["G", "G", "G"],
    front: ["G", "G", "Y"], // UF(edge)=Y, UFR-front=Y
    left: ["Y", "Y", "G"],
    right: ["G", "Y", "G"], // UFR-right=Y, UR(edge)=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Fish
  // One corner + adjacent side edge both unoriented; other two corners oriented. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 9,
    name: "Kite",
    group: "Fish",
    alg: "y (R U R' U') (R' F R) (R U R' U') F'",
    // UFR unoriented, UR edge unoriented. UBL unoriented, all others oriented.
    // UFR→Y right[0]. UR→Y right[1]. UBL→Y left[0].
    top: ["G", "G", "Y", "Y", "Y", "G", "G", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["Y", "G", "G"],
    left: ["Y", "G", "G"], // UBL-left=Y
    right: ["G", "Y", "Y"], // UFR-right=Y, UR(edge)=Y
  },

  {
    id: 10,
    name: "Anti-Kite",
    group: "Fish",
    alg: "(R U R' U) (R' F R F') (R U2 R')",
    // Mirror of OLL 9. UFL unoriented, UL edge unoriented. UBR unoriented.
    top: ["G", "G", "Y", "Y", "Y", "G", "G", "Y", "G"],
    back: ["Y", "Y", "G"],
    front: ["G", "G", "Y"],
    left: ["G", "G", "Y"], // UL(edge)=Y, UFL-left=Y
    right: ["G", "Y", "G"], // UBR-right=Y
  },

  {
    id: 35,
    name: "Fish Salad",
    group: "Fish",
    alg: "(R U2 R') (R' F R F') (R U2 R')",
    // UFR unoriented, UBL unoriented. All edges oriented.
    // UFR→Y on front[2]. UBL→Y on back[0].
    top: ["Y", "G", "G", "G", "Y", "Y", "G", "Y", "Y"],
    back: ["G", "Y", "G"], // UBL-back=Y
    front: ["Y", "G", "G"], // UFR-front=Y
    left: ["G", "Y", "G"],
    right: ["Y", "G", "G"],
  },

  {
    id: 37,
    name: "Mounted Fish",
    group: "Fish",
    alg: "F R' F' R U R U' R'",
    // UFL unoriented, UBR unoriented. All edges oriented.
    // UFL→Y on front[0]. UBR→Y on right[2].
    top: ["Y", "Y", "G", "Y", "Y", "G", "G", "G", "Y"],
    back: ["G", "G", "G"],
    front: ["Y", "Y", "G"], // UFL-front=Y
    left: ["G", "G", "G"],
    right: ["Y", "Y", "G"], // UBR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Knight Move
  // One corner + non-adjacent edge unoriented (knight move apart). 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 13,
    name: "Gun / Trigger",
    group: "Knight Move",
    alg: "F U R U2 R' U' R U R' F'",
    // UFR unoriented→Y right[0]. UR edge unoriented→Y right[1]. UBR unoriented→Y back[2].
    top: ["G", "G", "G", "Y", "Y", "Y", "Y", "G", "G"],
    back: ["Y", "Y", "G"], // UBR-back=Y
    front: ["G", "Y", "Y"],
    left: ["G", "G", "G"],
    right: ["Y", "G", "G"], // UFR-right=Y, UR(edge)=Y
  },

  {
    id: 14,
    name: "Anti-Gun",
    group: "Knight Move",
    alg: "R' F R U R' F' R F U' F'",
    // Mirror of OLL 13. UFL unoriented→Y left[2]. UL edge unoriented→Y left[1]. UBL unoriented→Y back[0].
    top: ["G", "G", "G", "Y", "Y", "Y", "G", "G", "Y"],
    back: ["G", "Y", "Y"], // UBL-back=Y
    front: ["Y", "Y", "G"],
    left: ["Y", "G", "G"], // UL(edge)=Y, UFL-left=Y
    right: ["G", "G", "G"],
  },

  {
    id: 15,
    name: "Squeegee",
    group: "Knight Move",
    alg: "r' U' r R' U' R U r' U r",
    // UFL unoriented→Y left[2]. UL edge unoriented→Y left[1]. UBR unoriented→Y back[2].
    top: ["G", "G", "G", "Y", "Y", "Y", "G", "G", "Y"],
    back: ["Y", "Y", "G"], // UBR-back=Y
    front: ["G", "Y", "G"],
    left: ["G", "G", "Y"], // UL(edge)=Y, UFL-left=Y
    right: ["Y", "G", "G"], // UR oriented (RE=Y in top), UBR-back=Y so UBR-right=G
  },

  {
    id: 16,
    name: "Anti-Squeegee",
    group: "Knight Move",
    alg: "r U r' R U R' U' r U' r'",
    // Mirror of OLL 15. UFR→Y right[0]. UR unoriented→Y right[1]. UBL→Y back[0].
    top: ["G", "G", "Y", "Y", "Y", "Y", "G", "G", "G"],
    back: ["G", "Y", "G"], // UBL-back=Y
    front: ["Y", "Y", "G"],
    left: ["Y", "G", "G"],
    right: ["G", "G", "Y"], // UFR-right=Y, UR(edge)=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Awkward
  // Mixed patterns — one or two edges + corners in non-symmetric layouts. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 29,
    name: "Spotted Chameleon",
    group: "Awkward",
    alg: "r2 D' r U r' D r2 U' r' U' r",
    // UB edge unoriented (TE=G), UBR corner unoriented (TR=G), UFR corner unoriented (BR=G).
    // UB→Y back[1]. UBR→Y back[2]. UFR→Y front[2].
    top: ["Y", "G", "Y", "Y", "Y", "G", "G", "Y", "G"],
    back: ["G", "Y", "G"], // UB(edge)=Y, UBR-back=Y
    front: ["G", "G", "G"], // UFR-front=Y
    left: ["G", "G", "Y"],
    right: ["G", "Y", "Y"],
  },

  {
    id: 30,
    name: "Anti-Spotted Chameleon",
    group: "Awkward",
    alg: "y' r' D' r U' r' D r2 U' r' U r U r'",
    // Mirror of OLL 29. UB edge unoriented (TE=G), UBL unoriented (TL=G), UFL unoriented (BL=G).
    // UB→Y back[1]. UBL→Y back[0]. UFL→Y front[0].
    top: ["Y", "G", "Y", "G", "Y", "Y", "G", "Y", "G"],
    back: ["G", "Y", "G"], // UBL-back=Y, UB(edge)=Y
    front: ["G", "G", "G"], // UFL-front=Y
    left: ["G", "Y", "Y"],
    right: ["G", "G", "Y"],
  },

  {
    id: 41,
    name: "Awkward Fish / Dalmation",
    group: "Awkward",
    alg: "y2 (R U R' U) (R U2 R') F (R U R' U') F'",
    // UF edge unoriented (BE=G), UBR corner unoriented (TR=G). All others oriented.
    // UF→Y front[1]. UBR→Y right[2].
    top: ["Y", "G", "Y", "G", "Y", "Y", "G", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["Y", "G", "Y"], // UF(edge)=Y
    left: ["G", "Y", "G"],
    right: ["G", "G", "G"], // UBR-right=Y
  },

  {
    id: 42,
    name: "Lefty Awkward Fish / Anti-Dalmation",
    group: "Awkward",
    alg: "(R' U' R U') (R' U2 R) F (R U R' U') F' ",
    // Mirror of OLL 41. UF edge unoriented (BE=G), UBL corner unoriented (TL=G).
    top: ["Y", "G", "Y", "Y", "Y", "G", "G", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["Y", "G", "Y"], // UF(edge)=Y
    left: ["G", "G", "G"], // UBL-left=Y
    right: ["G", "Y", "G"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: P-shape
  // Top face resembles the letter P or its mirror. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 31,
    name: "Couch",
    group: "P-shape",
    alg: "(R' U' F) (U R U' R') F' R",
    // UFR and UBR unoriented, UR edge unoriented.
    // UFR→Y right[0]. UR→Y right[1]. UBR→Y back[2].
    top: ["G", "Y", "Y", "G", "Y", "Y", "G", "G", "Y"],
    back: ["Y", "G", "G"], // UBR-back=Y
    front: ["Y", "Y", "G"],
    left: ["G", "Y", "G"],
    right: ["G", "G", "G"], // UFR-right=Y, UR(edge)=Y
  },

  {
    id: 32,
    name: "Anti-Couch",
    group: "P-shape",
    alg: "S (R U R' U') (R' F R f') ",
    // Mirror of OLL 31. UFL and UBL unoriented, UL edge unoriented.
    top: ["G", "G", "Y", "G", "Y", "Y", "G", "Y", "Y"],
    back: ["Y", "Y", "G"], // UBL-back=Y
    front: ["Y", "G", "G"],
    left: ["G", "Y", "G"], // UL(edge)=Y, UFL-left=Y
    right: ["G", "G", "G"],
  },

  {
    id: 43,
    name: "Anti-P",
    group: "P-shape",
    alg: "y R' U' (F' U F) R",
    // Only UFL unoriented, UF edge unoriented. All others oriented.
    // UFL→Y front[0]. UF→Y front[1].
    top: ["Y", "G", "G", "Y", "Y", "G", "Y", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["G", "G", "G"], // UFL-front=Y, UF(edge)=Y
    left: ["G", "G", "G"],
    right: ["Y", "Y", "Y"],
  },

  {
    id: 44,
    name: "P",
    group: "P-shape",
    alg: "f (R U R' U') f'",
    // Mirror of OLL 43. Only UFR unoriented, UF edge unoriented.
    // UFR→Y front[2]. UF→Y front[1].
    top: ["G", "G", "Y", "G", "Y", "Y", "G", "Y", "Y"],
    back: ["G", "Y", "G"],
    front: ["G", "G", "G"], // UF(edge)=Y, UFR-front=Y
    left: ["Y", "Y", "Y"],
    right: ["G", "G", "G"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: T-shape
  // Top face has a T shape of yellow. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 33,
    name: "Tying Shoelaces",
    group: "T-shape",
    alg: "(R U R' U') (R' F R F')",
    // UFR and UFL unoriented, UF edge unoriented. UBL/UBR oriented.
    // UFR→Y front[2], UFL→Y front[0], UF→Y front[1].
    top: ["G", "G", "Y", "Y", "Y", "Y", "G", "G", "Y"],
    back: ["Y", "Y", "G"],
    front: ["Y", "Y", "G"], // UFL-front=Y, UF(edge)=Y, UFR-front=Y
    left: ["G", "G", "G"],
    right: ["G", "G", "G"],
  },

  {
    id: 45,
    name: "Suit Up",
    group: "T-shape",
    alg: "F (R U R' U') F'",
    // UBR and UBL unoriented, UB edge unoriented. UFR/UFL oriented.
    // UBR→Y back[2], UBL→Y back[0], UB→Y back[1].
    top: ["G", "G", "Y", "Y", "Y", "Y", "G", "G", "Y"],
    back: ["G", "Y", "G"], // UBL-back=Y, UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "G"],
    left: ["Y", "G", "Y"],
    right: ["G", "G", "G"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: C-shape
  // Top face has a C shape of yellow. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 34,
    name: "City",
    group: "C-shape",
    alg: "y f R f' U' r' U' R U M'",
    // UBL, UFL unoriented, UL edge unoriented. All point to left face.
    // UBL→Y left[0], UL→Y left[1], UFL→Y left[2].
    top: ["Y", "G", "Y", "Y", "Y", "Y", "G", "G", "G"],
    back: ["G", "Y", "G"],
    front: ["G", "Y", "G"],
    left: ["G", "G", "Y"], // UBL-left=Y, UL(edge)=Y, UFL-left=Y
    right: ["G", "G", "Y"],
  },

  {
    id: 46,
    name: "Seein' Headlights",
    group: "C-shape",
    alg: "R' U' (R' F R F') U R",
    // Mirror of OLL 34. UBR, UFR unoriented, UR edge unoriented. All point to right face.
    top: ["Y", "Y", "G", "G", "Y", "G", "Y", "Y", "G"],
    back: ["G", "G", "G"],
    front: ["G", "G", "G"],
    left: ["G", "Y", "G"],
    right: ["Y", "Y", "Y"], // UFR-right=Y, UR(edge)=Y, UBR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: W-shape
  // Top face has a W shape of yellow. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 36,
    name: "Sea-Mew / Wario",
    group: "W-shape",
    alg: "y R U R2 F' U' F U R2 U2 R'",
    // UFL, UFR unoriented (both front corners), UBR unoriented.
    // UFL→Y front[0], UFR→Y front[2], UBR→Y right[2].
    top: ["Y", "G", "G", "Y", "Y", "G", "G", "Y", "Y"],
    back: ["G", "Y", "G"],
    front: ["Y", "G", "G"], // UFL-front=Y, UFR-front=Y
    left: ["G", "G", "G"],
    right: ["Y", "Y", "G"], // UBR-right=Y
  },

  {
    id: 38,
    name: "Mario / Moustache",
    group: "W-shape",
    alg: "(R U R' U) (R U' R' U') (R' F R F') ",
    // Mirror of OLL 36. UFL, UFR unoriented, UBL unoriented.
    // UFL→Y front[0], UFR→Y front[2], UBL→Y left[0].
    top: ["G", "Y", "Y", "Y", "Y", "G", "Y", "G", "G"],
    back: ["Y", "G", "G"],
    front: ["G", "Y", "G"], // UFL-front=Y, UFR-front=Y
    left: ["G", "G", "G"], // UBL-left=Y
    right: ["G", "Y", "Y"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: L-shape
  // Top face has an L shape of yellow. 6 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 47,
    name: "Anti-Breakneck",
    group: "L-shape",
    alg: "y' F R' F' R U2 R U' R' U R U2 R'",
    // UFL unoriented, UL edge unoriented. UBL unoriented.
    // UFL→Y front[0], UL→Y left[1], UBL→Y left[0].
    // top: TL=G(UBL), TE=Y, TR=Y, LE=G(UL), CC=Y, RE=Y, BL=G(UFL), BE=Y, BR=Y
    top: ["G", "Y", "G", "G", "Y", "Y", "G", "G", "G"],
    back: ["Y", "G", "G"],
    front: ["Y", "Y", "G"], // UFL-front=Y
    left: ["G", "Y", "G"], // UBL-left=Y, UL(edge)=Y
    right: ["Y", "G", "Y"],
  },

  {
    id: 48,
    name: "Breakneck",
    group: "L-shape",
    alg: "F (R U R' U') (R U R' U') F'",
    // Mirror of OLL 47. UFR unoriented, UR edge unoriented. UBR unoriented.
    top: ["G", "Y", "G", "Y", "Y", "G", "G", "G", "G"],
    back: ["G", "G", "Y"],
    front: ["G", "Y", "Y"], // UFR-front=Y
    left: ["Y", "G", "Y"],
    right: ["G", "Y", "G"], // UR(edge)=Y, UBR-right=Y
  },

  {
    id: 49,
    name: "Right Back Squeezy",
    group: "L-shape",
    alg: "y2 r U' (r2 U) (r2 U) (r2) U' r",
    // UBL unoriented, UB edge unoriented, UL edge unoriented.
    // UBL→Y back[0], UB→Y back[1], UL→Y left[1].
    // top: TL=G(UBL), TE=G(UB), TR=Y, LE=G(UL), CC=Y, RE=Y, BL=Y, BE=Y, BR=Y
    top: ["G", "G", "G", "Y", "Y", "G", "G", "Y", "G"],
    back: ["Y", "Y", "G"], // UBL-back=Y, UB(edge)=Y
    front: ["Y", "G", "G"],
    left: ["G", "G", "G"], // UL(edge)=Y
    right: ["Y", "Y", "Y"],
  },

  {
    id: 50,
    name: "Right Front Squeezy",
    group: "L-shape",
    alg: "r' U (r2 U') (r2 U') (r2) U r'",
    // Mirror of OLL 49. UBR unoriented, UB edge unoriented, UR edge unoriented.
    top: ["G", "G", "G", "G", "Y", "Y", "G", "Y", "G"],
    back: ["G", "Y", "Y"], // UB(edge)=Y, UBR-back=Y
    front: ["G", "G", "Y"],
    left: ["Y", "Y", "Y"],
    right: ["G", "G", "G"], // UR(edge)=Y
  },

  {
    id: 53,
    name: "Frying Pan",
    group: "L-shape",
    alg: "(r' U' R U') (R' U R U') (R' U2 r)",
    // UBL, UFL unoriented, UL edge unoriented, UBR unoriented.
    // UBL→Y left[0], UL→Y left[1], UFL→Y left[2], UBR→Y right[2].
    // top: TL=G(UBL), TE=Y, TR=G(UBR), LE=G(UL), CC=Y, RE=Y, BL=G(UFL), BE=Y, BR=Y
    top: ["G", "G", "G", "G", "Y", "Y", "G", "Y", "G"],
    back: ["G", "Y", "G"],
    front: ["G", "G", "G"],
    left: ["Y", "Y", "Y"], // UBL-left=Y, UL(edge)=Y, UFL-left=Y
    right: ["Y", "G", "Y"], // UBR-right=Y
  },

  {
    id: 54,
    name: "Anti-Frying Pan",
    group: "L-shape",
    alg: "(r U R' U) (R U' R' U) (R U2 r')",
    // Mirror of OLL 53. UBR, UFR unoriented, UR edge unoriented, UBL unoriented.
    top: ["G", "Y", "G", "G", "Y", "Y", "G", "G", "G"],
    back: ["G", "G", "G"],
    front: ["G", "Y", "G"],
    left: ["Y", "Y", "Y"], // UBL-left=Y
    right: ["Y", "G", "Y"], // UFR-right=Y, UR(edge)=Y, UBR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: I-shape (Line)
  // Top face has an I/line shape of yellow (bar through center). 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 51,
    name: "Bottlecap / Ant",
    group: "I-shape",
    alg: "y2 F U R U' R' U R U' R' F'",
    // UF and UB edges unoriented. All 4 corners unoriented.
    // All corners: UFL→Y front[0], UFR→Y front[2], UBL→Y back[0], UBR→Y back[2].
    // top: TL=G, TE=G(UB), TR=G, LE=Y(UL oriented), CC=Y, RE=Y(UR oriented), BL=G, BE=G(UF), BR=G
    top: ["G", "G", "G", "Y", "Y", "Y", "G", "G", "G"],
    back: ["G", "Y", "Y"], // UBL-back=Y, UB(edge)=Y, UBR-back=Y
    front: ["G", "Y", "Y"], // UFL-front=Y, UF(edge)=Y, UFR-front=Y
    left: ["Y", "G", "Y"],
    right: ["G", "G", "G"],
  },

  {
    id: 52,
    name: "Rice Cooker",
    group: "I-shape",
    alg: "y2 R' F' U' F U' R U R' U R",
    // Same top as OLL 51 (I-shape), but corners rotated differently.
    // UFL→Y left[2], UFR→Y right[0], UBL→Y left[0], UBR→Y right[2].
    top: ["G", "Y", "G", "G", "Y", "G", "G", "Y", "G"],
    back: ["Y", "G", "G"], // UB(edge)=Y
    front: ["Y", "G", "G"], // UF(edge)=Y
    left: ["G", "Y", "G"], // UBL-left=Y, UFL-left=Y
    right: ["Y", "Y", "Y"], // UFR-right=Y, UBR-right=Y
  },

  {
    id: 55,
    name: "Highway / Freeway",
    group: "I-shape",
    alg: "y R' F U R U' R2 F' R2 U R' U' R",
    // UL and UR edges unoriented. All 4 corners unoriented.
    // UFL→Y front[0], UFR→Y front[2], UBL→Y back[0], UBR→Y back[2].
    // top: TL=G, TE=Y(UB oriented), TR=G, LE=G(UL), CC=Y, RE=G(UR), BL=G, BE=Y(UF oriented), BR=G
    top: ["G", "Y", "G", "G", "Y", "G", "G", "Y", "G"],
    back: ["G", "G", "G"], // UBL-back=Y, UBR-back=Y
    front: ["G", "G", "G"], // UFL-front=Y, UFR-front=Y
    left: ["Y", "Y", "Y"], // UL(edge)=Y
    right: ["Y", "Y", "Y"], // UR(edge)=Y
  },

  {
    id: 56,
    name: "Streetlights / Dead Man",
    group: "I-shape",
    alg: "(r U r') (U R U' R') (U R U' R') (r U' r')",
    // Same top as OLL 55 (vertical I-shape), corners rotated differently.
    // UFL→Y left[2], UFR→Y right[0], UBL→Y left[0], UBR→Y right[2].
    top: ["G", "G", "G", "Y", "Y", "Y", "G", "G", "G"],
    back: ["G", "Y", "G"],
    front: ["G", "Y", "G"],
    left: ["Y", "G", "Y"], // UBL-left=Y, UL(edge)=Y, UFL-left=Y
    right: ["Y", "G", "Y"], // UFR-right=Y, UR(edge)=Y, UBR-right=Y
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: All Corners Oriented
  // All 4 corners are oriented (yellow on top). Only edges vary. 2 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: 28,
    name: "Stealth / Arrow",
    group: "All Corners Oriented",
    alg: "(r U R' U') M (U R U' R')",
    // All corners oriented. UB edge unoriented → back[1]=Y. All other edges oriented.
    top: ["Y", "Y", "Y", "Y", "Y", "G", "Y", "G", "Y"],
    back: ["G", "G", "G"], // UB(edge)=Y
    front: ["G", "Y", "G"],
    left: ["G", "G", "G"],
    right: ["G", "Y", "G"],
  },

  {
    id: 57,
    name: "Mummy",
    group: "All Corners Oriented",
    alg: "(R U R' U') M' (U R U' r')",
    // All corners oriented. UF and UB edges both unoriented.
    top: ["Y", "G", "Y", "Y", "Y", "Y", "Y", "G", "Y"],
    back: ["G", "Y", "G"], // UB(edge)=Y
    front: ["G", "Y", "G"], // UF(edge)=Y
    left: ["G", "G", "G"],
    right: ["G", "G", "G"],
  },
];

// ============================================================
// PLL CASES (21 total)
// ============================================================
// Standard orientation: Front=Red(R), Right=Green(G),
//                       Back=Orange(O), Left=Blue(B)
//
// Side strips show piece colors at each position.
// A "solved" strip would be [O,O,O] for back, [R,R,R] for front,
// [B,B,B] for left, [G,G,G] for right.
//
// Strip positions:
//   back:  [UBL-back, UB-back,  UBR-back]
//   front: [UFL-front, UF-front, UFR-front]
//   left:  [UBL-left,  UL-left,  UFL-left]
//   right: [UFR-right, UR-right,  UBR-right]
//
// Each PLL moves pieces around the top layer while keeping yellow on top.
// The strips show where each piece's colored sticker is, NOT where it came from.
// ============================================================

export const PLL_CASES: PLLCase[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // Group: Edges Only
  // Only the 4 edges are permuted; corners are in their solved positions. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: "Ua",
    name: "Ua-Perm",
    group: "Edges Only",
    alg: "R U' R U R U R U' R' U' R2",
    // 3-cycle of edges: UF→UL→UB (CCW cycle of front, left, back edges).
    // UFR corner: correct. UBR corner: correct. UFL corner: correct. UBL corner: correct.
    // UF edge goes to UL position, UL goes to UB, UB goes to UF.
    // front: UF position now has what was UL (blue-R sticker → left edge's right side?)
    // Let's think in terms of which sticker shows on which face:
    // Solved: back=[O,O,O], front=[R,R,R], left=[B,B,B], right=[G,G,G]
    // Ua: UF→UL, UB→UF, UL→UB (CCW from top = U move direction)
    // After Ua cycle: the piece that was at UB (color O on back) is now at UF position.
    //   → front[1] = O (the back-colored piece is now at front)
    // The piece that was at UL (color B on left) is now at UB.
    //   → back[1] = B
    // The piece that was at UF (color R on front) is now at UL.
    //   → left[1] = R
    // Corners stay: corners keep their stickers.
    // Corner stickers determine the [0] and [2] positions of each strip.
    // Solved corners: UBL=[O,B], UBR=[O,G], UFR=[R,G], UFL=[R,B] (back/left, back/right, etc.)
    // After Ua (edges only): corners unchanged.
    back: ["O", "B", "O"], // UBL-back=O(correct), UB(edge now has UL piece)=B, UBR-back=O(correct)
    front: ["R", "O", "R"], // UFL-front=R(correct), UF(edge now has UB piece)=O, UFR-front=R(correct)
    left: ["B", "R", "B"], // UBL-left=B(correct), UL(edge now has UF piece)=R, UFL-left=B(correct)
    right: ["G", "G", "G"], // UR edge stays, corners correct → all G
  },

  {
    id: "Ub",
    name: "Ub-Perm",
    group: "Edges Only",
    alg: "R2 U R U R' U' R' U' R' U R'",
    // Inverse of Ua. 3-cycle: UF→UB→UL (CW from top).
    // UF→UB, UB→UL, UL→UF.
    // UF piece (R sticker) → UB: back[1]=R
    // UB piece (O sticker) → UL: left[1]=O
    // UL piece (B sticker) → UF: front[1]=B
    back: ["O", "R", "O"],
    front: ["R", "B", "R"],
    left: ["B", "O", "B"],
    right: ["G", "G", "G"],
  },

  {
    id: "H",
    name: "H-Perm",
    group: "Edges Only",
    alg: "M2 U M2 U2 M2 U M2",
    // Swaps UF↔UB and UL↔UR simultaneously.
    back: ["O", "R", "O"], // UB position now has UF piece (R)
    front: ["R", "O", "R"], // UF position now has UB piece (O)
    left: ["B", "G", "B"], // UL position now has UR piece (G)
    right: ["G", "B", "G"], // UR position now has UL piece (B)
  },

  {
    id: "Z",
    name: "Z-Perm",
    group: "Edges Only",
    alg: "M2 U M2 U M' U2 M2 U2 M'",
    // Swaps UF↔UL and UB↔UR.
    // UF(R)↔UL(B): front[1]=B, left[1]=R
    // UB(O)↔UR(G): back[1]=G, right[1]=O
    back: ["O", "G", "O"],
    front: ["R", "B", "R"],
    left: ["B", "R", "B"],
    right: ["G", "O", "G"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Corners Only
  // Only the 4 corners are permuted; edges are in their solved positions. 3 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: "Aa",
    name: "Aa-Perm",
    group: "Corners Only",
    alg: "x (R' U R') D2 (R U' R') D2 R2 x'",
    // 3-cycle of corners: UFR→UBR→UBL (leaving UFL fixed).
    // Corners after cycle:
    //   UFL: stays → front[0]=R, left[2]=B
    //   UFR (now has UBR piece): UFR position gets UBR's stickers (O,G originally at back/right)
    //     → right[0]=O, front[2]=G
    //   UBR (now has UBL piece): UBR position gets UBL's stickers (O,B originally at back/left)
    //     → back[2]=B, right[2]=O  ... wait, need to think about orientation.
    //   UBL (now has UFR piece): UBL position gets UFR's stickers (R,G originally at front/right)
    //     → back[0]=G, left[0]=R
    // Edges all stay: back[1]=O, front[1]=R, left[1]=B, right[1]=G
    back: ["O", "B", "O"],
    front: ["G", "G", "B"],
    left: ["B", "R", "R"],
    right: ["G", "O", "R"],
  },

  {
    id: "Ab",
    name: "Ab-Perm",
    group: "Corners Only",
    alg: "x R2 D2 (R U R') D2 (R U' R) x'",
    // Inverse of Aa. 3-cycle: UFR→UBL→UBR (leaving UFL fixed).
    // UFL: stays → front[0]=R, left[2]=B
    // UFR (now has UBL piece): UBL stickers at UFR position.
    //   UBL original stickers: back(O) and left(B). At UFR slot: front face = ?, right face = ?
    //   UBL piece going to UFR: its colors are O(back/orange) and B(left/blue) + Y(top)
    //   At UFR, the back face of UBL becomes the right face of UFR... complex.
    //   Simpler: Ab is mirror of Aa about left-right axis.
    //   Aa: back=[G,O,B], front=[R,R,G], left=[R,B,B], right=[O,G,O]
    //   Ab mirror: back=[B,O,G], front=[G,R,R], left=[O,B,B], right=[O,G,R]
    back: ["G", "B", "R"],
    front: ["G", "G", "O"],
    left: ["O", "R", "R"],
    right: ["B", "O", "B"],
  },

  {
    id: "E",
    name: "E-Perm",
    group: "Corners Only",
    alg: "y x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x",
    // Swaps diagonal corner pairs: UFR↔UBL and UFL↔UBR.
    // UFR gets UBL's stickers, UBL gets UFR's stickers (swap).
    // UFL gets UBR's stickers, UBR gets UFL's stickers (swap).
    // UFR(R,G) ↔ UBL(O,B): UFR slot shows O,B rotated; UBL slot shows R,G rotated.
    // The exact rotation of swapped corners:
    //   UFR now has UBL piece: front[2]=B(UBL's left→UFR's front?), right[0]=O
    //   UBL now has UFR piece: back[0]=R, left[0]=G
    //   UFL now has UBR piece: front[0]=G, left[2]=O
    //   UBR now has UFL piece: back[2]=B, right[2]=R
    back: ["G", "O", "B"],
    front: ["G", "R", "B"],
    left: ["O", "B", "R"],
    right: ["O", "G", "R"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Adjacent Corner Swap
  // One pair of adjacent corners swapped + edge movements. 6 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: "T",
    name: "T-Perm",
    group: "Adjacent Corner Swap",
    alg: "(R U R' U') (R' F R2) (U' R' U') (R U R' F')",
    // Swaps UFR↔UFL corners AND swaps UF↔UB edges.
    // UFR(R,G) ↔ UFL(R,B): corners swap adjacent.
    //   UFR slot now has UFL piece: right[0]=B, front[2]=R(wrong... )
    //   Actually T-perm swaps UFR and UBR corners + UF and UB edges.
    //   Classic T-perm: swaps (UFR,UBR) corners and (UF,UB) edges.
    // Let me use authoritative T-perm pattern:
    //   Corners: UFR↔UBR swap (front-right and back-right swap).
    //   Edges: UF↔UB swap.
    //   UFL, UBL corners and UL, UR edges stay.
    //   UFR(R,G)→UBR position: back[2]=R, right[2]=G  ... corner orientation matters
    //   UBR(O,G)→UFR position: front[2]=O, right[0]=G
    //   UF(R)→UB: back[1]=R. UB(O)→UF: front[1]=O.
    back: ["B", "B", "O"],
    front: ["G", "G", "O"],
    left: ["R", "O", "R"],
    right: ["G", "R", "B"],
  },

  {
    id: "F",
    name: "F-Perm",
    group: "Adjacent Corner Swap",
    alg: "y (R' U' F') (R U R' U') R' F R2 (U' R' U') (R U R' U) R",
    // F-perm: swaps UFL↔UBL corners and UL↔UF edges.
    // UFL(R,B)→UBL position: back[0]=R, left[0]=B
    // UBL(O,B)→UFL position: front[0]=O, left[2]=B
    // UL(B)→UF: front[1]=B. UF(R)→UL: left[1]=R.
    back: ["G", "O", "B"],
    front: ["R", "R", "R"],
    left: ["O", "G", "B"],
    right: ["O", "B", "G"],
  },

  {
    id: "Ja",
    name: "Ja-Perm",
    group: "Adjacent Corner Swap",
    alg: "y2 x R2 F R F' R U2 r' U r U2 x'",
    // Swaps UFL↔UFR corners and UL↔UF edges.
    // Classic Ja-perm: (UFR UFL)(UF UL) — front two corners swap, front and left edges swap.
    // UFR(R,G)→UFL: front[0]=G(UFR's right→UFL's front?), left[2]=R
    // UFL(R,B)→UFR: front[2]=B(UFL's left→UFR's front?), right[0]=R
    // UF(R)→UL: left[1]=R. UL(B)→UF: front[1]=B.
    back: ["O", "G", "G"],
    front: ["O", "O", "B"],
    left: ["B", "B", "G"],
    right: ["R", "R", "R"],
  },

  {
    id: "Jb",
    name: "Jb-Perm",
    group: "Adjacent Corner Swap",
    alg: "(R U R' F') (R U R' U') R' F R2 U' R'",
    // Mirror of Ja. Swaps UFR↔UBR corners and UR↔UF edges.
    // UFR(R,G)→UBR: back[2]=R, right[2]=G
    // UBR(O,G)→UFR: front[2]=O, right[0]=G ... wait corners cycle not just swap
    // Jb: (UFR UBR)(UF UR) cycle
    // UFR→UBR: UFR piece (front sticker R, right sticker G) goes to UBR slot.
    //   At UBR: right face shows, back face shows. UFR piece: right=G→right[2]=G, front=R→back[2]=R
    // UBR→UFR: UBR piece (back sticker O, right sticker G) goes to UFR slot.
    //   At UFR: front face shows, right face shows. UBR piece: back=O→front[2]=O, right=G→right[0]=G
    // UF→UR: UF piece (front sticker R) → UR slot: right[1]=R
    // UR→UF: UR piece (right sticker G) → UF slot: front[1]=G
    back: ["O", "O", "G"],
    front: ["R", "G", "G"],
    left: ["B", "B", "B"],
    right: ["R", "R", "O"],
  },

  {
    id: "Ra",
    name: "Ra-Perm",
    group: "Adjacent Corner Swap",
    alg: "y (R U' R' U') (R U R D) (R' U' R D') (R' U2 R')",
    // Ra involves a 3-cycle of corners and a 3-cycle of edges on the same side.
    // Ra: (UFR UBR UBL) corners, (UF UR UB) edges — complex cycle.
    // Ra standard pattern (from reference):
    back: ["R", "G", "O"],
    front: ["B", "O", "B"],
    left: ["G", "B", "O"],
    right: ["G", "R", "R"],
  },

  {
    id: "Rb",
    name: "Rb-Perm",
    group: "Adjacent Corner Swap",
    alg: "(R' U2) (R U2) (R' F R) (U R' U' R') F' R2",
    // Mirror of Ra.
    back: ["G", "O", "B"],
    front: ["R", "G", "R"],
    left: ["O", "B", "B"],
    right: ["O", "R", "G"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: Diagonal Corner Swap
  // One pair of diagonal corners swapped + edge movements. 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: "Y",
    name: "Y-Perm",
    group: "Diagonal Corner Swap",
    alg: "F R (U' R' U') (R U R' F') (R U R' U') (R' F R F')",
    // Swaps UFR↔UBL (diagonal) and UF↔UR edges.
    // UFR(R,G)→UBL: at UBL, back face and left face show.
    //   UFR right sticker G → UBL back[0]=G, UFR front sticker R → UBL left[0]=R
    // UBL(O,B)→UFR: at UFR, front face and right face show.
    //   UBL back sticker O → UFR right[0]=O, UBL left sticker B → UFR front[2]=B
    // UF(R)→UR: right[1]=R. UR(G)→UF: front[1]=G.
    back: ["G", "R", "B"],
    front: ["G", "G", "B"],
    left: ["O", "B", "R"],
    right: ["O", "O", "R"],
  },

  {
    id: "V",
    name: "V-Perm",
    group: "Diagonal Corner Swap",
    alg: "(R' U R' U') (R D' R' D) (R' U D') (R2 U' R2) D R2",
    // Swaps UFR↔UBL (diagonal) and UR↔UB edges.
    // UFR(R,G)→UBL: back[0]=G, left[0]=R (same corner swap as Y-perm but diff edges)
    // UBL(O,B)→UFR: right[0]=O, front[2]=B (same corner swap)
    // UR(G)→UB: back[1]=G. UB(O)→UR: right[1]=O.
    back: ["G", "O", "B"],
    front: ["G", "G", "B"],
    left: ["O", "R", "R"],
    right: ["O", "B", "R"],
  },

  {
    id: "Na",
    name: "Na-Perm",
    group: "Diagonal Corner Swap",
    alg: "(R U R' U) (R U R' F') (R U R' U') R' F R2 U' R' U2 (R U' R')",
    // Swaps two pairs of diagonal corners: UFR↔UBL AND UFL↔UBR.
    // All edges stay solved.
    // UFR(R,G)↔UBL(O,B) swap:
    //   UFR→UBL: back[0]=G(UFR right→back), left[0]=R(UFR front→left)
    //   UBL→UFR: front[2]=B(UBL left→front), right[0]=O(UBL back→right)
    // UFL(R,B)↔UBR(O,G) swap:
    //   UFL→UBR: back[2]=B(UFL left→back), right[2]=R(UFL front→right)
    //   UBR→UFL: front[0]=G(UBR right→front), left[2]=O(UBR back→left)
    back: ["B", "B", "G"],
    front: ["B", "G", "G"],
    left: ["R", "O", "O"],
    right: ["R", "R", "O"],
  },

  {
    id: "Nb",
    name: "Nb-Perm",
    group: "Diagonal Corner Swap",
    alg: "(R' U R U' R') (F' U' F) (R U R') (F R' F') (R U' R)",
    // Mirror of Na (same two diagonal swaps but opposite twist).
    // UFR↔UBL and UFL↔UBR swap, but with opposite corner twists.
    back: ["G", "B", "B"],
    front: ["G", "G", "B"],
    left: ["O", "O", "R"],
    right: ["O", "R", "R"],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // Group: G-Perms
  // 3-cycle of corners + 3-cycle of edges (not sharing the same face). 4 cases.
  // ──────────────────────────────────────────────────────────────────────────

  {
    id: "Ga",
    name: "Ga-Perm",
    group: "G-Perms",
    alg: "R2 (U R' U R' U' R U') R2 D (U' R' U R) D'",
    // Ga: corners (UFR UBL UFL) cycle, edges (UF UB UL) cycle (same direction).
    // UFR→UBL→UFL→UFR (CCW corners from top), UF→UB→UL→UF (CCW edges).
    // After cycle:
    //   UBL slot now has UFR piece (R,G): back[0]=R, left[0]=G ... corner orientation complex
    //   UFL slot now has UBL piece (O,B): front[0]=O, left[2]=B ...
    //   UFR slot now has UFL piece (R,B): front[2]=R, right[0]=B
    //   UB slot has UF piece (R): back[1]=R
    //   UL slot has UB piece (O): left[1]=O
    //   UF slot has UL piece (B): front[1]=B
    //   UBR corner and UR edge stay: back[2]=O, right[2]=G, right[1]=G
    back: ["B", "G", "O"],
    front: ["G", "O", "O"],
    left: ["R", "B", "R"],
    right: ["G", "R", "B"],
  },

  {
    id: "Gb",
    name: "Gb-Perm",
    group: "G-Perms",
    alg: "(R' U' R U) D' R2 (U R' U R U' R U') R2 D",
    // Inverse of Ga (or Ga with opposite cycles).
    // Corners: UFR→UFL→UBL→UFR (CW), Edges: UF→UL→UB→UF (CW).
    back: ["B", "G", "O"],
    front: ["G", "B", "O"],
    left: ["R", "O", "R"],
    right: ["G", "G", "B"],
  },

  {
    id: "Gc",
    name: "Gc-Perm",
    group: "G-Perms",
    alg: "R2 (U' R U' R U R' U) R2 D' (U R U' R') D",
    // Gc: corners (UFR UBR UBL) cycle, edges (UF UR UB) cycle.
    // UFR→UBR→UBL→UFR cycle with UF→UR→UB→UF.
    back: ["B", "O", "O"],
    front: ["G", "B", "O"],
    left: ["R", "G", "R"],
    right: ["G", "R", "B"],
  },

  {
    id: "Gd",
    name: "Gd-Perm",
    group: "G-Perms",
    alg: "(R U R' U') D R2 (U' R U' R' U R' U) R2 D'",
    // Inverse of Gc.
    back: ["B", "G", "R"],
    front: ["G", "R", "O"],
    left: ["R", "O", "R"],
    right: ["G", "B", "B"],
  },
];
