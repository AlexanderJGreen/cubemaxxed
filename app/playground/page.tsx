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
    <div className="mx-auto max-w-5xl px-6 py-14 flex flex-col gap-8">
      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">PLAYGROUND</span>
        <p className="font-sans text-sm text-zinc-500">
          Practice on your own terms. Timer and trainer sessions still earn XP.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="font-heading text-[9px] tracking-widest px-6 py-3 cursor-pointer transition-colors"
            style={{
              color: activeTab === tab.id ? "#FFD500" : "rgba(255,255,255,0.25)",
              borderBottom: activeTab === tab.id ? "2px solid #FFD500" : "2px solid transparent",
              marginBottom: -1,
            }}
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
  time: number;
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
    saveSolve(pending.time, pending.scramble, new Date().toLocaleDateString("en-CA"), new Date().getHours());
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
    <div className="flex flex-col gap-4">
      {/* Timer card */}
      <div style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Scramble */}
        <div className="px-8 py-5 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest">SCRAMBLE</span>
          <p className="font-mono text-zinc-200 text-base tracking-wide mt-3">{currentScramble}</p>
        </div>

        {/* Timer display */}
        <button
          onClick={toggle}
          disabled={!!pending}
          className="w-full py-10 sm:py-20 flex flex-col items-center gap-6 focus:outline-none cursor-pointer group disabled:cursor-default"
        >
          <span
            className="font-mono tabular-nums transition-colors"
            style={{
              fontSize: "clamp(48px, 10vw, 96px)",
              fontWeight: 700,
              color: running ? "#FFD500" : elapsed > 0 ? "#ffffff" : "rgba(255,255,255,0.15)",
              textShadow: "none",
            }}
          >
            {formatTime(elapsed)}
          </span>
          {!pending && (
            <span className="font-heading text-[8px] text-zinc-700 tracking-widest group-hover:text-zinc-500 transition-colors">
              {running ? "CLICK OR SPACE TO STOP" : "CLICK OR SPACE TO START"}
            </span>
          )}
        </button>

        {/* Confirm / Discard */}
        {pending && (
          <div className="px-8 py-5 flex items-center justify-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={confirm}
              className="flex-1 sm:flex-none px-8 py-3 font-heading text-[10px] tracking-widest text-black transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              style={{ backgroundColor: "#FFD500" }}
            >
              CONFIRM SOLVE
            </button>
            <button
              onClick={discard}
              className="flex-1 sm:flex-none px-8 py-3 font-heading text-[10px] tracking-widest text-zinc-400 transition-all hover:text-zinc-200 active:scale-95 cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              DISCARD
            </button>
          </div>
        )}
      </div>

      {/* Session stats */}
      {confirmedSolves.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "SOLVES", value: String(confirmedSolves.length), color: "#009B48" },
            { label: "AO5",    value: ao5,                            color: "#C41E3A" },
            { label: "AO12",   value: ao12,                           color: "#4FC3F7" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex flex-col gap-2.5 p-4"
              style={{ backgroundColor: "#0a0a12", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="h-[2px] w-5" style={{ backgroundColor: color }} />
              <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">{label}</span>
              <span className="font-heading text-lg leading-none" style={{ color: value === "—" ? "rgba(255,255,255,0.15)" : color }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Solve history */}
      {history.length > 0 && (
        <div style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="font-heading text-[8px] text-zinc-600 tracking-widest">SESSION HISTORY</span>
            <button
              onClick={() => setHistory([])}
              className="font-heading text-[8px] text-zinc-700 hover:text-zinc-400 transition-colors cursor-pointer tracking-widest"
            >
              CLEAR
            </button>
          </div>
          <div>
            {[...history].reverse().map((solve) => (
              <div
                key={solve.id}
                className="px-6 py-3 flex items-center gap-4"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  opacity: solve.confirmed ? 1 : 0.35,
                }}
              >
                <span className="font-heading text-[8px] text-zinc-700 w-5 text-right shrink-0">{solve.id}</span>
                <span
                  className="font-mono text-sm w-20 shrink-0"
                  style={{
                    color: solve.confirmed ? "#ffffff" : "rgba(255,255,255,0.3)",
                    textDecoration: solve.confirmed ? "none" : "line-through",
                  }}
                >
                  {formatTime(solve.time)}
                </span>
                <span className="font-mono text-zinc-700 text-xs truncate">{solve.scramble}</span>
                {!solve.confirmed && (
                  <span className="font-heading text-[7px] text-zinc-800 tracking-widest shrink-0">DISCARDED</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Algorithm Trainer ────────────────────────────────────────────────────────

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
type TrainerTab = "2look-oll" | "2look-pll" | "full-oll" | "full-pll";

const TRAINER_TABS: { id: TrainerTab; label: string }[] = [
  { id: "2look-oll", label: "2-Look OLL" },
  { id: "2look-pll", label: "2-Look PLL" },
  { id: "full-oll",  label: "Full OLL"   },
  { id: "full-pll",  label: "Full PLL"   },
];

// 2-Look OLL cases (10 cases: 3 edge orientation + 7 corner orientation)
const TWO_LOOK_OLL_CASES: OLLCase[] = [
  { id: 1001, name: "Dot Shape",   group: "Edge", top: ["G","G","G","G","Y","G","G","G","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","Y","G"] as [S,S,S], front: ["G","Y","G"] as [S,S,S], left: ["G","Y","G"] as [S,S,S], right: ["G","Y","G"] as [S,S,S], alg: "F R U R' U' F' f R U R' U' f'" },
  { id: 1002, name: "I-Shape",     group: "Edge", top: ["G","G","G","Y","Y","Y","G","G","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","Y","G"] as [S,S,S], front: ["G","Y","G"] as [S,S,S], left: ["G","G","G"] as [S,S,S], right: ["G","G","G"] as [S,S,S], alg: "F R U R' U' F'" },
  { id: 1003, name: "L-Shape",     group: "Edge", top: ["G","G","G","G","Y","Y","G","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","Y","G"] as [S,S,S], front: ["G","G","G"] as [S,S,S], left: ["G","Y","G"] as [S,S,S], right: ["G","G","G"] as [S,S,S], alg: "f R U R' U' f'" },
  { id: 1004, name: "Antisune",    group: "Corner", top: ["G","Y","Y","Y","Y","Y","G","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","G","G"] as [S,S,S], front: ["Y","G","G"] as [S,S,S], left: ["Y","G","G"] as [S,S,S], right: ["G","G","Y"] as [S,S,S], alg: "R U2 R' U' R U' R'" },
  { id: 1005, name: "Sune",        group: "Corner", top: ["G","Y","G","Y","Y","Y","Y","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["Y","G","G"] as [S,S,S], front: ["G","G","Y"] as [S,S,S], left: ["G","G","G"] as [S,S,S], right: ["Y","G","G"] as [S,S,S], alg: "R U R' U R U2 R'" },
  { id: 1006, name: "H",           group: "Corner", top: ["G","Y","G","Y","Y","Y","G","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","G","G"] as [S,S,S], front: ["G","G","G"] as [S,S,S], left: ["Y","G","Y"] as [S,S,S], right: ["Y","G","Y"] as [S,S,S], alg: "R U R' U R U' R' U R U2 R'" },
  { id: 1007, name: "L",           group: "Corner", top: ["Y","Y","G","Y","Y","Y","G","Y","Y"] as [S,S,S,S,S,S,S,S,S], back: ["G","G","G"] as [S,S,S], front: ["Y","G","G"] as [S,S,S], left: ["G","G","G"] as [S,S,S], right: ["Y","G","G"] as [S,S,S], alg: "F R' F' r U R U' r'" },
  { id: 1008, name: "Pi",          group: "Corner", top: ["G","Y","G","Y","Y","Y","G","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","G","Y"] as [S,S,S], front: ["G","G","Y"] as [S,S,S], left: ["Y","G","Y"] as [S,S,S], right: ["G","G","G"] as [S,S,S], alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { id: 1009, name: "T",           group: "Corner", top: ["G","Y","Y","Y","Y","Y","G","Y","Y"] as [S,S,S,S,S,S,S,S,S], back: ["Y","G","G"] as [S,S,S], front: ["Y","G","G"] as [S,S,S], left: ["G","G","G"] as [S,S,S], right: ["G","G","G"] as [S,S,S], alg: "r U R' U' r' F R F'" },
  { id: 1010, name: "U",           group: "Corner", top: ["Y","Y","Y","Y","Y","Y","G","Y","G"] as [S,S,S,S,S,S,S,S,S], back: ["G","G","G"] as [S,S,S], front: ["Y","G","Y"] as [S,S,S], left: ["G","G","G"] as [S,S,S], right: ["G","G","G"] as [S,S,S], alg: "R2 D R' U2 R D' R' U2 R'" },
];

// 2-Look PLL cases (6 cases: 2 corner + 4 edge permutation)
const TWO_LOOK_PLL_CASES: PLLCase[] = [
  { id: "2L-T",  name: "T-Perm",  group: "Corner", back: ["G","G","R"] as [PColor,PColor,PColor], front: ["B","B","R"] as [PColor,PColor,PColor], left: ["O","R","O"] as [PColor,PColor,PColor], right: ["B","O","G"] as [PColor,PColor,PColor], alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
  { id: "2L-Y",  name: "Y-Perm",  group: "Corner", back: ["R","B","O"] as [PColor,PColor,PColor], front: ["R","R","O"] as [PColor,PColor,PColor], left: ["G","O","B"] as [PColor,PColor,PColor], right: ["B","G","G"] as [PColor,PColor,PColor], alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
  { id: "2L-Ua", name: "Ua-Perm", group: "Edge",   back: ["G","G","G"] as [PColor,PColor,PColor], front: ["B","R","B"] as [PColor,PColor,PColor], left: ["O","B","O"] as [PColor,PColor,PColor], right: ["R","O","R"] as [PColor,PColor,PColor], alg: "R U' R U R U R U' R' U' R2" },
  { id: "2L-Ub", name: "Ub-Perm", group: "Edge",   back: ["G","G","G"] as [PColor,PColor,PColor], front: ["B","O","B"] as [PColor,PColor,PColor], left: ["O","R","O"] as [PColor,PColor,PColor], right: ["R","B","R"] as [PColor,PColor,PColor], alg: "R2 U R U R' U' R' U' R' U R'" },
  { id: "2L-H",  name: "H-Perm",  group: "Edge",   back: ["O","R","O"] as [PColor,PColor,PColor], front: ["R","O","R"] as [PColor,PColor,PColor], left: ["B","G","B"] as [PColor,PColor,PColor], right: ["G","B","G"] as [PColor,PColor,PColor], alg: "M2 U M2 U2 M2 U M2" },
  { id: "2L-Z",  name: "Z-Perm",  group: "Edge",   back: ["O","G","O"] as [PColor,PColor,PColor], front: ["R","B","R"] as [PColor,PColor,PColor], left: ["B","R","B"] as [PColor,PColor,PColor], right: ["G","O","G"] as [PColor,PColor,PColor], alg: "M2 U M2 U M' U2 M2 U2 M'" },
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
  const prefix = tab === "full-oll" ? "oll" : tab === "full-pll" ? "pll" : tab === "2look-oll" ? "2oll" : "2pll";
  return `${prefix}-${caseId}`;
}

function pickNextCase(
  tab: TrainerTab,
  progress: Record<string, AlgProgressData>,
  excludeKey?: string,
): AlgCase {
  const algs: AlgCase[] = tab === "full-oll" ? OLL_CASES : tab === "full-pll" ? PLL_CASES : tab === "2look-oll" ? TWO_LOOK_OLL_CASES : TWO_LOOK_PLL_CASES;
  const candidates = algs.filter((a) => algKey(tab, a.id) !== excludeKey);

  const weighted = candidates.map((a) => {
    const p = progress[algKey(tab, a.id)];
    let w: number;
    if (!p || p.times_seen === 0) {
      w = 2.5;
    } else if (p.mastered) {
      w = 0.3;
    } else {
      const accuracy = p.times_correct / p.times_seen;
      w = 1 + (1 - accuracy) * 3;
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
            backgroundColor: i <= streak ? "#009B48" : "#1a1a26",
            border: `1px solid ${i <= streak ? "#009B48" : "rgba(255,255,255,0.08)"}`,
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

  useEffect(() => {
    getAlgorithmProgress().then((p) => {
      setProgress(p);
      setProgressLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (progressLoaded) {
      setCurrentCase(pickNextCase(tab, progress));
    }
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

  const isOLL = tab === "full-oll" || tab === "2look-oll";
  const algs: AlgCase[] = tab === "full-oll" ? OLL_CASES : tab === "full-pll" ? PLL_CASES : tab === "2look-oll" ? TWO_LOOK_OLL_CASES : TWO_LOOK_PLL_CASES;
  const filtered = search.trim()
    ? algs.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const prefixMap: Record<TrainerTab, string> = { "full-oll": "oll-", "full-pll": "pll-", "2look-oll": "2oll-", "2look-pll": "2pll-" };
  const categoryMastered = Object.entries(progress).filter(([k, v]) => k.startsWith(prefixMap[tab]) && v.mastered).length;
  const categoryTotal = algs.length;

  const currentKey = currentCase ? algKey(tab, currentCase.id) : null;
  const currentProgress = (currentKey && progress[currentKey]) ? progress[currentKey] : EMPTY_PROGRESS;

  return (
    <div className="flex flex-col gap-4">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">

        {/* OLL / PLL sub-tabs */}
        <div className="flex" style={{ border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0a0a12" }}>
          {TRAINER_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className="px-5 py-2.5 font-heading text-[8px] tracking-widest cursor-pointer transition-colors"
              style={{
                color: tab === t.id ? activeColor : "rgba(255,255,255,0.25)",
                backgroundColor: tab === t.id ? "rgba(255,255,255,0.04)" : "transparent",
                borderRight: t.id === "2look-pll" ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search / jump to */}
        <div className="relative">
          <div
            className="flex items-center gap-2 px-5 py-2.5"
            style={{ border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0a0a12" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-zinc-600 shrink-0">
              <circle cx="6.5" cy="6.5" r="5" /><path d="M11 11l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => { if (!search) setSearchOpen(false); }}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Jump to..."
              className="bg-transparent font-heading text-[8px] tracking-widest text-white placeholder-zinc-700 outline-none w-24"
            />
          </div>
          {searchOpen && filtered.length > 0 && (
            <div
              className="absolute top-full mt-1 left-0 min-w-[180px] z-10"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {filtered.map((a) => {
                const p = progress[algKey(tab, a.id)];
                return (
                  <button
                    key={a.name}
                    onMouseDown={() => jumpTo(a)}
                    className="w-full text-left px-4 py-2.5 font-sans text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-between gap-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span>{a.name}</span>
                    {p?.mastered ? (
                      <span className="font-heading text-[7px] shrink-0" style={{ color: "#FFD500" }}>MASTERED</span>
                    ) : p && p.times_seen > 0 ? (
                      <span className="font-heading text-[7px] text-zinc-700 shrink-0 tabular-nums">
                        {Math.round((p.times_correct / p.times_seen) * 100)}%
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
          {searchOpen && search && filtered.length === 0 && (
            <div
              className="absolute top-full mt-1 left-0 w-full px-4 py-2.5 z-10"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="font-heading text-[8px] text-zinc-700">NO RESULTS</span>
            </div>
          )}
        </div>

        {/* Mastery + session stats */}
        <div className="flex items-center gap-5 sm:ml-auto">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[7px] text-zinc-700 tracking-widest">MASTERED</span>
            <span className="font-heading text-xs" style={{ color: "#FFD500" }}>
              {categoryMastered}/{categoryTotal}
            </span>
          </div>
          {sessionTotal > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-heading text-[7px] text-zinc-700 tracking-widest">SESSION</span>
              <span className="font-heading text-xs text-white">
                {sessionCorrect}/{sessionTotal}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main card */}
      {!progressLoaded || !currentCase ? (
        <div
          className="flex items-center justify-center py-24"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="font-heading text-[8px] text-zinc-700 tracking-widest">LOADING...</span>
        </div>

      ) : phase === "celebrating" ? (
        <div
          style={{ backgroundColor: "#0f0f1a", border: "1px solid rgba(255,213,0,0.2)", boxShadow: "0 0 32px rgba(255,213,0,0.06)" }}
        >
          <div className="flex flex-col items-center justify-center gap-6 py-24 px-8 text-center">
            <div className="flex gap-[5px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ width: 8, height: 8, backgroundColor: "#FFD500", boxShadow: "0 0 10px rgba(255,213,0,0.8)" }} />
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
          className="transition-colors duration-300"
          style={{
            backgroundColor: "#0f0f1a",
            border: `1px solid ${
              lastResult === "correct"   ? "rgba(0,155,72,0.35)"  :
              lastResult === "incorrect" ? "rgba(196,30,58,0.35)" :
              "rgba(255,255,255,0.06)"
            }`,
          }}
        >
          {/* Header */}
          <div
            className="px-8 py-4 flex items-center justify-between gap-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex flex-col gap-1.5 min-w-0">
              <span className="font-heading text-[8px] text-zinc-600 tracking-widest">
                {TRAINER_TABS.find((t) => t.id === tab)!.label.toUpperCase()}
              </span>
              <h2 className="font-heading text-xs text-white truncate">{currentCase.name}</h2>
            </div>
            <StreakDots streak={currentProgress.correct_streak} mastered={currentProgress.mastered} />
          </div>

          {/* Diagram */}
          <div className="flex flex-col items-center gap-6 py-12 px-8">
            <div
              className="flex items-center justify-center p-4"
              style={{ backgroundColor: "#0a0a12", border: "1px solid rgba(255,255,255,0.05)" }}
            >
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
                  className="px-6 py-2.5 font-heading text-[9px] tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  SHOW SOLUTION
                </button>
              ) : (
                <>
                  <p className="font-mono text-[#FFD500] text-lg tracking-wide text-center">
                    {currentCase.alg}
                  </p>
                  <p className="font-heading text-[8px] text-zinc-600 tracking-widest">DID YOU KNOW THIS ONE?</p>
                </>
              )}
            </div>
          </div>

          {/* Got it / Missed it */}
          {phase === "revealed" && (
            <div
              className="px-8 py-4 flex gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-3 font-heading text-[10px] tracking-widest text-white transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: "#009B48", boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
              >
                GOT IT
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-3 font-heading text-[10px] tracking-widest text-zinc-500 transition-all active:scale-95 cursor-pointer"
                style={{ border: "1px solid rgba(196,30,58,0.25)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196,30,58,0.6)";
                  e.currentTarget.style.color = "#C41E3A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(196,30,58,0.25)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                }}
              >
                MISSED IT
              </button>
            </div>
          )}

          {/* Per-case accuracy footer */}
          {currentProgress.times_seen > 0 && phase === "question" && (
            <div
              className="px-8 py-2.5 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
            >
              <span className="font-heading text-[7px] text-zinc-800 tracking-widest">
                {currentProgress.times_correct} / {currentProgress.times_seen} CORRECT
              </span>
              <span className="font-heading text-[7px] text-zinc-800 tracking-widest">
                {Math.round((currentProgress.times_correct / currentProgress.times_seen) * 100)}% ACCURACY
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
