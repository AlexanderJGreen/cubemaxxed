"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = "OLL" | "PLL";

type Algorithm = {
  name: string;
  step: string;
  notation: string;
  recognition: string;
  // 9-char top-face grid, row by row (TL→TR, ML→MR, BL→BR)
  // Y = yellow (oriented/solved), G = grey (unoriented/unsolved)
  topFace: string[];
};

// ── Case Diagram ───────────────────────────────────────────────────────────────
//
// Renders the classic OLL "plan view" — the 3×3 top face with a 1-cell-wide
// strip of side stickers visible on all four sides, just like the reference
// image. Edge side stickers are derived from top-face orientation (grey on top
// → yellow on side, yellow on top → grey on side). Corner side stickers are
// kept grey because the twist direction isn't stored in topFace.

function CaseDiagram({ topFace, size }: { topFace: string[]; size: number }) {
  // size = total width/height including side strips
  const gap      = Math.max(1, Math.floor(size / 60));
  const cell     = Math.floor((size - gap * 4) / 5);
  const r        = Math.max(2, Math.round(cell / 6));
  const step     = cell + gap;
  const faceSize = 3 * cell + 2 * gap;

  // Top face: full brightness. Side strips: dimmed to suggest depth.
  const topCol  = (c: string) => (c === "Y" ? "#FFD500" : "#2a2a2a");
  const sideCol = (c: string) => (c === "Y" ? "#a07800" : "#181818");

  const es = (pos: number) => (topFace[pos] === "Y" ? "G" : "Y");
  const back  = ["G", es(1), "G"];
  const front = ["G", es(7), "G"];
  const left  = ["G", es(3), "G"];
  const right = ["G", es(5), "G"];

  const total = cell * 5 + gap * 4;
  const p     = cell * 5; // perspective distance — tight = dramatic angle

  // Strip wrapper styles: CSS 3D perspective hinge at the shared edge with the face
  const backStyle: React.CSSProperties = {
    position: "absolute",
    left: step, top: step - cell,
    width: faceSize, height: cell,
    display: "grid",
    gridTemplateColumns: `repeat(3, ${cell}px)`,
    gap,
    transformOrigin: "bottom center",
    transform: `perspective(${p}px) rotateX(52deg)`,
  };
  const frontStyle: React.CSSProperties = {
    position: "absolute",
    left: step, top: step + faceSize,
    width: faceSize, height: cell,
    display: "grid",
    gridTemplateColumns: `repeat(3, ${cell}px)`,
    gap,
    transformOrigin: "top center",
    transform: `perspective(${p}px) rotateX(-52deg)`,
  };
  const leftStyle: React.CSSProperties = {
    position: "absolute",
    left: step - cell, top: step,
    width: cell, height: faceSize,
    display: "grid",
    gridTemplateRows: `repeat(3, ${cell}px)`,
    gap,
    transformOrigin: "right center",
    transform: `perspective(${p}px) rotateY(-52deg)`,
  };
  const rightStyle: React.CSSProperties = {
    position: "absolute",
    left: step + faceSize, top: step,
    width: cell, height: faceSize,
    display: "grid",
    gridTemplateRows: `repeat(3, ${cell}px)`,
    gap,
    transformOrigin: "left center",
    transform: `perspective(${p}px) rotateY(52deg)`,
  };

  return (
    <div style={{ position: "relative", width: total, height: total, flexShrink: 0 }}>
      {/* Side strips — angled away from top face */}
      <div style={backStyle}>
        {back.map((c, i) => (
          <div key={i} style={{ backgroundColor: sideCol(c), borderRadius: r }} />
        ))}
      </div>
      <div style={frontStyle}>
        {front.map((c, i) => (
          <div key={i} style={{ backgroundColor: sideCol(c), borderRadius: r }} />
        ))}
      </div>
      <div style={leftStyle}>
        {left.map((c, i) => (
          <div key={i} style={{ backgroundColor: sideCol(c), borderRadius: r }} />
        ))}
      </div>
      <div style={rightStyle}>
        {right.map((c, i) => (
          <div key={i} style={{ backgroundColor: sideCol(c), borderRadius: r }} />
        ))}
      </div>

      {/* Top face (3×3) — rendered last so it sits on top visually */}
      <div
        style={{
          position: "absolute",
          left: step, top: step,
          display: "grid",
          gridTemplateColumns: `repeat(3, ${cell}px)`,
          gridTemplateRows: `repeat(3, ${cell}px)`,
          gap,
        }}
      >
        {topFace.map((c, i) => (
          <div key={i} style={{ backgroundColor: topCol(c), borderRadius: r }} />
        ))}
      </div>
    </div>
  );
}

// ── Algorithm data ─────────────────────────────────────────────────────────────
//
// Top-face grid layout (viewed from above, front face at bottom):
//
//   [0][1][2]   TL  TC  TR
//   [3][4][5]   ML  MC  MR
//   [6][7][8]   BL  BC  BR
//
// Corners: 0=BL(FL), 2=BR(FR), 6=TL(BL), 8=TR(BR)  ← standard cube orientation
// Edges:   1=TC(B), 3=ML(L), 5=MR(R), 7=BC(F)
// Center:  4 (always Y for OLL/PLL)

const ALGORITHMS: Record<Category, Algorithm[]> = {
  OLL: [
    // ── Step 1: Edge Orientation (EOLL) — 3 cases ──
    {
      name: "Dot",
      step: "Edge Orientation",
      notation: "F (R U R' U') F' f (R U R' U') f'",
      recognition:
        "No yellow edges on top face — only the center sticker is yellow. All four edges point sideways.",
      topFace: ["G","G","G","G","Y","G","G","G","G"],
    },
    {
      name: "L-Shape",
      step: "Edge Orientation",
      notation: "F (R U R' U') F'",
      recognition:
        "Two adjacent yellow edges on top forming an L. Hold the cube so the L sits in the back-left corner (oriented edges point toward back and left), then execute.",
      topFace: ["G","Y","G","Y","Y","G","G","G","G"],
    },
    {
      name: "Line",
      step: "Edge Orientation",
      notation: "f (R U R' U') f'",
      recognition:
        "Two opposite yellow edges on top forming a straight line. Hold the line horizontally (left to right, not front to back), then execute.",
      topFace: ["G","G","G","Y","Y","Y","G","G","G"],
    },
    // ── Step 2: Corner Orientation (OCLL) — 7 cases ──
    // Cross is done, so edges 1,3,5,7 are always Y.
    {
      name: "Sune",
      step: "Corner Orientation",
      notation: "R U R' U R U2 R'",
      recognition:
        "One yellow corner on top. Hold the solved corner at front-left — you'll see a fish shape on the U face. Two yellow stickers visible on the front face, one on the right.",
      topFace: ["Y","Y","G","Y","Y","Y","G","Y","G"],
    },
    {
      name: "Anti-Sune",
      step: "Corner Orientation",
      notation: "R U2 R' U' R U' R'",
      recognition:
        "One yellow corner on top — mirror of Sune. Hold the solved corner at front-right. Two yellow stickers visible on the right face, one on the front.",
      topFace: ["G","Y","G","Y","Y","Y","G","Y","Y"],
    },
    {
      name: "H",
      step: "Corner Orientation",
      notation: "R U R' U R U' R' U R U2 R'",
      recognition:
        "No yellow corners on top. Front and back faces each show two yellow corner stickers. Left and right faces show none.",
      topFace: ["G","Y","G","Y","Y","Y","G","Y","G"],
    },
    {
      name: "Pi",
      step: "Corner Orientation",
      notation: "R U2 R2' U' R2 U' R2' U2 R",
      recognition:
        "No yellow corners on top. One side shows two yellow corner stickers, the opposite shows two more — forming a π shape. Differs from H by which sides show yellow.",
      topFace: ["G","Y","G","Y","Y","Y","G","Y","G"],
    },
    {
      name: "Headlights",
      step: "Corner Orientation",
      notation: "R2 D R' U2 R D' R' U2 R'",
      recognition:
        "Two yellow corners on top (diagonally opposite). One side face shows two yellow stickers side by side — the headlights. Hold the headlights facing you.",
      topFace: ["Y","Y","G","Y","Y","Y","G","Y","Y"],
    },
    {
      name: "Chameleon",
      step: "Corner Orientation",
      notation: "r U R' U' r' F R F'",
      recognition:
        "Two adjacent yellow corners on top (left side). The two unsolved corners have yellow stickers pointing in different directions — one left, one front.",
      topFace: ["Y","Y","G","Y","Y","Y","Y","Y","G"],
    },
    {
      name: "Blinker",
      step: "Corner Orientation",
      notation: "F' r U R' U' r' F R",
      recognition:
        "Two adjacent yellow corners on top (right side). Differs from Chameleon — the two unsolved corners both have their yellow stickers facing the same side.",
      topFace: ["G","Y","Y","Y","Y","Y","G","Y","Y"],
    },
  ],
  PLL: [
    // All top stickers are yellow (OLL is complete).
    // Recognition comes from the side sticker patterns described in the text.
    // ── Step 1: Corner Permutation (CPLL) — 2 cases ──
    {
      name: "T-Perm",
      step: "Corner Permutation",
      notation: "R U R' U' R' F R2 U' R' U' R U R' F'",
      recognition:
        "Find the side with headlights (two matching corner stickers) and hold it on the LEFT. Swaps two adjacent corners and two opposite edges.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
    {
      name: "Y-Perm",
      step: "Corner Permutation",
      notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
      recognition:
        "No headlights on any side — no two adjacent corner stickers match anywhere. Swaps two diagonal corners. Hold in any direction.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
    // ── Step 2: Edge Permutation (EPLL) — 4 cases ──
    {
      name: "Ua-Perm",
      step: "Edge Permutation",
      notation: "R U' R U R U R U' R' U' R2",
      recognition:
        "One fully solved bar (all top-layer stickers match) on one side. Hold that bar at the BACK. Edges cycle clockwise.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
    {
      name: "Ub-Perm",
      step: "Edge Permutation",
      notation: "R2 U R U R' U' R' U' R' U R'",
      recognition:
        "One fully solved bar at the BACK — same recognition as Ua, but edges cycle counter-clockwise instead.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
    {
      name: "H-Perm",
      step: "Edge Permutation",
      notation: "M2 U M2 U2 M2 U M2",
      recognition:
        "No solved bar anywhere. All four sides show a checkerboard-like pattern on the top layer — opposite side colors match. Execute from any angle.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
    {
      name: "Z-Perm",
      step: "Edge Permutation",
      notation: "M2 U M2 U M' U2 M2 U2 M' U2",
      recognition:
        "No solved bar, but two adjacent sides each have one matching edge sticker. Hold so the two correctly-colored front-face edge stickers are on the left and right.",
      topFace: ["Y","Y","Y","Y","Y","Y","Y","Y","Y"],
    },
  ],
};

// ── Card ──────────────────────────────────────────────────────────────────────

function AlgorithmCard({
  alg,
  onClick,
}: {
  alg: Algorithm;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-zinc-800 bg-[#0a0a11] p-5 flex flex-col gap-4 hover:border-zinc-500 hover:bg-[#0f0f1a] transition-all text-left cursor-pointer group"
    >
      {/* Visual */}
      <div className="flex justify-center">
        <div
          className="rounded-lg bg-[#13131f] border border-zinc-800 group-hover:border-zinc-700 transition-colors flex items-center justify-center"
          style={{ width: 112, height: 112 }}
        >
          <CaseDiagram topFace={alg.topFace} size={96} />
        </div>
      </div>

      {/* Name + step + notation */}
      <div className="flex flex-col gap-1.5 text-center">
        <p className="text-white text-sm font-medium">{alg.name}</p>
        <p className="font-heading text-[7px] text-zinc-600 tracking-widest">
          {alg.step.toUpperCase()}
        </p>
        <p className="font-mono text-zinc-500 text-xs leading-relaxed break-all">
          {alg.notation}
        </p>
      </div>
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function AlgorithmModal({
  alg,
  category,
  onClose,
}: {
  alg: Algorithm;
  category: Category;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-[#0d0d14] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#FFD500]/10 text-[#FFD500] border border-[#FFD500]/20">
              {category}
            </span>
            <span className="text-xs text-zinc-500">{alg.step}</span>
            <h2 className="text-white font-medium">{alg.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Diagram */}
          <div className="rounded-xl border border-zinc-800 bg-[#13131f] flex items-center justify-center py-8">
            <CaseDiagram topFace={alg.topFace} size={180} />
          </div>

          {/* Notation */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
              Algorithm
            </p>
            <div className="rounded-lg bg-[#13131f] border border-zinc-800 px-4 py-3">
              <p className="font-mono text-[#FFD500] text-base tracking-wide leading-relaxed">
                {alg.notation}
              </p>
            </div>
          </div>

          {/* Recognition */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
              Recognition
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {alg.recognition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function groupByStep(algs: Algorithm[]): { step: string; algs: Algorithm[] }[] {
  const map = new Map<string, Algorithm[]>();
  for (const alg of algs) {
    if (!map.has(alg.step)) map.set(alg.step, []);
    map.get(alg.step)!.push(alg);
  }
  return Array.from(map.entries()).map(([step, algs]) => ({ step, algs }));
}

export default function Algorithms() {
  const [category, setCategory] = useState<Category>("OLL");
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const algs = ALGORITHMS[category];
  const groups = groupByStep(algs);

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
          2-Look OLL and PLL reference catalog. Click any card for details.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-10">
        {(["OLL", "PLL"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSelected(null);
            }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              category === cat
                ? "bg-[#FFD500] text-black"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped sections */}
      <div className="flex flex-col gap-12">
        {groups.map(({ step, algs: stepAlgs }) => (
          <div key={step}>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <span className="font-heading text-[8px] text-zinc-600 tracking-widest">
                  {category} · {step.toUpperCase()}
                </span>
                <span className="font-sans text-xs text-zinc-700">
                  {stepAlgs.length}{" "}
                  {stepAlgs.length === 1 ? "case" : "cases"}
                </span>
              </div>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {stepAlgs.map((alg) => (
                <AlgorithmCard
                  key={alg.name}
                  alg={alg}
                  onClick={() => setSelected(alg)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <AlgorithmModal
          alg={selected}
          category={category}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
