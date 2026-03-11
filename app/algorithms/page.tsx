"use client";

import React, { useState } from "react";
import {
  OLL_CASES,
  PLL_CASES,
  type OLLCase as FullOLLCase,
  type PLLCase as FullPLLCase,
} from "./data";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "oll" | "full-oll" | "pll" | "full-pll";
type S = "Y" | "G";

interface DiagramProps {
  top: [S, S, S, S, S, S, S, S, S];
  back: [S, S, S];
  front: [S, S, S];
  left: [S, S, S];
  right: [S, S, S];
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
  const gap = 2;

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gridTemplateRows: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gap,
      }}
    >
      {/* Row 0 — back strip */}
      <div />
      <div style={sty(back[0])} />
      <div style={sty(back[1])} />
      <div style={sty(back[2])} />
      <div />
      {/* Row 1 — TL TE TR */}
      <div style={sty(left[0])} />
      <div style={sty(top[0])} />
      <div style={sty(top[1])} />
      <div style={sty(top[2])} />
      <div style={sty(right[0])} />
      {/* Row 2 — LE CC RE */}
      <div style={sty(left[1])} />
      <div style={sty(top[3])} />
      <div style={sty(top[4])} />
      <div style={sty(top[5])} />
      <div style={sty(right[1])} />
      {/* Row 3 — BL BE BR */}
      <div style={sty(left[2])} />
      <div style={sty(top[6])} />
      <div style={sty(top[7])} />
      <div style={sty(top[8])} />
      <div style={sty(right[2])} />
      {/* Row 4 — front strip */}
      <div />
      <div style={sty(front[0])} />
      <div style={sty(front[1])} />
      <div style={sty(front[2])} />
      <div />
    </div>
  );
}

// ── OLL Case Data (2-Look) ────────────────────────────────────────────────────

const EDGE_ORI: OLLCase[] = [
  {
    name: "Dot Shape",
    diagram: {
      top: ["G", "G", "G", "G", "Y", "G", "G", "G", "G"],
      back: ["G", "Y", "G"],
      front: ["G", "Y", "G"],
      left: ["G", "Y", "G"],
      right: ["G", "Y", "G"],
    },
    alg: "F R U R' U' F' f R U R' U' f'",
  },
  {
    name: "I-Shape",
    diagram: {
      top: ["G", "G", "G", "Y", "Y", "Y", "G", "G", "G"],
      back: ["G", "Y", "G"],
      front: ["G", "Y", "G"],
      left: ["G", "G", "G"],
      right: ["G", "G", "G"],
    },
    alg: "F R U R' U' F'",
  },
  {
    name: "L-Shape",
    diagram: {
      top: ["G", "G", "G", "G", "Y", "Y", "G", "Y", "G"],
      back: ["G", "Y", "G"],
      front: ["G", "G", "G"],
      left: ["G", "Y", "G"],
      right: ["G", "G", "G"],
    },
    alg: "f R U R' U' f'",
  },
];

const CORNER_ORI: OLLCase[] = [
  {
    name: "Antisune",
    diagram: {
      top: ["G", "Y", "Y", "Y", "Y", "Y", "G", "Y", "G"],
      back: ["G", "G", "G"],
      front: ["Y", "G", "G"],
      left: ["Y", "G", "G"],
      right: ["G", "G", "Y"],
    },
    alg: "R U2 R' U' R U' R'",
  },
  {
    name: "Sune",
    diagram: {
      top: ["G", "Y", "G", "Y", "Y", "Y", "Y", "Y", "G"],
      back: ["Y", "G", "G"],
      front: ["G", "G", "Y"],
      left: ["G", "G", "G"],
      right: ["Y", "G", "G"],
    },
    alg: "R U R' U R U2 R'",
  },
  {
    name: "H",
    diagram: {
      top: ["G", "Y", "G", "Y", "Y", "Y", "G", "Y", "G"],
      back: ["G", "G", "G"],
      front: ["G", "G", "G"],
      left: ["Y", "G", "Y"],
      right: ["Y", "G", "Y"],
    },
    alg: "R U R' U R U' R' U R U2 R'",
  },
  {
    name: "L",
    diagram: {
      top: ["Y", "Y", "G", "Y", "Y", "Y", "G", "Y", "Y"],
      back: ["G", "G", "G"],
      front: ["Y", "G", "G"],
      left: ["G", "G", "G"],
      right: ["Y", "G", "G"],
    },
    alg: "F R' F' r U R U' r'",
  },
  {
    name: "Pi",
    diagram: {
      top: ["G", "Y", "G", "Y", "Y", "Y", "G", "Y", "G"],
      back: ["G", "G", "Y"],
      front: ["G", "G", "Y"],
      left: ["Y", "G", "Y"],
      right: ["G", "G", "G"],
    },
    alg: "R U2 R2 U' R2 U' R2 U2 R",
  },
  {
    name: "T",
    diagram: {
      top: ["G", "Y", "Y", "Y", "Y", "Y", "G", "Y", "Y"],
      back: ["Y", "G", "G"],
      front: ["Y", "G", "G"],
      left: ["G", "G", "G"],
      right: ["G", "G", "G"],
    },
    alg: "r U R' U' r' F R F'",
  },
  {
    name: "U",
    diagram: {
      top: ["Y", "Y", "Y", "Y", "Y", "Y", "G", "Y", "G"],
      back: ["G", "G", "G"],
      front: ["Y", "G", "Y"],
      left: ["G", "G", "G"],
      right: ["G", "G", "G"],
    },
    alg: "R2 D R' U2 R D' R' U2 R'",
  },
];

// ── Card & Section (2-Look OLL) ───────────────────────────────────────────────

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

function Section({ title, cases }: { title: string; cases: OLLCase[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-heading text-[9px] text-zinc-700">
          {cases.length} {cases.length === 1 ? "CASE" : "CASES"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cases.map((c) => (
          <CaseCard key={c.name} c={c} />
        ))}
      </div>
    </div>
  );
}

// ── PLL Types & Colors ────────────────────────────────────────────────────────

type PColor = "Y" | "R" | "G" | "O" | "B";

const PLL_COLORS: Record<PColor, string> = {
  Y: "#FFD500",
  R: "#C41E3A",
  G: "#009B48",
  O: "#FF5800",
  B: "#0051A2",
};

interface PLLDiagramProps {
  top: [PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor];
  back: [PColor, PColor, PColor];
  front: [PColor, PColor, PColor];
  left: [PColor, PColor, PColor];
  right: [PColor, PColor, PColor];
}

interface PLLCase {
  name: string;
  diagram: PLLDiagramProps;
  alg: string;
}

function psty(c: PColor): React.CSSProperties {
  return { backgroundColor: PLL_COLORS[c], borderRadius: 2 };
}

export function PLLCaseDiagram({ top, back, front, left, right }: PLLDiagramProps) {
  const cell = 28;
  const side = 10;
  const gap = 2;

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gridTemplateRows: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`,
        gap,
      }}
    >
      <div />
      <div style={psty(back[0])} />
      <div style={psty(back[1])} />
      <div style={psty(back[2])} />
      <div />
      <div style={psty(left[0])} />
      <div style={psty(top[0])} />
      <div style={psty(top[1])} />
      <div style={psty(top[2])} />
      <div style={psty(right[0])} />
      <div style={psty(left[1])} />
      <div style={psty(top[3])} />
      <div style={psty(top[4])} />
      <div style={psty(top[5])} />
      <div style={psty(right[1])} />
      <div style={psty(left[2])} />
      <div style={psty(top[6])} />
      <div style={psty(top[7])} />
      <div style={psty(top[8])} />
      <div style={psty(right[2])} />
      <div />
      <div style={psty(front[0])} />
      <div style={psty(front[1])} />
      <div style={psty(front[2])} />
      <div />
    </div>
  );
}

// ── PLL Case Data (2-Look) ────────────────────────────────────────────────────

const TOP_ALL_Y: PLLDiagramProps["top"] = [
  "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y",
];

const CORNER_PERM: PLLCase[] = [
  {
    name: "T-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["B", "B", "R"],
      back: ["G", "G", "R"],
      left: ["O", "R", "O"],
      right: ["B", "O", "G"],
    },
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
  },
  {
    name: "Y-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["R", "R", "O"],
      back: ["R", "B", "O"],
      left: ["G", "O", "B"],
      right: ["B", "G", "G"],
    },
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  },
];

const EDGE_PERM: PLLCase[] = [
  {
    name: "Ua-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["B", "R", "B"],
      back: ["G", "G", "G"],
      left: ["O", "B", "O"],
      right: ["R", "O", "R"],
    },
    alg: "R U' R U R U R U' R' U' R2",
  },
  {
    name: "Ub-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["B", "O", "B"],
      back: ["G", "G", "G"],
      left: ["O", "R", "O"],
      right: ["R", "B", "R"],
    },
    alg: "R2 U R U R' U' R' U' R' U R'",
  },
  {
    name: "H-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["R", "O", "R"],
      back: ["O", "R", "O"],
      left: ["B", "G", "B"],
      right: ["G", "B", "G"],
    },
    alg: "M2 U M2 U2 M2 U M2",
  },
  {
    name: "Z-Perm",
    diagram: {
      top: TOP_ALL_Y,
      front: ["R", "B", "R"],
      back: ["O", "G", "O"],
      left: ["B", "R", "B"],
      right: ["G", "O", "G"],
    },
    alg: "M2 U M2 U M' U2 M2 U2 M'",
  },
];

// ── Card & Section (2-Look PLL) ───────────────────────────────────────────────

function PLLCaseCard({ c }: { c: PLLCase }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] p-5">
      <p className="font-heading text-white text-[11px] leading-snug text-center">
        {c.name}
      </p>
      <div className="rounded-lg bg-[#13131f] border border-zinc-800 p-3 flex items-center justify-center">
        <PLLCaseDiagram {...c.diagram} />
      </div>
      <p className="font-mono text-[#FFD700] text-xs tracking-wide text-center leading-relaxed">
        {c.alg}
      </p>
    </div>
  );
}

function PLLSection({ title, cases }: { title: string; cases: PLLCase[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-heading text-[9px] text-zinc-700">
          {cases.length} {cases.length === 1 ? "CASE" : "CASES"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cases.map((c) => (
          <PLLCaseCard key={c.name} c={c} />
        ))}
      </div>
    </div>
  );
}

// ── Full OLL Components ───────────────────────────────────────────────────────

function FullOLLCard({ c }: { c: FullOLLCase }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] p-5">
      <div className="text-center">
        <p className="font-heading text-zinc-500 text-[9px] tracking-widest">
          OLL {c.id}
        </p>
        <p className="font-heading text-white text-[11px] leading-snug mt-0.5">
          {c.name}
        </p>
      </div>
      <div className="rounded-lg bg-[#13131f] border border-zinc-800 p-3 flex items-center justify-center">
        <CaseDiagram
          top={c.top}
          back={c.back}
          front={c.front}
          left={c.left}
          right={c.right}
        />
      </div>
      <p className="font-mono text-[#FFD700] text-xs tracking-wide text-center leading-relaxed">
        {c.alg}
      </p>
    </div>
  );
}

function FullOLLSection({ title, cases }: { title: string; cases: FullOLLCase[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-heading text-[9px] text-zinc-700">
          {cases.length} {cases.length === 1 ? "CASE" : "CASES"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cases.map((c) => (
          <FullOLLCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

// ── Full PLL Components ───────────────────────────────────────────────────────

function FullPLLCard({ c }: { c: FullPLLCase }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] p-5">
      <p className="font-heading text-white text-[11px] leading-snug text-center">
        {c.name}
      </p>
      <div className="rounded-lg bg-[#13131f] border border-zinc-800 p-3 flex items-center justify-center">
        <PLLCaseDiagram
          top={TOP_ALL_Y}
          back={c.back as [PColor, PColor, PColor]}
          front={c.front as [PColor, PColor, PColor]}
          left={c.left as [PColor, PColor, PColor]}
          right={c.right as [PColor, PColor, PColor]}
        />
      </div>
      <p className="font-mono text-[#FFD700] text-xs tracking-wide text-center leading-relaxed">
        {c.alg}
      </p>
    </div>
  );
}

function FullPLLSection({ title, cases }: { title: string; cases: FullPLLCase[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
        <span className="font-heading text-[9px] text-zinc-700">
          {cases.length} {cases.length === 1 ? "CASE" : "CASES"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cases.map((c) => (
          <FullPLLCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupBy<T>(arr: T[], key: keyof T): [string, T[]][] {
  const map = new Map<string, T[]>();
  for (const item of arr) {
    const k = String(item[key]);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(item);
  }
  return Array.from(map.entries());
}

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "oll",      label: "2-Look OLL" },
  { id: "pll",      label: "2-Look PLL" },
  { id: "full-oll", label: "Full OLL"   },
  { id: "full-pll", label: "Full PLL"   },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Algorithms() {
  const [tab, setTab] = useState<Tab>("oll");

  const ollGroups = groupBy(OLL_CASES, "group");
  const pllGroups = groupBy(PLL_CASES, "group");

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
          {tab === "oll" && "2-Look OLL — 10 cases to orient the last layer in two steps."}
          {tab === "full-oll" && "Full OLL — all 57 orientation cases."}
          {tab === "pll" && "2-Look PLL — 6 cases to permute the last layer in two steps."}
          {tab === "full-pll" && "Full PLL — all 21 permutation cases."}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-md text-sm transition-colors cursor-pointer ${
              tab === t.id
                ? "font-bold text-[#C41E3A]"
                : "font-medium text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 2-Look OLL */}
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

      {/* Full OLL */}
      {tab === "full-oll" && (
        <div className="flex flex-col gap-12">
          {ollGroups.map(([group, cases]) => (
            <FullOLLSection key={group} title={group} cases={cases} />
          ))}
        </div>
      )}

      {/* 2-Look PLL */}
      {tab === "pll" && (
        <div className="flex flex-col gap-12">
          <PLLSection title="Corner Permutation" cases={CORNER_PERM} />
          <PLLSection title="Edge Permutation" cases={EDGE_PERM} />
        </div>
      )}

      {/* Full PLL */}
      {tab === "full-pll" && (
        <div className="flex flex-col gap-12">
          {pllGroups.map(([group, cases]) => (
            <FullPLLSection key={group} title={group} cases={cases} />
          ))}
        </div>
      )}
    </div>
  );
}
