"use client";

import { useState } from "react";

type Category = "OLL" | "PLL";

type Algorithm = {
  name: string;
  notation: string;
  description: string;
  // U-face sticker grid, 9 chars. Y=yellow, W=white, R=red, B=blue, G=green, O=orange
  faceColors: string[];
};

const COLOR_MAP: Record<string, string> = {
  Y: "#FFD500",
  W: "#ffffff",
  R: "#C41E3A",
  B: "#0051A2",
  G: "#009B48",
  O: "#FF5800",
};

const ALGORITHMS: Record<Category, Algorithm[]> = {
  OLL: [
    {
      name: "Sune",
      notation: "R U R' U R U2 R'",
      description:
        "One of the most common OLL cases. Appears when you have a headlights pattern on the right side — one yellow corner facing you on the top-left. Recognizable by the L-shape of yellow stickers in the top-left corner of the U face.",
      faceColors: ["Y","Y","Y", "W","Y","Y", "W","W","Y"],
    },
    {
      name: "Anti-Sune",
      notation: "R' U' R U' R' U2 R",
      description:
        "The mirror of Sune. Appears when the headlights are on the left side — one yellow corner facing you on the top-right. You can also recognize it as Sune rotated 180°.",
      faceColors: ["Y","W","W", "Y","Y","W", "Y","Y","Y"],
    },
    {
      name: "H-OLL",
      notation: "F R U R' U' F' f R U R' U' f'",
      description:
        "Also called the 'X' case. Occurs when all four corners are oriented correctly (yellow on top) but all four edges are flipped — leaving a dot in the center with four yellow edges pointing sideways.",
      faceColors: ["W","Y","W", "Y","Y","Y", "W","Y","W"],
    },
    {
      name: "Pi-OLL",
      notation: "R U2 R2 U' R2 U' R2 U2 R",
      description:
        "Named for its resemblance to the Greek letter π. Occurs when all four corners are flipped wrong and there are two opposite yellow edges on top. Often encountered early in OLL recognition practice.",
      faceColors: ["Y","W","Y", "W","Y","W", "Y","W","Y"],
    },
    {
      name: "Dot",
      notation: "F R U R' U' F' f R U R' U' S' U2 S",
      description:
        "The hardest OLL case — only the center sticker is yellow on top. All four edges and all four corners need to be oriented. Relatively rare in solves, but important to know for completeness.",
      faceColors: ["W","W","W", "W","Y","W", "W","W","W"],
    },
  ],
  PLL: [
    {
      name: "T-Perm",
      notation: "R U R' U' R' F R2 U' R' U' R U R' F'",
      description:
        "One of the most frequently occurring PLL cases. Swaps two adjacent corners and two opposite edges simultaneously. Recognized by two headlights on the front face and two matching stickers on the back.",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "U-Perm (a)",
      notation: "R U' R U R U R U' R' U' R2",
      description:
        "Cycles three edges clockwise. Recognized when three of the four side colors are in a row on one face and the fourth face has a 'bar' of matching stickers. The 'a' variant cycles them to the right.",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "U-Perm (b)",
      notation: "R2 U R U R' U' R' U' R' U R'",
      description:
        "Cycles three edges counter-clockwise — the mirror of U-Perm (a). Same recognition, opposite cycle direction. Together, Ua and Ub are two of the most common PLL cases you'll encounter.",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "Z-Perm",
      notation: "M2 U M2 U M' U2 M2 U2 M' U2",
      description:
        "Swaps two pairs of opposite edges — the UF/UB pair and the UL/UR pair. Recognized by an alternating checkerboard-like pattern on all four side faces. Uses only M and U moves.",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "H-Perm",
      notation: "M2 U M2 U2 M2 U M2",
      description:
        "Swaps all four edges — UF swaps with UB, and UL swaps with UR simultaneously. Recognized by opposite side colors matching on all four faces. Short and elegant, using only M and U moves.",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
  ],
};

function CubeFacePreview({ colors, size = "sm" }: { colors: string[]; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "w-28 h-28" : "w-14 h-14";
  const gap = size === "lg" ? "gap-1" : "gap-[3px]";
  const radius = size === "lg" ? "rounded-sm" : "rounded-[2px]";
  return (
    <div className={`grid grid-cols-3 ${gap} ${dim}`}>
      {colors.map((c, i) => (
        <div
          key={i}
          className={radius}
          style={{ backgroundColor: COLOR_MAP[c] ?? "#3f3f46" }}
        />
      ))}
    </div>
  );
}

function AlgorithmCard({ alg, onClick }: { alg: Algorithm; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-zinc-800 bg-[#0a0a11] p-5 flex flex-col gap-4 hover:border-zinc-500 hover:bg-[#0f0f1a] transition-all text-left cursor-pointer group"
    >
      {/* Face preview */}
      <div className="flex justify-center">
        <div className="p-3 rounded-lg bg-[#13131f] border border-zinc-800 group-hover:border-zinc-700 transition-colors">
          <CubeFacePreview colors={alg.faceColors} />
        </div>
      </div>

      {/* Name + notation */}
      <div className="text-center space-y-1">
        <p className="text-white text-sm font-medium">{alg.name}</p>
        <p className="font-mono text-zinc-500 text-xs leading-relaxed break-all">
          {alg.notation}
        </p>
      </div>
    </button>
  );
}

function AlgorithmModal({ alg, category, onClose }: { alg: Algorithm; category: Category; onClose: () => void }) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel — stop click from closing when clicking inside */}
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
          {/* 3D animation placeholder */}
          <div className="rounded-xl border border-dashed border-zinc-700 bg-[#13131f] h-48 flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-lg bg-[#0d0d14] border border-zinc-800">
              <CubeFacePreview colors={alg.faceColors} size="lg" />
            </div>
            <p className="text-zinc-600 text-xs mt-2">3D animation coming soon</p>
          </div>

          {/* Notation */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Algorithm</p>
            <div className="rounded-lg bg-[#13131f] border border-zinc-800 px-4 py-3">
              <p className="font-mono text-[#FFD500] text-base tracking-wide leading-relaxed">
                {alg.notation}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">When to use it</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{alg.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Algorithms() {
  const [category, setCategory] = useState<Category>("OLL");
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const algs = ALGORITHMS[category];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Page heading */}
      <h1 className="font-heading text-sm text-[#FFD500] mb-1">Algorithms</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Reference catalog for OLL and PLL cases. Click any card for details.
      </p>

      {/* Category tabs */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-8">
        {(["OLL", "PLL"] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
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

      {/* Count */}
      <p className="text-xs text-zinc-600 mb-4">{algs.length} algorithms</p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {algs.map((alg) => (
          <AlgorithmCard key={alg.name} alg={alg} onClick={() => setSelected(alg)} />
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
