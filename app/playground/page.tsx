"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { OLL_CASES, PLL_CASES, type OLLCase, type PLLCase } from "../algorithms/data";
import { formatTime } from "@/lib/rank";
import { saveSolve, getAlgorithmProgress, recordAlgorithmAnswer } from "./actions";
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
    saveSolve(pending.time, pending.scramble, new Date().toLocaleDateString("en-CA"));
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

type AlgCase = OLLCase | PLLCase;

interface AlgProgressData {
  mastered: boolean;
  correct_streak: number;
  times_seen: number;
  times_correct: number;
}

const EMPTY_PROGRESS: AlgProgressData = {
  mastered: false,
  correct_streak: 0,
  times_seen: 0,
  times_correct: 0,
};

type S = "Y" | "G";
type PColor = "Y" | "R" | "G" | "O" | "B";
type TrainerTab = "full-oll" | "full-pll";

const TRAINER_TABS: { id: TrainerTab; label: string }[] = [
  { id: "full-oll", label: "Full OLL" },
  { id: "full-pll", label: "Full PLL" },
];
const PLL_TOP_Y: [PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor] =
  ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"];

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

function algKey(tab: TrainerTab, caseId: number | string): string {
  return `${tab === "full-oll" ? "oll" : "pll"}-${caseId}`;
}

function pickNextCase(
  tab: TrainerTab,
  progress: Record<string, AlgProgressData>,
  excludeKey?: string,
): AlgCase {
  const algs: AlgCase[] = tab === "full-oll" ? OLL_CASES : PLL_CASES;
  const candidates = algs.filter((a) => algKey(tab, a.id) !== excludeKey);

  const weighted = candidates.map((a) => {
    const p = progress[algKey(tab, a.id)];
    let w: number;
    if (!p || p.times_seen === 0) {
      w = 2.5; // unseen — moderate priority to mix in with weak ones
    } else if (p.mastered) {
      w = 0.3; // mastered — rare review
    } else {
      const accuracy = p.times_correct / p.times_seen;
      w = 1 + (1 - accuracy) * 3; // 1x–4x: worse accuracy = shown more often
    }
    return { alg: a, w };
  });

  const total = weighted.reduce((s, x) => s + x.w, 0);
  let rand = Math.random() * total;
  for (const { alg, w } of weighted) {
    rand -= w;
    if (rand <= 0) return alg;
  }
  return weighted[weighted.length - 1].alg;
}

function StreakDots({ streak, mastered }: { streak: number; mastered: boolean }) {
  if (mastered) {
    return (
      <span className="font-heading text-[8px] leading-none shrink-0" style={{ color: "#FFD500" }}>
        MASTERED
      </span>
    );
  }
  return (
    <div className="flex items-center gap-[3px] shrink-0" title={`${streak} / 5 correct in a row`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 1,
            backgroundColor: i <= streak ? "#009B48" : "#27272a",
            boxShadow: i <= streak ? "0 0 4px rgba(0,155,72,0.6)" : undefined,
            transition: "background-color 0.2s, box-shadow 0.2s",
          }}
        />
      ))}
    </div>
  );
}

function AlgorithmTrainer() {
  const [tab, setTab] = useState<TrainerTab>("full-oll");
  const [activeColor, setActiveColor] = useState(() => randomCubeColor());
  const [progress, setProgress] = useState<Record<string, AlgProgressData>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [currentCase, setCurrentCase] = useState<AlgCase | null>(null);
  const [phase, setPhase] = useState<"question" | "revealed" | "celebrating">("question");
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const answering = useRef(false);

  // Load progress from DB on mount
  useEffect(() => {
    getAlgorithmProgress().then((p) => {
      setProgress(p);
      setProgressLoaded(true);
    });
  }, []);

  // Pick first case once progress is loaded
  useEffect(() => {
    if (progressLoaded) {
      setCurrentCase(pickNextCase(tab, progress));
    }
    // progress is settled in the same batch as progressLoaded — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

  function handleTabChange(t: TrainerTab) {
    setActiveColor(randomCubeColor(activeColor));
    setTab(t);
    setPhase("question");
    setLastResult(null);
    setSearch("");
    setSearchOpen(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    if (progressLoaded) setCurrentCase(pickNextCase(t, progress));
  }

  async function handleAnswer(correct: boolean) {
    if (!currentCase || phase !== "revealed" || answering.current) return;
    answering.current = true;

    const key = algKey(tab, currentCase.id);
    const prev = progress[key] ?? EMPTY_PROGRESS;
    const newStreak = correct ? prev.correct_streak + 1 : 0;
    const newlyMastered = !prev.mastered && newStreak >= 5;
    const updated: AlgProgressData = {
      mastered:       prev.mastered || newlyMastered,
      correct_streak: newStreak,
      times_seen:     prev.times_seen + 1,
      times_correct:  prev.times_correct + (correct ? 1 : 0),
    };

    const newProgress = { ...progress, [key]: updated };
    setProgress(newProgress);
    setSessionTotal((n) => n + 1);
    if (correct) setSessionCorrect((n) => n + 1);
    setLastResult(correct ? "correct" : "incorrect");
    if (newlyMastered) setPhase("celebrating");

    // Fire-and-forget: persists to DB, awards 30 XP + achievements if newly mastered
    recordAlgorithmAnswer(key, newStreak, updated.times_seen, updated.times_correct, updated.mastered);

    setTimeout(() => {
      setLastResult(null);
      setPhase("question");
      setCurrentCase(pickNextCase(tab, newProgress, key));
      answering.current = false;
    }, newlyMastered ? 2200 : 500);
  }

  function jumpTo(target: AlgCase) {
    setCurrentCase(target);
    setPhase("question");
    setLastResult(null);
    setSearch("");
    setSearchOpen(false);
  }

  const isOLL = tab === "full-oll";
  const algs: AlgCase[] = isOLL ? OLL_CASES : PLL_CASES;
  const filtered = search.trim()
    ? algs.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const ollMastered = Object.entries(progress).filter(([k, v]) => k.startsWith("oll-") && v.mastered).length;
  const pllMastered = Object.entries(progress).filter(([k, v]) => k.startsWith("pll-") && v.mastered).length;
  const categoryMastered = isOLL ? ollMastered : pllMastered;
  const categoryTotal = algs.length;

  const currentKey = currentCase ? algKey(tab, currentCase.id) : null;
  const currentProgress = (currentKey && progress[currentKey]) ? progress[currentKey] : EMPTY_PROGRESS;

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        {/* OLL / PLL tabs */}
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

        {/* Search / jump to */}
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
                placeholder="Jump to..."
                className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none w-20"
              />
            </div>
          </div>
          {searchOpen && filtered.length > 0 && (
            <div className="absolute top-full mt-1 left-0 min-w-[160px] bg-[#0a0a11] border border-zinc-700 rounded-lg overflow-hidden z-10 shadow-xl">
              {filtered.map((a) => {
                const p = progress[algKey(tab, a.id)];
                return (
                  <button
                    key={a.name}
                    onMouseDown={() => jumpTo(a)}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <span>{a.name}</span>
                    {p?.mastered ? (
                      <span className="font-heading text-[7px] shrink-0" style={{ color: "#FFD500" }}>MASTERED</span>
                    ) : p && p.times_seen > 0 ? (
                      <span className="text-xs text-zinc-600 shrink-0 tabular-nums">
                        {Math.round((p.times_correct / p.times_seen) * 100)}%
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
          {searchOpen && search && filtered.length === 0 && (
            <div className="absolute top-full mt-1 left-0 w-full bg-[#0a0a11] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-600 z-10">
              No results
            </div>
          )}
        </div>

        {/* Mastery + session stats */}
        <div className="flex items-center gap-4 sm:ml-auto">
          <span className="text-xs text-zinc-600">
            {categoryMastered} / {categoryTotal} mastered
          </span>
          {sessionTotal > 0 && (
            <span className="text-xs text-zinc-500">
              {sessionCorrect}/{sessionTotal} this session
            </span>
          )}
        </div>
      </div>

      {/* Main card */}
      {!progressLoaded || !currentCase ? (
        <div className="rounded-xl border border-zinc-800 bg-[#0a0a11] flex items-center justify-center py-24">
          <span className="text-zinc-700 text-sm">Loading...</span>
        </div>

      ) : phase === "celebrating" ? (
        <div className="rounded-xl bg-[#0a0a11] overflow-hidden" style={{ border: "1px solid rgba(255,213,0,0.25)" }}>
          <div className="flex flex-col items-center justify-center gap-5 py-24 px-8 text-center">
            <div className="flex gap-[4px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: "#FFD500", boxShadow: "0 0 8px rgba(255,213,0,0.7)" }} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-heading text-[9px] tracking-widest" style={{ color: "#FFD500" }}>
                ALGORITHM MASTERED
              </span>
              <span className="font-heading text-sm text-white">{currentCase.name}</span>
            </div>
            <span className="font-heading text-xs" style={{ color: "#009B48" }}>+30 XP</span>
          </div>
        </div>

      ) : (
        <div
          className="rounded-xl bg-[#0a0a11] overflow-hidden transition-colors duration-300"
          style={{
            border: `1px solid ${
              lastResult === "correct"   ? "rgba(0,155,72,0.4)"   :
              lastResult === "incorrect" ? "rgba(196,30,58,0.4)"  :
              "#27272a"
            }`,
          }}
        >
          {/* Header: name + streak indicator */}
          <div className="border-b border-zinc-800 px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 min-w-0">
              <p className="text-xs text-zinc-600 uppercase tracking-widest">
                {TRAINER_TABS.find((t) => t.id === tab)!.label}
              </p>
              <h2 className="font-heading text-xs text-white truncate">{currentCase.name}</h2>
            </div>
            <StreakDots streak={currentProgress.correct_streak} mastered={currentProgress.mastered} />
          </div>

          {/* Diagram */}
          <div className="flex flex-col items-center gap-6 py-12 px-8">
            <div className="p-3 rounded-lg border border-zinc-800 bg-[#13131f] flex items-center justify-center">
              {isOLL ? (
                <OLLDiagramView
                  top={(currentCase as OLLCase).top}
                  back={currentCase.back as [S, S, S]}
                  front={currentCase.front as [S, S, S]}
                  left={currentCase.left as [S, S, S]}
                  right={currentCase.right as [S, S, S]}
                />
              ) : (
                <PLLDiagramView
                  top={PLL_TOP_Y}
                  back={currentCase.back as [PColor, PColor, PColor]}
                  front={currentCase.front as [PColor, PColor, PColor]}
                  left={currentCase.left as [PColor, PColor, PColor]}
                  right={currentCase.right as [PColor, PColor, PColor]}
                />
              )}
            </div>

            {/* Reveal / answer zone */}
            <div className="flex flex-col items-center gap-3 min-h-[4rem] justify-center">
              {phase === "question" ? (
                <button
                  onClick={() => setPhase("revealed")}
                  className="px-6 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  Show Solution
                </button>
              ) : (
                <>
                  <p className="font-mono text-[#FFD500] text-lg tracking-wide text-center">
                    {currentCase.alg}
                  </p>
                  <p className="text-xs text-zinc-600">Did you know this one?</p>
                </>
              )}
            </div>
          </div>

          {/* Got it / Missed it */}
          {phase === "revealed" && (
            <div className="border-t border-zinc-800 px-8 py-4 flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-3 font-heading text-[10px] tracking-widest text-white transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: "#009B48", boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
              >
                GOT IT
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-3 border border-zinc-700 text-zinc-400 font-heading text-[10px] tracking-widest transition-all hover:border-red-900 hover:text-red-400 active:scale-95 cursor-pointer"
              >
                MISSED IT
              </button>
            </div>
          )}

          {/* Per-case accuracy footer */}
          {currentProgress.times_seen > 0 && phase === "question" && (
            <div className="border-t border-zinc-800/50 px-8 py-2.5 flex items-center justify-between">
              <span className="text-xs text-zinc-700">
                {currentProgress.times_correct} / {currentProgress.times_seen} correct
              </span>
              <span className="text-xs text-zinc-700">
                {Math.round((currentProgress.times_correct / currentProgress.times_seen) * 100)}% accuracy
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
