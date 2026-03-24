"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { OLL_CASES, PLL_CASES } from "../algorithms/data";
import { formatTime } from "@/lib/rank";
import { saveSolve } from "./actions";
import { generateScramble } from "@/lib/scramble";

type Tab = "timer" | "trainer";

const tabs: { id: Tab; label: string }[] = [
  { id: "timer", label: "Timer" },
  { id: "trainer", label: "Algorithm Trainer" },
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
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-full sm:w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm cursor-pointer transition-colors ${
              activeTab === tab.id ? "font-bold text-white" : "font-medium text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "timer" && <Timer />}
      {activeTab === "trainer" && <AlgorithmTrainer />}
    </div>
  );
}

type Solve = {
  id: number;
  time: number; // ms
  scramble: string;
  confirmed: boolean;
};

type Pending = {
  time: number;
  scramble: string;
};

function calcAverage(solves: Solve[], n: number): string {
  const confirmed = solves.filter((s) => s.confirmed);
  if (confirmed.length < n) return "—";
  const last = confirmed.slice(-n);
  const avg = last.reduce((sum, s) => sum + s.time, 0) / n;
  return formatTime(avg);
}

function Timer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pending, setPending] = useState<Pending | null>(null);
  const [history, setHistory] = useState<Solve[]>([]);
  const [currentScramble, setCurrentScramble] = useState(() => generateScramble());
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<FrameRequestCallback>(() => {});
  const activeScrambleRef = useRef(currentScramble);

  useEffect(() => {
    tickRef.current = () => {
      if (startTimeRef.current !== null) {
        setElapsed(Date.now() - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tickRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    if (pending) return;
    setElapsed(0);
    startTimeRef.current = Date.now();
    activeScrambleRef.current = currentScramble;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, [currentScramble, pending]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const finalTime =
      startTimeRef.current !== null ? Date.now() - startTimeRef.current : 0;
    setElapsed(finalTime);
    setRunning(false);
    if (finalTime > 0) {
      setPending({ time: finalTime, scramble: activeScrambleRef.current });
    }
  }, []);

  const confirm = useCallback(() => {
    if (!pending) return;
    setHistory((prev) => [
      ...prev,
      { id: prev.length + 1, time: pending.time, scramble: pending.scramble, confirmed: true },
    ]);
    saveSolve(pending.time, pending.scramble);
    setPending(null);
    setCurrentScramble(generateScramble());
  }, [pending]);

  const discard = useCallback(() => {
    if (!pending) return;
    setHistory((prev) => [
      ...prev,
      { id: prev.length + 1, time: pending.time, scramble: pending.scramble, confirmed: false },
    ]);
    setPending(null);
    setCurrentScramble(generateScramble());
  }, [pending]);

  const toggle = useCallback(() => {
    if (pending) return;
    if (running) stop(); else start();
  }, [running, start, stop, pending]);

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

  useEffect(() => {
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const confirmedSolves = history.filter((s) => s.confirmed);
  const ao5 = calcAverage(history, 5);
  const ao12 = calcAverage(history, 12);

  return (
    <div className="space-y-4">
      {/* Timer card */}
      <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
        {/* Scramble */}
        <div className="border-b border-zinc-800 px-8 py-5 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Scramble</p>
          <p className="font-mono text-zinc-200 text-lg tracking-wide">{currentScramble}</p>
        </div>

        {/* Timer display */}
        <button
          onClick={toggle}
          disabled={!!pending}
          className="w-full py-10 sm:py-20 flex flex-col items-center gap-6 focus:outline-none cursor-pointer group disabled:cursor-default"
        >
          <span
            className={`font-mono text-5xl sm:text-8xl font-bold tabular-nums transition-colors ${
              running ? "text-[#FFD500]" : elapsed > 0 ? "text-white" : "text-zinc-600"
            }`}
          >
            {formatTime(elapsed)}
          </span>
          {!pending && (
            <span className="text-zinc-600 text-sm group-hover:text-zinc-400 transition-colors">
              {running ? "click or press space to stop" : "click or press space to start"}
            </span>
          )}
        </button>

        {/* Confirm / Discard */}
        {pending && (
          <div className="border-t border-zinc-800 px-8 py-5 flex items-center justify-center gap-4">
            <button
              onClick={confirm}
              className="flex-1 sm:flex-none px-8 py-3 bg-[#FFD500] text-black font-heading text-[11px] tracking-widest transition hover:brightness-110 active:scale-95 cursor-pointer"
            >
              CONFIRM SOLVE
            </button>
            <button
              onClick={discard}
              className="flex-1 sm:flex-none px-8 py-3 border border-zinc-700 text-zinc-400 font-heading text-[11px] tracking-widest transition hover:border-zinc-500 hover:text-zinc-200 active:scale-95 cursor-pointer"
            >
              DISCARD
            </button>
          </div>
        )}
      </div>

      {/* Session stats — only confirmed solves */}
      {confirmedSolves.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Solves" value={String(confirmedSolves.length)} />
          <StatCard label="ao5" value={ao5} />
          <StatCard label="ao12" value={ao12} />
        </div>
      )}

      {/* Solve history — all attempts */}
      {history.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden">
          <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Session History</p>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {[...history].reverse().map((solve) => (
              <div
                key={solve.id}
                className={`px-6 py-3 flex items-center gap-4 ${!solve.confirmed ? "opacity-40" : ""}`}
              >
                <span className="text-xs text-zinc-600 w-6 text-right shrink-0">{solve.id}</span>
                <span className={`font-mono text-sm w-20 shrink-0 ${solve.confirmed ? "text-white" : "text-zinc-500 line-through"}`}>
                  {formatTime(solve.time)}
                </span>
                <span className="font-mono text-zinc-600 text-xs truncate">{solve.scramble}</span>
                {!solve.confirmed && (
                  <span className="font-heading text-[8px] text-zinc-700 tracking-widest shrink-0">DISCARDED</span>
                )}
              </div>
            ))}
          </div>
        </div>
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


const CUBE_COLORS = ["#C41E3A", "#0051A2", "#009B48", "#FF5800", "#FFD500", "#ffffff"];
function randomCubeColor(exclude?: string) {
  const options = CUBE_COLORS.filter((c) => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function AlgorithmTrainer() {
  const [tab, setTab] = useState<TrainerTab>("full-oll");
  const [activeColor, setActiveColor] = useState(() => randomCubeColor());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const isOLL = tab === "full-oll";

  const algs = tab === "full-oll" ? OLL_CASES : PLL_CASES;

  const filtered = search.trim()
    ? algs.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const current = algs[index % algs.length];
  const tabLabel = TRAINER_TABS.find((t) => t.id === tab)!.label;

  function handleTabChange(t: TrainerTab) {
    const next = randomCubeColor(activeColor);
    setActiveColor(next);
    setTab(t);
    setIndex(0);
    setRevealed(false);
    setSearch("");
    setSearchOpen(false);
  }

  function handleNext() {
    setIndex((i) => (i + 1) % algs.length);
    setRevealed(false);
  }

  function jumpTo(target: typeof algs[0]) {
    const i = algs.indexOf(target as never);
    if (i !== -1) setIndex(i);
    setRevealed(false);
    setSearch("");
    setSearchOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Tab selector + search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1">
          {TRAINER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-4 py-1.5 rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out ${
                tab === t.id ? "font-bold" : "font-medium text-zinc-400 hover:text-zinc-100"
              }`}
              style={tab === t.id ? { color: activeColor } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-zinc-500 shrink-0">
                <circle cx="6.5" cy="6.5" r="5" /><path d="M11 11l3 3" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => { if (!search) setSearchOpen(false); }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none w-14"
              />
            </div>
          </div>
          {searchOpen && filtered.length > 0 && (
            <div className="absolute top-full mt-1 left-0 w-full bg-[#0a0a11] border border-zinc-700 rounded-lg overflow-hidden z-10 shadow-xl">
              {filtered.map((a) => (
                <button
                  key={a.name}
                  onMouseDown={() => jumpTo(a)}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
          {searchOpen && search && filtered.length === 0 && (
            <div className="absolute top-full mt-1 left-0 w-full bg-[#0a0a11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-600 z-10">
              No results
            </div>
          )}
        </div>

        <span className="text-xs text-zinc-600 shrink-0 ml-auto">
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

