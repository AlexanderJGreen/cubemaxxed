"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Tab = "timer" | "trainer" | "free";

const tabs: { id: Tab; label: string }[] = [
  { id: "timer", label: "Timer" },
  { id: "trainer", label: "Algorithm Trainer" },
  { id: "free", label: "Free Practice" },
];

export default function Playground() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Page heading */}
      <h1 className="font-heading text-sm text-[#FFD500] mb-1">Playground</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Practice on your own terms. Timer and trainer sessions still earn XP.
      </p>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#FFD500] text-black"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "timer" && <Timer />}
      {activeTab === "trainer" && <AlgorithmTrainer />}
      {activeTab === "free" && <FreePracticePlaceholder />}
    </div>
  );
}

const SAMPLE_SCRAMBLE = "R U R' F' L2 D B2 U' R2 F L' U2 B' R D2 F2 L B U' R'";

type Solve = {
  id: number;
  time: number; // ms
  scramble: string;
};

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function calcAverage(solves: Solve[], n: number): string {
  if (solves.length < n) return "—";
  const last = solves.slice(-n);
  const avg = last.reduce((sum, s) => sum + s.time, 0) / n;
  return formatTime(avg);
}

function Timer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [solves, setSolves] = useState<Solve[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  // Track which scramble was active when the timer started
  const activeScrambleRef = useRef(SAMPLE_SCRAMBLE);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    // Always start fresh from zero
    setElapsed(0);
    startTimeRef.current = Date.now();
    activeScrambleRef.current = SAMPLE_SCRAMBLE;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const finalTime = startTimeRef.current !== null ? Date.now() - startTimeRef.current : 0;
    setElapsed(finalTime);
    setRunning(false);
    if (finalTime > 0) {
      setSolves((prev) => [
        ...prev,
        { id: prev.length + 1, time: finalTime, scramble: activeScrambleRef.current },
      ]);
    }
  }, []);

  const toggle = useCallback(() => {
    if (running) {
      stop();
    } else {
      start();
    }
  }, [running, start, stop]);

  // Spacebar handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ao5 = calcAverage(solves, 5);
  const ao12 = calcAverage(solves, 12);

  return (
    <div className="space-y-4">
      {/* Timer card */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
        {/* Scramble */}
        <div className="border-b border-zinc-800 px-8 py-5 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Scramble</p>
          <p className="font-mono text-zinc-200 text-lg tracking-wide">{SAMPLE_SCRAMBLE}</p>
        </div>

        {/* Timer display — click to start/stop */}
        <button
          onClick={toggle}
          className="w-full py-20 flex flex-col items-center gap-6 focus:outline-none cursor-pointer group"
        >
          <span
            className={`font-mono text-8xl font-bold tabular-nums transition-colors ${
              running ? "text-[#FFD500]" : elapsed > 0 ? "text-white" : "text-zinc-600"
            }`}
          >
            {formatTime(elapsed)}
          </span>

          <span className="text-zinc-600 text-sm group-hover:text-zinc-400 transition-colors">
            {running ? "click or press space to stop" : "click or press space to start"}
          </span>
        </button>
      </div>

      {/* Session stats */}
      {solves.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Solves" value={String(solves.length)} />
            <StatCard label="ao5" value={ao5} />
            <StatCard label="ao12" value={ao12} />
          </div>

          {/* Solve history */}
          <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
            <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Session History</p>
              <button
                onClick={() => setSolves([])}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {[...solves].reverse().map((solve) => (
                <div key={solve.id} className="px-6 py-3 flex items-center gap-4">
                  <span className="text-xs text-zinc-600 w-6 text-right shrink-0">
                    {solve.id}
                  </span>
                  <span className="font-mono text-white text-sm w-20 shrink-0">
                    {formatTime(solve.time)}
                  </span>
                  <span className="font-mono text-zinc-600 text-xs truncate">
                    {solve.scramble}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] px-6 py-4 text-center">
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-mono text-lg font-bold ${value === "—" ? "text-zinc-700" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Algorithm Trainer ───────────────────────────────────────────────────────

type Algorithm = {
  name: string;       // e.g. "T-Perm"
  notation: string;   // move sequence
  // ASCII art rows representing the top-face sticker pattern (3×3 grid, U-face)
  // Each char: W=white Y=yellow R=red B=blue G=green O=orange
  faceColors: string[]; // 9 chars, row by row
};

type Category = "OLL" | "PLL";

const ALGORITHMS: Record<Category, Algorithm[]> = {
  OLL: [
    {
      name: "Sune",
      notation: "R U R' U R U2 R'",
      faceColors: ["Y","Y","Y", "W","Y","Y", "W","W","Y"],
    },
    {
      name: "Anti-Sune",
      notation: "R' U' R U' R' U2 R",
      faceColors: ["Y","W","W", "Y","Y","W", "Y","Y","Y"],
    },
    {
      name: "H-OLL",
      notation: "F R U R' U' F' f R U R' U' f'",
      faceColors: ["W","Y","W", "Y","Y","Y", "W","Y","W"],
    },
    {
      name: "Pi-OLL",
      notation: "R U2 R2 U' R2 U' R2 U2 R",
      faceColors: ["Y","W","Y", "W","Y","W", "Y","W","Y"],
    },
  ],
  PLL: [
    {
      name: "T-Perm",
      notation: "R U R' U' R' F R2 U' R' U' R U R' F'",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "U-Perm (a)",
      notation: "R U' R U R U R U' R' U' R2",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "U-Perm (b)",
      notation: "R2 U R U R' U' R' U' R' U R'",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
    {
      name: "Z-Perm",
      notation: "M2 U M2 U M' U2 M2 U2 M' U2",
      faceColors: ["Y","Y","Y", "Y","Y","Y", "Y","Y","Y"],
    },
  ],
};

const COLOR_MAP: Record<string, string> = {
  Y: "#FFD500",
  W: "#ffffff",
  R: "#C41E3A",
  B: "#0051A2",
  G: "#009B48",
  O: "#FF5800",
};

function CubeFacePreview({ colors }: { colors: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-36 h-36">
      {colors.map((c, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{ backgroundColor: COLOR_MAP[c] ?? "#3f3f46" }}
        />
      ))}
    </div>
  );
}

function AlgorithmTrainer() {
  const [category, setCategory] = useState<Category>("OLL");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const algs = ALGORITHMS[category];
  const current = algs[index];

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    setIndex(0);
    setRevealed(false);
  }

  function handleNext() {
    setIndex((i) => (i + 1) % algs.length);
    setRevealed(false);
  }

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] px-6 py-4 flex items-center gap-4">
        <span className="text-xs text-zinc-500 uppercase tracking-widest shrink-0">Category</span>
        <div className="flex gap-1">
          {(["OLL", "PLL"] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                category === cat
                  ? "bg-[#FFD500] text-black"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-zinc-600">
          {index + 1} / {algs.length}
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
        {/* Algorithm name */}
        <div className="border-b border-zinc-800 px-8 py-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{category}</p>
          <h2 className="font-heading text-xs text-white">{current.name}</h2>
        </div>

        {/* Cube face preview */}
        <div className="flex flex-col items-center gap-6 py-12 px-8">
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#13131f]">
            <CubeFacePreview colors={current.faceColors} />
          </div>

          {/* Solution reveal */}
          <div className="text-center min-h-[3rem] flex items-center justify-center">
            {revealed ? (
              <p className="font-mono text-[#FFD500] text-lg tracking-wide">
                {current.notation}
              </p>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="px-6 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Show Solution
              </button>
            )}
          </div>
        </div>

        {/* Next button */}
        <div className="border-t border-zinc-800 px-8 py-4 flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function FreePracticePlaceholder() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] p-12 text-center">
      <div className="text-4xl mb-4">🎮</div>
      <h2 className="font-heading text-xs text-zinc-300 mb-3">Free Practice</h2>
      <p className="text-zinc-500 text-sm">
        Interactive 3D cube. No scoring, no XP — just turn and experiment.
      </p>
    </div>
  );
}
