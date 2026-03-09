"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "oll" | "pll";
type S = "Y" | "G";

interface DiagramProps {
  // Top face — 9 cells, row-major: [TL, TE, TR, LE, CC, RE, BL, BE, BR]
  top: [S, S, S, S, S, S, S, S, S];
  // Side strips — 3 cells each
  back:  [S, S, S]; // left→right: TL-side, TE-side, TR-side
  front: [S, S, S]; // left→right: BL-side, BE-side, BR-side
  left:  [S, S, S]; // top→bottom: TL-side, LE-side, BL-side
  right: [S, S, S]; // top→bottom: TR-side, RE-side, BR-side
}

interface OLLCase {
  name: string;
  diagram: DiagramProps;
  alg: string;
}

// ── CaseDiagram ───────────────────────────────────────────────────────────────
//
// Flat 5×5 CSS grid — corners of the grid are empty:
//
//        [B0][B1][B2]
//   [L0] [TL][TE][TR] [R0]
//   [L1] [LE][CC][RE] [R1]
//   [L2] [BL][BE][BR] [R2]
//        [F0][F1][F2]

const Y_COL = "#FFD700";
const G_COL = "#3a3a3a";

function sty(c: S): React.CSSProperties {
  return { backgroundColor: c === "Y" ? Y_COL : G_COL, borderRadius: 2 };
}

export function CaseDiagram({ top, back, front, left, right }: DiagramProps) {
  const cell = 28;
  const side = 10;
  const gap  = 2;

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gridTemplateRows:    `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gap,
      }}
    >
      {/* Row 0 — back strip */}
      <div /><div style={sty(back[0])} /><div style={sty(back[1])} /><div style={sty(back[2])} /><div />
      {/* Row 1 — TL TE TR */}
      <div style={sty(left[0])} /><div style={sty(top[0])} /><div style={sty(top[1])} /><div style={sty(top[2])} /><div style={sty(right[0])} />
      {/* Row 2 — LE CC RE */}
      <div style={sty(left[1])} /><div style={sty(top[3])} /><div style={sty(top[4])} /><div style={sty(top[5])} /><div style={sty(right[1])} />
      {/* Row 3 — BL BE BR */}
      <div style={sty(left[2])} /><div style={sty(top[6])} /><div style={sty(top[7])} /><div style={sty(top[8])} /><div style={sty(right[2])} />
      {/* Row 4 — front strip */}
      <div /><div style={sty(front[0])} /><div style={sty(front[1])} /><div style={sty(front[2])} /><div />
    </div>
  );
}

// ── OLL Case Data ─────────────────────────────────────────────────────────────
//
// Top face positions:  [TL][TE][TR]   indices 0 1 2
//                      [LE][CC][RE]   indices 3 4 5
//                      [BL][BE][BR]   indices 6 7 8
//
// EOLL side stickers: middle cell (edge) flips with top orientation.
//   Corner cells for EOLL are G (corner orientation unknown at this step).
// OCLL side stickers: middle cells are G (cross already done).
//   Corner cells derived from the standard OLL state for each case.
//   H, L, Pi side stickers are explicitly specified in the design doc.

// ── Edge Orientation (3 cases) ───────────────────────────────────────────────

const EDGE_ORI: OLLCase[] = [
  {
    name: "Dot Shape",
    diagram: {
      top:   ["G","G","G","G","Y","G","G","G","G"],
      back:  ["G","Y","G"],
      front: ["G","Y","G"],
      left:  ["G","Y","G"],
      right: ["G","Y","G"],
    },
    alg: "F R U R' U' F' f R U R' U' f'",
  },
  {
    name: "I-Shape",
    diagram: {
      top:   ["G","G","G","Y","Y","Y","G","G","G"],
      back:  ["G","Y","G"],
      front: ["G","Y","G"],
      left:  ["G","G","G"],
      right: ["G","G","G"],
    },
    alg: "F R U R' U' F'",
  },
  {
    name: "L-Shape",
    diagram: {
      top:   ["G","G","G","Y","Y","G","G","Y","G"],
      back:  ["G","Y","G"],
      front: ["G","G","G"],
      left:  ["G","G","G"],
      right: ["G","Y","G"],
    },
    alg: "f R U R' U' f'",
  },
];

// ── Corner Orientation (7 cases) ─────────────────────────────────────────────
// All edges are Y (cross done). Middle cell of every side strip is G.

const CORNER_ORI: OLLCase[] = [
  {
    name: "Antisune",
    diagram: {
      top:   ["Y","Y","G","Y","Y","Y","G","Y","G"],
      // TL solved. Unoriented: TR faces back, BL faces front, BR faces right.
      back:  ["G","G","Y"],
      front: ["Y","G","G"],
      left:  ["G","G","G"],
      right: ["G","G","Y"],
    },
    alg: "R U2 R' U' R U' R'",
  },
  {
    name: "Sune",
    diagram: {
      top:   ["G","Y","G","Y","Y","Y","G","Y","Y"],
      // BR solved. Unoriented: TL faces back, TR faces right, BL faces left.
      back:  ["Y","G","G"],
      front: ["G","G","G"],
      left:  ["G","G","Y"],
      right: ["Y","G","G"],
    },
    alg: "R U R' U R U2 R'",
  },
  {
    name: "H",
    diagram: {
      top:   ["G","Y","G","Y","Y","Y","G","Y","G"],
      // Spec: left Y G Y, right Y G Y, back/front all G.
      back:  ["G","G","G"],
      front: ["G","G","G"],
      left:  ["Y","G","Y"],
      right: ["Y","G","Y"],
    },
    alg: "R U R' U R U' R' U R U2 R'",
  },
  {
    name: "L",
    diagram: {
      top:   ["G","Y","G","Y","Y","Y","G","Y","G"],
      // Spec: front Y G Y, left Y G Y, back/right all G.
      back:  ["G","G","G"],
      front: ["Y","G","Y"],
      left:  ["Y","G","Y"],
      right: ["G","G","G"],
    },
    alg: "F R' F' r U R U' r'",
  },
  {
    name: "Pi",
    diagram: {
      top:   ["G","Y","G","Y","Y","Y","G","Y","G"],
      // Spec: back Y G Y, front Y G Y, left/right all G.
      back:  ["Y","G","Y"],
      front: ["Y","G","Y"],
      left:  ["G","G","G"],
      right: ["G","G","G"],
    },
    alg: "R U2 R2 U' R2 U' R2 U2 R",
  },
  {
    name: "T",
    diagram: {
      top:   ["G","Y","Y","Y","Y","Y","Y","Y","G"],
      // TR, BL solved. Unoriented: TL faces left, BR faces front.
      back:  ["G","G","G"],
      front: ["G","G","Y"],
      left:  ["Y","G","G"],
      right: ["G","G","G"],
    },
    alg: "r U R' U' r' F R F'",
  },
  {
    name: "U",
    diagram: {
      top:   ["G","Y","G","Y","Y","Y","Y","Y","Y"],
      // BL, BR solved. Unoriented TL + TR show headlights on back face.
      back:  ["Y","G","Y"],
      front: ["G","G","G"],
      left:  ["G","G","G"],
      right: ["G","G","G"],
    },
    alg: "R2 D R' U2 R D' R' U2 R'",
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────

function CaseCard({ c }: { c: OLLCase }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] p-5">
      <p className="font-heading text-white text-[11px] leading-snug text-center">
        {c.name}
      </p>
      <div className="rounded-lg bg-[#13131f] border border-zinc-800 p-3 flex items-center justify-center">
        <CaseDiagram {...c.diagram} />
      </div>
      <p className="font-mono text-[#FFD700] text-xs tracking-wide text-center leading-relaxed">
        {c.alg}
      </p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ title, cases }: { title: string; cases: OLLCase[] }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Section header */}
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-heading text-[9px] text-zinc-700">
          {cases.length} {cases.length === 1 ? "CASE" : "CASES"}
        </span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cases.map((c) => (
          <CaseCard key={c.name} c={c} />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Algorithms() {
  const [tab, setTab] = useState<Tab>("oll");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
          REFERENCE
        </span>
        <h1
          className="font-heading text-white leading-snug mt-2"
          style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
        >
          ALGORITHMS
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          2-Look OLL and PLL reference. All 16 cases.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-10">
        {(["oll", "pll"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              tab === t
                ? "bg-[#FFD500] text-black"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {t === "oll" ? "2-Look OLL" : "2-Look PLL"}
          </button>
        ))}
      </div>

      {/* OLL tab */}
      {tab === "oll" && (
        <div className="flex flex-col gap-12">
          <Section
            title="Edge Orientation — Make the Yellow Cross"
            cases={EDGE_ORI}
          />
          <Section
            title="Corner Orientation — Complete the Yellow Face"
            cases={CORNER_ORI}
          />
        </div>
      )}

      {/* PLL tab — placeholder until Prompt 3 */}
      {tab === "pll" && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            COMING SOON
          </span>
          <p className="text-zinc-500 text-sm">PLL cases will be added next.</p>
        </div>
      )}
    </div>
  );
}
