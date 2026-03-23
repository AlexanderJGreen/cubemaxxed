"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CaseDiagram,
  PLLCaseDiagram,
  EDGE_ORI,
  CORNER_ORI,
  CORNER_PERM,
  EDGE_PERM,
  type DiagramProps,
  type PLLDiagramProps,
} from "@/app/algorithms/page";
import { awardMemoryXP } from "./actions";

// ── Constants ─────────────────────────────────────────────────────────────────

const SHOW_SECONDS = 5;
const XP_PER_CORRECT = 10;

const CUBE_COLORS = ["#C41E3A", "#0051A2", "#009B48", "#FF5800", "#FFD500", "#ffffff"];

function randomCubeColor(exclude?: string) {
  const options = CUBE_COLORS.filter((c) => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

// ── Types ─────────────────────────────────────────────────────────────────────

type TrainerCase =
  | { kind: "oll"; name: string; diagram: DiagramProps; alg: string }
  | { kind: "pll"; name: string; diagram: PLLDiagramProps; alg: string };

type Phase = "idle" | "showing" | "recall" | "result";
type XpStatus = "idle" | "pending" | "awarded" | "no_auth";
type Filter = "both" | "oll" | "pll";

// ── Case pool — all 2-look OLL + PLL cases ────────────────────────────────────

const ALL_CASES: TrainerCase[] = [
  ...EDGE_ORI.map((c) => ({ ...c, kind: "oll" as const })),
  ...CORNER_ORI.map((c) => ({ ...c, kind: "oll" as const })),
  ...CORNER_PERM.map((c) => ({ ...c, kind: "pll" as const })),
  ...EDGE_PERM.map((c) => ({ ...c, kind: "pll" as const })),
];

function getPool(filter: Filter): TrainerCase[] {
  if (filter === "oll") return ALL_CASES.filter((c) => c.kind === "oll");
  if (filter === "pll") return ALL_CASES.filter((c) => c.kind === "pll");
  return ALL_CASES;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normalize whitespace so "R U  R'" matches "R U R'"
function normalize(alg: string): string {
  return alg.trim().split(/\s+/).join(" ");
}

function pickRandom(pool: TrainerCase[], seen: string[]): TrainerCase | null {
  const remaining = pool.filter((c) => !seen.includes(c.name));
  if (!remaining.length) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function KindBadge({ kind }: { kind: "oll" | "pll" }) {
  const isOll = kind === "oll";
  return (
    <span
      className="font-heading text-[9px] px-2 py-1 leading-none"
      style={{
        color: isOll ? "#FFD500" : "#0051A2",
        border: `1px solid ${isOll ? "rgba(255,213,0,0.35)" : "rgba(0,81,162,0.45)"}`,
        backgroundColor: isOll ? "rgba(255,213,0,0.06)" : "rgba(0,81,162,0.1)",
      }}
    >
      {kind.toUpperCase()}
    </span>
  );
}

function DiagramBox({ c }: { c: TrainerCase }) {
  return (
    <div className="rounded-lg bg-[#13131f] border border-zinc-800 p-5 flex items-center justify-center">
      {c.kind === "oll" ? (
        <CaseDiagram {...c.diagram} />
      ) : (
        <PLLCaseDiagram {...c.diagram} />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MemoryTrainer() {
  // Which screen is shown
  const [phase, setPhase] = useState<Phase>("idle");

  // The case currently being drilled
  const [currentCase, setCurrentCase] = useState<TrainerCase | null>(null);

  // Names of cases already answered this cycle
  const [seen, setSeen] = useState<string[]>([]);

  // The user's typed answer
  const [input, setInput] = useState("");

  // Whether the last submitted answer was correct
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Remaining seconds while the algorithm is visible
  const [timeLeft, setTimeLeft] = useState(SHOW_SECONDS);

  // Status of the XP award attempt
  const [xpStatus, setXpStatus] = useState<XpStatus>("idle");

  // Which subset of cases to drill
  const [filter, setFilter] = useState<Filter>("both");
  const [activeFilterColor, setActiveFilterColor] = useState(() => randomCubeColor());

  const inputRef = useRef<HTMLInputElement>(null);

  const pool = getPool(filter);
  const doneCount = seen.length;
  const isCycleDone = doneCount === pool.length;

  // ── Timer — counts down while the algorithm is visible ────────────────────
  // This effect runs every time `phase` changes. When phase becomes "showing"
  // it starts a 1-second interval. Each tick decrements timeLeft. When it hits
  // 1 (about to reach 0) we transition to "recall" and reset timeLeft for next
  // time. The cleanup function (`return () => clearInterval(...)`) fires when
  // the component unmounts OR when phase changes away from "showing", which
  // stops the interval automatically.
  useEffect(() => {
    if (phase !== "showing") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("recall");
          return SHOW_SECONDS; // reset for the next round
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // ── Auto-focus input when recall phase starts ─────────────────────────────
  useEffect(() => {
    if (phase === "recall") inputRef.current?.focus();
  }, [phase]);

  // ── Game actions ──────────────────────────────────────────────────────────

  function beginRound(seenList: string[], activPool = pool) {
    const next = pickRandom(activPool, seenList);
    if (!next) return;
    setCurrentCase(next);
    setInput("");
    setIsCorrect(null);
    setXpStatus("idle");
    setTimeLeft(SHOW_SECONDS);
    setPhase("showing");
  }

  function handleStart() {
    if (isCycleDone) {
      setSeen([]);
      beginRound([], pool);
    } else {
      beginRound(seen, pool);
    }
  }

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setActiveFilterColor((prev) => randomCubeColor(prev));
    setSeen([]);
    setPhase("idle");
  }

  async function handleSubmit() {
    if (!currentCase || phase !== "recall") return;

    const correct = normalize(input) === normalize(currentCase.alg);
    setIsCorrect(correct);
    setSeen((prev) => [...prev, currentCase.name]);
    setPhase("result");

    if (correct) {
      setXpStatus("pending");
      const res = await awardMemoryXP(XP_PER_CORRECT);
      setXpStatus("error" in res ? "no_auth" : "awarded");
    }
  }

  function handleNext() {
    beginRound(seen, pool);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14 flex flex-col gap-10">
      {/* Page header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/algorithms"
          className="inline-flex items-center gap-2 font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
        >
          ← ALGORITHMS
        </Link>
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
            TRAINING
          </span>
          <h1
            className="font-heading text-white leading-snug"
            style={{ fontSize: "clamp(14px, 2.5vw, 22px)" }}
          >
            MEMORY TRAINER
          </h1>
          <p className="font-sans text-zinc-400 text-sm leading-relaxed">
            Flash &amp; Recall — see the algorithm for {SHOW_SECONDS} seconds,
            then type it from memory.
          </p>
        </div>
      </div>

      {/* Cycle progress (only shown once a round has started) */}
      {phase !== "idle" && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
              CYCLE PROGRESS
            </span>
            <span className="font-heading text-[9px] text-zinc-500">
              {doneCount} / {pool.length}
            </span>
          </div>
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(doneCount / pool.length) * 100}%`,
                backgroundColor: "#FFD500",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Game card ── */}
      <div
        className="rounded-xl border border-zinc-800 bg-[#0a0a11] overflow-hidden"
        style={{ minHeight: 460 }}
      >
        {/* ── IDLE ── */}
        {phase === "idle" && (
          <div
            className="flex flex-col items-center justify-center gap-8 p-10"
            style={{ minHeight: 460 }}
          >
            {isCycleDone ? (
              /* Cycle complete state */
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="font-heading text-3xl text-[#FFD500]">★</span>
                  <span className="font-heading text-[11px] text-[#FFD500] tracking-widest">
                    CYCLE COMPLETE
                  </span>
                  <p className="font-sans text-zinc-400 text-sm max-w-xs leading-relaxed">
                    You&apos;ve drilled all {pool.length} cases. Change the set
                    below or start a new cycle.
                  </p>
                </div>
                {/* Filter toggle */}
                <div className="flex gap-1 bg-[#080810] border border-zinc-800 rounded-lg p-1 w-full max-w-xs">
                  {(
                    [
                      { id: "both", label: "OLL + PLL" },
                      { id: "oll",  label: "OLL Only"  },
                      { id: "pll",  label: "PLL Only"  },
                    ] as { id: Filter; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleFilterChange(opt.id)}
                      className="relative flex-1 py-2 px-1 rounded-md cursor-pointer"
                    >
                      <span className="font-bold invisible text-[9px]">{opt.label}</span>
                      <span
                        className={`absolute inset-0 flex items-center justify-center font-heading text-[9px] leading-none transition-colors duration-300 ${
                          filter === opt.id ? "font-bold" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                        style={filter === opt.id ? { color: activeFilterColor } : undefined}
                      >
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleStart}
                  className="font-heading text-[11px] leading-none px-10 py-4 cursor-pointer transition-all active:translate-y-[2px]"
                  style={{
                    backgroundColor: "#FFD500",
                    color: "#0d0d14",
                    boxShadow: "0 4px 0px #a38a00",
                  }}
                >
                  START NEW CYCLE
                </button>
              </>
            ) : (
              /* Normal start state */
              <>
                <div className="flex flex-col items-center gap-5 text-center w-full max-w-sm">

                  {/* Filter toggle */}
                  <div className="flex flex-col gap-2 w-full">
                    <span className="font-heading text-[9px] text-zinc-600 tracking-widest text-left">
                      CASE SET
                    </span>
                    <div className="flex gap-1 bg-[#080810] border border-zinc-800 rounded-lg p-1 w-full">
                      {(
                        [
                          { id: "both", label: "OLL + PLL" },
                          { id: "oll",  label: "OLL Only"  },
                          { id: "pll",  label: "PLL Only"  },
                        ] as { id: Filter; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleFilterChange(opt.id)}
                          className="relative flex-1 py-2 px-1 rounded-md cursor-pointer"
                        >
                          <span className="font-bold invisible text-[9px]">{opt.label}</span>
                          <span
                            className={`absolute inset-0 flex items-center justify-center font-heading text-[9px] leading-none transition-colors duration-300 ${
                              filter === opt.id ? "font-bold" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                            style={filter === opt.id ? { color: activeFilterColor } : undefined}
                          >
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className="w-full flex flex-col gap-2 p-5 rounded"
                    style={{
                      backgroundColor: "#080810",
                      border: "1px solid rgba(255,213,0,0.1)",
                    }}
                  >
                    <span className="font-heading text-[9px] text-zinc-600 tracking-widest mb-1">
                      HOW IT WORKS
                    </span>
                    {[
                      `1. A case diagram appears with its algorithm`,
                      `2. You have ${SHOW_SECONDS} seconds to memorize it`,
                      `3. The algorithm hides — type it from memory`,
                      `4. Correct answers earn +${XP_PER_CORRECT} XP`,
                    ].map((line) => (
                      <p
                        key={line}
                        className="font-sans text-zinc-400 text-[13px] text-left leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-[9px] text-zinc-600">
                      {pool.length} CASES
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span className="font-heading text-[9px] text-zinc-600">
                      RANDOMIZED ORDER
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  className="font-heading text-[11px] leading-none px-10 py-4 cursor-pointer transition-all active:translate-y-[2px]"
                  style={{
                    backgroundColor: "#FFD500",
                    color: "#0d0d14",
                    boxShadow: "0 4px 0px #a38a00",
                  }}
                >
                  START TRAINING
                </button>
              </>
            )}
          </div>
        )}

        {/* ── SHOWING — algorithm visible with countdown ── */}
        {phase === "showing" && currentCase && (
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="flex items-center justify-between w-full">
              <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
                MEMORIZE THIS
              </span>
              <KindBadge kind={currentCase.kind} />
            </div>

            <h2
              className="font-heading text-white text-center"
              style={{ fontSize: "clamp(13px, 2vw, 18px)" }}
            >
              {currentCase.name}
            </h2>

            <DiagramBox c={currentCase} />

            {/* Algorithm display */}
            <div
              className="w-full flex flex-col items-center gap-2 p-5 rounded"
              style={{
                backgroundColor: "#080810",
                border: "1px solid rgba(255,213,0,0.15)",
              }}
            >
              <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                ALGORITHM
              </span>
              <p className="font-mono text-[#FFD700] text-lg tracking-widest text-center leading-relaxed">
                {currentCase.alg}
              </p>
            </div>

            {/* Countdown bar */}
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                  TIME TO MEMORIZE
                </span>
                <span className="font-heading text-[9px] text-zinc-400">
                  {timeLeft}s
                </span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(timeLeft / SHOW_SECONDS) * 100}%`,
                    backgroundColor: timeLeft <= 2 ? "#C41E3A" : "#FFD500",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── RECALL — user types the algorithm ── */}
        {phase === "recall" && currentCase && (
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="flex items-center justify-between w-full">
              <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
                TYPE FROM MEMORY
              </span>
              <KindBadge kind={currentCase.kind} />
            </div>

            <h2
              className="font-heading text-white text-center"
              style={{ fontSize: "clamp(13px, 2vw, 18px)" }}
            >
              {currentCase.name}
            </h2>

            <DiagramBox c={currentCase} />

            {/* Input area */}
            <div className="w-full flex flex-col gap-3">
              <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
                YOUR ANSWER
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="R U R' U' ..."
                className="w-full font-mono text-white text-base py-3 px-4 rounded outline-none"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(255,255,255,0.1)",
                  caretColor: "#FFD500",
                }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="w-full font-heading text-[11px] leading-none py-4 transition-all active:translate-y-[2px] disabled:opacity-40 disabled:cursor-default disabled:active:translate-y-0"
                style={{
                  backgroundColor: "#FFD500",
                  color: "#0d0d14",
                  boxShadow: input.trim() ? "0 4px 0px #a38a00" : "none",
                  cursor: input.trim() ? "pointer" : "default",
                }}
              >
                CHECK ANSWER
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT — feedback and next ── */}
        {phase === "result" && currentCase && isCorrect !== null && (
          <div className="flex flex-col items-center gap-6 p-8">
            {/* Verdict banner */}
            <div
              className="w-full flex items-center justify-between px-4 py-3 rounded"
              style={{
                backgroundColor: isCorrect
                  ? "rgba(0,155,72,0.1)"
                  : "rgba(196,30,58,0.1)",
                border: `1px solid ${
                  isCorrect ? "rgba(0,155,72,0.3)" : "rgba(196,30,58,0.3)"
                }`,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-heading text-base leading-none"
                  style={{ color: isCorrect ? "#009B48" : "#C41E3A" }}
                >
                  {isCorrect ? "✓" : "✗"}
                </span>
                <span
                  className="font-heading text-[11px] tracking-widest leading-none"
                  style={{ color: isCorrect ? "#009B48" : "#C41E3A" }}
                >
                  {isCorrect ? "CORRECT" : "INCORRECT"}
                </span>
              </div>
              {isCorrect && (
                <span
                  className="font-heading text-[9px] leading-none px-2 py-1.5"
                  style={{
                    color: "#FFD500",
                    border: "1px solid rgba(255,213,0,0.3)",
                  }}
                >
                  {xpStatus === "awarded"
                    ? `+${XP_PER_CORRECT} XP`
                    : xpStatus === "no_auth"
                      ? "SIGN IN TO EARN XP"
                      : xpStatus === "pending"
                        ? "AWARDING..."
                        : ""}
                </span>
              )}
            </div>

            <h2
              className="font-heading text-white text-center"
              style={{ fontSize: "clamp(13px, 2vw, 18px)" }}
            >
              {currentCase.name}
            </h2>

            <DiagramBox c={currentCase} />

            {/* Answer comparison */}
            <div
              className="w-full flex flex-col gap-3 p-4 rounded"
              style={{
                backgroundColor: "#080810",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                  YOUR ANSWER
                </span>
                <p
                  className="font-mono text-sm tracking-wide leading-relaxed"
                  style={{ color: isCorrect ? "#009B48" : "#C41E3A" }}
                >
                  {input || (
                    <span className="text-zinc-600 italic font-sans">
                      empty
                    </span>
                  )}
                </p>
              </div>
              {!isCorrect && (
                <div
                  className="flex flex-col gap-1 pt-3 mt-1"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                    CORRECT
                  </span>
                  <p className="font-mono text-sm text-[#FFD700] tracking-wide leading-relaxed">
                    {currentCase.alg}
                  </p>
                </div>
              )}
            </div>

            {/* Next action */}
            {isCycleDone ? (
              <div className="w-full flex flex-col gap-4">
                <div
                  className="w-full flex flex-col items-center gap-2 py-4 px-6 rounded text-center"
                  style={{
                    backgroundColor: "rgba(255,213,0,0.05)",
                    border: "1px solid rgba(255,213,0,0.18)",
                  }}
                >
                  <span className="font-heading text-[11px] text-[#FFD500] tracking-widest">
                    ★ CYCLE COMPLETE
                  </span>
                  <p className="font-sans text-zinc-500 text-xs">
                    All {pool.length} cases done.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSeen([]);
                    setPhase("idle");
                  }}
                  className="w-full font-heading text-[11px] leading-none py-4 cursor-pointer transition-all active:translate-y-[2px]"
                  style={{
                    backgroundColor: "#FFD500",
                    color: "#0d0d14",
                    boxShadow: "0 4px 0px #a38a00",
                  }}
                >
                  START NEW CYCLE
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="w-full font-heading text-[11px] leading-none py-4 cursor-pointer transition-all active:translate-y-[2px]"
                style={{
                  backgroundColor: "#FFD500",
                  color: "#0d0d14",
                  boxShadow: "0 4px 0px #a38a00",
                }}
              >
                NEXT CASE →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
