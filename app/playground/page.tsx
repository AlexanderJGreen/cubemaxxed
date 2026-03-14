"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { OLL_CASES, PLL_CASES } from "../algorithms/data";

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
  const tickRef = useRef<FrameRequestCallback>(() => {});
  // Track which scramble was active when the timer started
  const activeScrambleRef = useRef(SAMPLE_SCRAMBLE);

  // Define tick inside an effect — never written during render
  useEffect(() => {
    tickRef.current = () => {
      if (startTimeRef.current !== null) {
        setElapsed(Date.now() - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tickRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    // Always start fresh from zero
    setElapsed(0);
    startTimeRef.current = Date.now();
    activeScrambleRef.current = SAMPLE_SCRAMBLE;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const finalTime =
      startTimeRef.current !== null ? Date.now() - startTimeRef.current : 0;
    setElapsed(finalTime);
    setRunning(false);
    if (finalTime > 0) {
      setSolves((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          time: finalTime,
          scramble: activeScrambleRef.current,
        },
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
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
            Scramble
          </p>
          <p className="font-mono text-zinc-200 text-lg tracking-wide">
            {SAMPLE_SCRAMBLE}
          </p>
        </div>

        {/* Timer display — click to start/stop */}
        <button
          onClick={toggle}
          className="w-full py-20 flex flex-col items-center gap-6 focus:outline-none cursor-pointer group"
        >
          <span
            className={`font-mono text-8xl font-bold tabular-nums transition-colors ${
              running
                ? "text-[#FFD500]"
                : elapsed > 0
                  ? "text-white"
                  : "text-zinc-600"
            }`}
          >
            {formatTime(elapsed)}
          </span>

          <span className="text-zinc-600 text-sm group-hover:text-zinc-400 transition-colors">
            {running
              ? "click or press space to stop"
              : "click or press space to start"}
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
              <p className="text-xs text-zinc-500 uppercase tracking-widest">
                Session History
              </p>
              <button
                onClick={() => setSolves([])}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {[...solves].reverse().map((solve) => (
                <div
                  key={solve.id}
                  className="px-6 py-3 flex items-center gap-4"
                >
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
      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-bold ${value === "—" ? "text-zinc-700" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Algorithm Trainer ───────────────────────────────────────────────────────

type S = "Y" | "G";
type PColor = "Y" | "R" | "G" | "O" | "B";
type TrainerTab = "full-oll" | "full-pll";

const TRAINER_TABS: { id: TrainerTab; label: string }[] = [
  { id: "full-oll", label: "Full OLL" },
  { id: "full-pll", label: "Full PLL" },
];
const PLL_TOP_Y: [PColor,PColor,PColor,PColor,PColor,PColor,PColor,PColor,PColor] =
  ["Y","Y","Y","Y","Y","Y","Y","Y","Y"];

const Y_COL = "#FFD700";
const G_COL = "#3a3a3a";
function sty(c: S): React.CSSProperties {
  return { backgroundColor: c === "Y" ? Y_COL : G_COL, borderRadius: 2 };
}

const PLL_COLORS: Record<PColor, string> = {
  Y: "#FFD500", R: "#C41E3A", G: "#009B48", O: "#FF5800", B: "#0051A2",
};
function psty(c: PColor): React.CSSProperties {
  return { backgroundColor: PLL_COLORS[c], borderRadius: 2 };
}

interface OLLDiagram {
  top: [S, S, S, S, S, S, S, S, S];
  back: [S, S, S]; front: [S, S, S]; left: [S, S, S]; right: [S, S, S];
}
interface PLLDiagram {
  top: [PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor];
  back: [PColor, PColor, PColor]; front: [PColor, PColor, PColor];
  left: [PColor, PColor, PColor]; right: [PColor, PColor, PColor];
}

function OLLDiagramView({ top, back, front, left, right }: OLLDiagram) {
  const cell = 28, side = 10, gap = 2;
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`, gridTemplateRows: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`, gap }}>
      <div /><div style={sty(back[0])} /><div style={sty(back[1])} /><div style={sty(back[2])} /><div />
      <div style={sty(left[0])} /><div style={sty(top[0])} /><div style={sty(top[1])} /><div style={sty(top[2])} /><div style={sty(right[0])} />
      <div style={sty(left[1])} /><div style={sty(top[3])} /><div style={sty(top[4])} /><div style={sty(top[5])} /><div style={sty(right[1])} />
      <div style={sty(left[2])} /><div style={sty(top[6])} /><div style={sty(top[7])} /><div style={sty(top[8])} /><div style={sty(right[2])} />
      <div /><div style={sty(front[0])} /><div style={sty(front[1])} /><div style={sty(front[2])} /><div />
    </div>
  );
}

function PLLDiagramView({ top, back, front, left, right }: PLLDiagram) {
  const cell = 28, side = 10, gap = 2;
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`, gridTemplateRows: `${side}px ${cell}px ${cell}px ${cell}px ${side}px`, gap }}>
      <div /><div style={psty(back[0])} /><div style={psty(back[1])} /><div style={psty(back[2])} /><div />
      <div style={psty(left[0])} /><div style={psty(top[0])} /><div style={psty(top[1])} /><div style={psty(top[2])} /><div style={psty(right[0])} />
      <div style={psty(left[1])} /><div style={psty(top[3])} /><div style={psty(top[4])} /><div style={psty(top[5])} /><div style={psty(right[1])} />
      <div style={psty(left[2])} /><div style={psty(top[6])} /><div style={psty(top[7])} /><div style={psty(top[8])} /><div style={psty(right[2])} />
      <div /><div style={psty(front[0])} /><div style={psty(front[1])} /><div style={psty(front[2])} /><div />
    </div>
  );
}


function AlgorithmTrainer() {
  const [tab, setTab] = useState<TrainerTab>("2oll");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const isOLL = tab === "2oll" || tab === "full-oll";

  const algs = tab === "full-oll" ? OLL_CASES : PLL_CASES;

  const current = algs[index % algs.length];
  const tabLabel = TRAINER_TABS.find((t) => t.id === tab)!.label;

  function handleTabChange(t: TrainerTab) {
    setTab(t);
    setIndex(0);
    setRevealed(false);
  }

  function handleNext() {
    setIndex((i) => (i + 1) % algs.length);
    setRevealed(false);
  }

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] px-6 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {TRAINER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                tab === t.id
                  ? "bg-[#FFD500] text-black"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-zinc-600 shrink-0">
          {index + 1} / {algs.length}
        </span>
      </div>

      {/* Main card */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
        {/* Algorithm name */}
        <div className="border-b border-zinc-800 px-8 py-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
            {tabLabel}
          </p>
          <h2 className="font-heading text-xs text-white">{current.name}</h2>
        </div>

        {/* Diagram */}
        <div className="flex flex-col items-center gap-6 py-12 px-8">
          <div className="p-3 rounded-lg border border-zinc-800 bg-[#13131f] flex items-center justify-center">
            {isOLL ? (
              <OLLDiagramView
                top={(current as typeof OLL_CASES[0]).top}
                back={current.back as [S,S,S]}
                front={current.front as [S,S,S]}
                left={current.left as [S,S,S]}
                right={current.right as [S,S,S]}
              />
            ) : (
              <PLLDiagramView
                top={PLL_TOP_Y}
                back={current.back as [PColor,PColor,PColor]}
                front={current.front as [PColor,PColor,PColor]}
                left={current.left as [PColor,PColor,PColor]}
                right={current.right as [PColor,PColor,PColor]}
              />
            )}
          </div>

          {/* Solution reveal */}
          <div className="text-center min-h-[3rem] flex items-center justify-center">
            {revealed ? (
              <p className="font-mono text-[#FFD500] text-lg tracking-wide">
                {current.alg}
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
