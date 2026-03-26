"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PixelIcon } from "@/app/components/PixelIcon";
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

const CUBE_COLORS = [
  "#C41E3A",
  "#0051A2",
  "#009B48",
  "#FF5800",
  "#FFD500",
  "#ffffff",
];

function randomCubeColor(exclude?: string) {
  const options = CUBE_COLORS.filter((c) => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

// ── Types ─────────────────────────────────────────────────────────────────────

type TrainerCase =
  | { kind: "oll"; name: string; diagram: DiagramProps; alg: string }
  | { kind: "pll"; name: string; diagram: PLLDiagramProps; alg: string };

type Phase = "idle" | "showing" | "recall" | "result";
type CRPhase = "idle" | "choosing" | "result";
type SBPhase = "idle" | "building" | "result";
type SRPhase = "idle" | "playing" | "result";
type XpStatus = "idle" | "pending" | "awarded" | "no_auth";
type Filter = "both" | "oll" | "pll";
type Mode = "flash" | "recognition" | "sequence" | "speed";
type MoveToken = { id: number; move: string; used: boolean };

const SR_XP_FAST = 15; // < 3s
const SR_XP_MID = 8; // < 6s
const SR_XP_SLOW = 3; // >= 6s

function srXpForTime(ms: number): number {
  if (ms < 3000) return SR_XP_FAST;
  if (ms < 6000) return SR_XP_MID;
  return SR_XP_SLOW;
}

// ── Case pool ─────────────────────────────────────────────────────────────────

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

function normalize(alg: string): string {
  return alg.trim().split(/\s+/).join(" ");
}

function pickRandom(pool: TrainerCase[], seen: string[]): TrainerCase | null {
  const remaining = pool.filter((c) => !seen.includes(c.name));
  if (!remaining.length) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}

// Picks 3 wrong options from the same kind as `correct`. Never mixes OLL/PLL.
function pickWrongOptions(
  correct: TrainerCase,
  pool: TrainerCase[],
): TrainerCase[] {
  const sameKind = pool.filter(
    (c) => c.kind === correct.kind && c.name !== correct.name,
  );
  return [...sameKind].sort(() => Math.random() - 0.5).slice(0, 3);
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function KindBadge({ kind }: { kind: "oll" | "pll" }) {
  const isOll = kind === "oll";
  return (
    <span
      className="font-heading text-[9px] px-2 py-1 leading-none"
      style={{
        color: isOll ? "#FFD500" : "#4a90d9",
        border: `1px solid ${isOll ? "rgba(255,213,0,0.4)" : "rgba(74,144,217,0.4)"}`,
        backgroundColor: isOll
          ? "rgba(255,213,0,0.08)"
          : "rgba(74,144,217,0.08)",
      }}
    >
      {kind.toUpperCase()}
    </span>
  );
}

function DiagramBox({ c }: { c: TrainerCase }) {
  const isOll = c.kind === "oll";
  return (
    <div
      className="p-5 flex items-center justify-center"
      style={{
        backgroundColor: "#0e0e1a",
        border: `1px solid ${isOll ? "rgba(255,213,0,0.2)" : "rgba(74,144,217,0.2)"}`,
        boxShadow: `0 0 24px ${isOll ? "rgba(255,213,0,0.04)" : "rgba(74,144,217,0.06)"}`,
      }}
    >
      {c.kind === "oll" ? (
        <CaseDiagram {...c.diagram} />
      ) : (
        <PLLCaseDiagram {...c.diagram} />
      )}
    </div>
  );
}

// Compact clickable option card for Case Recognition
type OptionState = "default" | "correct" | "wrong" | "missed" | "dim";

function OptionCard({
  c,
  state,
  onClick,
  disabled,
}: {
  c: TrainerCase;
  state: OptionState;
  onClick: () => void;
  disabled: boolean;
}) {
  const borderColor =
    state === "correct"
      ? "#009B48"
      : state === "wrong"
        ? "#C41E3A"
        : state === "missed"
          ? "rgba(0,155,72,0.5)"
          : state === "dim"
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.08)";

  const bgColor =
    state === "correct"
      ? "rgba(0,155,72,0.08)"
      : state === "wrong"
        ? "rgba(196,30,58,0.08)"
        : state === "missed"
          ? "rgba(0,155,72,0.04)"
          : "#0a0a11";

  const shadow =
    state === "correct"
      ? "0 0 20px rgba(0,155,72,0.2)"
      : state === "wrong"
        ? "0 0 20px rgba(196,30,58,0.15)"
        : "none";

  const labelColor =
    state === "correct"
      ? "#009B48"
      : state === "missed"
        ? "rgba(0,155,72,0.7)"
        : "#C41E3A";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center gap-3 p-4 transition-all duration-200"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        opacity: state === "dim" ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {c.kind === "oll" ? (
        <CaseDiagram {...c.diagram} compact />
      ) : (
        <PLLCaseDiagram {...c.diagram} compact />
      )}
      {(state === "correct" || state === "wrong" || state === "missed") && (
        <span
          className="font-heading text-[9px] leading-none tracking-widest"
          style={{ color: labelColor }}
        >
          {state === "correct"
            ? `✓ ${c.name}`
            : state === "missed"
              ? `✓ ${c.name}`
              : `✗ ${c.name}`}
        </span>
      )}
    </button>
  );
}

// Step bullet colors for the idle how-it-works list
const STEP_COLORS = ["#FF5800", "#FFD500", "#0051A2", "#009B48"];

function FilterToggle({
  filter,
  activeFilterColor,
  onFilterChange,
  maxW,
}: {
  filter: Filter;
  activeFilterColor: string;
  onFilterChange: (f: Filter) => void;
  maxW?: string;
}) {
  return (
    <div
      className="flex gap-1 p-1"
      style={{
        backgroundColor: "#080810",
        border: "1px solid rgba(255,255,255,0.07)",
        width: "100%",
        maxWidth: maxW,
      }}
    >
      {(
        [
          { id: "both", label: "OLL + PLL" },
          { id: "oll", label: "OLL Only" },
          { id: "pll", label: "PLL Only" },
        ] as { id: Filter; label: string }[]
      ).map((opt) => (
        <button
          key={opt.id}
          onClick={() => onFilterChange(opt.id)}
          className="relative flex-1 py-2 px-1 cursor-pointer"
        >
          <span className="font-bold invisible text-[9px]">{opt.label}</span>
          <span
            className={`absolute inset-0 flex items-center justify-center font-heading text-[9px] leading-none transition-colors duration-300 ${
              filter === opt.id
                ? "font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
            style={filter === opt.id ? { color: activeFilterColor } : undefined}
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

const MODE_META: {
  id: Mode;
  label: string;
  icon: import("@/app/components/PixelIcon").PixelIconName;
  color: string;
  desc: string;
}[] = [
  {
    id: "flash",
    label: "FLASH & RECALL",
    icon: "clock",
    color: "#FF5800",
    desc: "Memorize, then type it",
  },
  {
    id: "recognition",
    label: "CASE RECOGNITION",
    icon: "algdiamond",
    color: "#4a90d9",
    desc: "Algorithm → diagram",
  },
  {
    id: "sequence",
    label: "SEQUENCE BUILDER",
    icon: "book",
    color: "#009B48",
    desc: "Click moves in order",
  },
  {
    id: "speed",
    label: "SPEED RECOGNITION",
    icon: "lightning",
    color: "#FFD500",
    desc: "Diagram → name fast",
  },
];

function ModeSwitcher({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MODE_META.map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onModeChange(opt.id)}
            className="flex flex-col gap-2.5 p-4 text-left cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: active ? `${opt.color}0d` : "#080810",
              border: `1px solid ${active ? `${opt.color}40` : "rgba(255,255,255,0.06)"}`,
              borderLeft: `3px solid ${active ? opt.color : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: active ? opt.color : "rgba(255,255,255,0.25)" }}>
                <PixelIcon name={opt.icon} size={14} />
              </span>
              {active && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: opt.color,
                    boxShadow: `0 0 8px ${opt.color}`,
                  }}
                />
              )}
            </div>
            <span
              className="font-heading text-[8px] tracking-widest leading-relaxed"
              style={{ color: active ? opt.color : "rgba(255,255,255,0.35)" }}
            >
              {opt.label}
            </span>
            <span
              className="font-sans text-xs leading-snug"
              style={{
                color: active
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.18)",
              }}
            >
              {opt.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Shared idle panel ──────────────────────────────────────────────────────────

function IdlePanel({
  pool,
  isCycleDone,
  filter,
  activeFilterColor,
  onFilterChange,
  onStart,
  howItWorksSteps,
  rightLabel,
}: {
  pool: TrainerCase[];
  isCycleDone: boolean;
  filter: Filter;
  activeFilterColor: string;
  onFilterChange: (f: Filter) => void;
  onStart: () => void;
  howItWorksSteps: string[];
  rightLabel: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-10 p-10"
      style={{ minHeight: 480 }}
    >
      {isCycleDone ? (
        <>
          <div className="flex flex-col items-center gap-4 text-center">
            <span
              className="font-heading text-4xl text-[#FFD500]"
              style={{ textShadow: "0 0 28px rgba(255,213,0,0.6)" }}
            >
              ★
            </span>
            <span className="font-heading text-[12px] text-[#FFD500] tracking-widest">
              CYCLE COMPLETE
            </span>
            <p className="font-sans text-zinc-400 text-sm max-w-xs leading-relaxed">
              You&apos;ve drilled all {pool.length} cases. Change the set below
              or start a new cycle.
            </p>
          </div>
          <FilterToggle
            filter={filter}
            activeFilterColor={activeFilterColor}
            onFilterChange={onFilterChange}
            maxW="320px"
          />
          <button
            onClick={onStart}
            className="font-heading text-[11px] leading-none px-12 py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
        <>
          <div className="flex flex-col items-center gap-6 text-center w-full max-w-md">
            <div className="flex flex-col gap-2.5 w-full">
              <span className="font-heading text-[9px] text-zinc-600 tracking-widest text-left">
                CASE SET
              </span>
              <FilterToggle
                filter={filter}
                activeFilterColor={activeFilterColor}
                onFilterChange={onFilterChange}
              />
            </div>

            <div
              className="w-full flex flex-col gap-4 p-6"
              style={{
                backgroundColor: "#080810",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
                HOW IT WORKS
              </span>
              {howItWorksSteps.map((line, i) => (
                <div key={line} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 font-heading text-[8px] leading-none mt-[2px] w-4 h-4 flex items-center justify-center"
                    style={{
                      backgroundColor: STEP_COLORS[i],
                      color: "#0d0d14",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="font-sans text-zinc-300 text-sm text-left leading-relaxed">
                    {line}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-heading text-[9px] text-zinc-500">
                {pool.length} CASES
              </span>
              <span className="text-zinc-700">·</span>
              <span className="font-heading text-[9px] text-zinc-500">
                {rightLabel}
              </span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="font-heading text-[11px] leading-none px-12 py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MemoryTrainer() {
  // ── Shared state ──────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>("flash");
  const [filter, setFilter] = useState<Filter>("both");
  const [activeFilterColor, setActiveFilterColor] = useState(() =>
    randomCubeColor(),
  );

  // ── Flash & Recall state ──────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentCase, setCurrentCase] = useState<TrainerCase | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(SHOW_SECONDS);
  const [xpStatus, setXpStatus] = useState<XpStatus>("idle");

  // ── Case Recognition state ────────────────────────────────────────────────
  const [crPhase, setCrPhase] = useState<CRPhase>("idle");
  const [crCurrentCase, setCrCurrentCase] = useState<TrainerCase | null>(null);
  const [crOptions, setCrOptions] = useState<TrainerCase[]>([]);
  const [crSeen, setCrSeen] = useState<string[]>([]);
  const [crSelected, setCrSelected] = useState<string | null>(null);
  const [crIsCorrect, setCrIsCorrect] = useState<boolean | null>(null);
  const [crXpStatus, setCrXpStatus] = useState<XpStatus>("idle");

  // ── Speed Recognition state ───────────────────────────────────────────────
  const [srPhase, setSrPhase] = useState<SRPhase>("idle");
  const [srCurrentCase, setSrCurrentCase] = useState<TrainerCase | null>(null);
  const [srOptions, setSrOptions] = useState<TrainerCase[]>([]);
  const [srSeen, setSrSeen] = useState<string[]>([]);
  const [srSelected, setSrSelected] = useState<string | null>(null);
  const [srIsCorrect, setSrIsCorrect] = useState<boolean | null>(null);
  const [srXpStatus, setSrXpStatus] = useState<XpStatus>("idle");
  const [srReactionMs, setSrReactionMs] = useState<number | null>(null);
  const [srSessionTimes, setSrSessionTimes] = useState<number[]>([]);
  const srStartTimeRef = useRef<number>(0);

  // ── Sequence Builder state ────────────────────────────────────────────────
  const [sbPhase, setSbPhase] = useState<SBPhase>("idle");
  const [sbCurrentCase, setSbCurrentCase] = useState<TrainerCase | null>(null);
  const [sbMoveTokens, setSbMoveTokens] = useState<MoveToken[]>([]);
  const [sbBuilt, setSbBuilt] = useState<string[]>([]);
  const [sbSeen, setSbSeen] = useState<string[]>([]);
  const [sbIsCorrect, setSbIsCorrect] = useState<boolean | null>(null);
  const [sbXpStatus, setSbXpStatus] = useState<XpStatus>("idle");

  const inputRef = useRef<HTMLInputElement>(null);

  const pool = getPool(filter);
  const isCycleDone = seen.length === pool.length;
  const crIsCycleDone = crSeen.length === pool.length;
  const sbIsCycleDone = sbSeen.length === pool.length;
  const srIsCycleDone = srSeen.length === pool.length;
  const srSessionAvgMs =
    srSessionTimes.length > 0
      ? srSessionTimes.reduce((a, b) => a + b, 0) / srSessionTimes.length
      : null;

  // Phase accent colors
  const phaseColor =
    phase === "showing"
      ? "#FF5800"
      : phase === "recall"
        ? "#4a90d9"
        : phase === "result"
          ? isCorrect
            ? "#009B48"
            : "#C41E3A"
          : "#FFD500";

  const phaseBgTint =
    phase === "showing"
      ? "rgba(255,88,0,0.025)"
      : phase === "recall"
        ? "rgba(74,144,217,0.03)"
        : phase === "result"
          ? isCorrect
            ? "rgba(0,155,72,0.03)"
            : "rgba(196,30,58,0.03)"
          : "transparent";

  const crPhaseColor =
    crPhase === "choosing"
      ? "#4a90d9"
      : crPhase === "result"
        ? crIsCorrect
          ? "#009B48"
          : "#C41E3A"
        : "#FFD500";

  const crPhaseBgTint =
    crPhase === "choosing"
      ? "rgba(74,144,217,0.025)"
      : crPhase === "result"
        ? crIsCorrect
          ? "rgba(0,155,72,0.03)"
          : "rgba(196,30,58,0.03)"
        : "transparent";

  const sbPhaseColor =
    sbPhase === "building"
      ? "#009B48"
      : sbPhase === "result"
        ? sbIsCorrect
          ? "#009B48"
          : "#C41E3A"
        : "#FFD500";

  const sbPhaseBgTint =
    sbPhase === "building"
      ? "rgba(0,155,72,0.025)"
      : sbPhase === "result"
        ? sbIsCorrect
          ? "rgba(0,155,72,0.03)"
          : "rgba(196,30,58,0.03)"
        : "transparent";

  const srPhaseColor =
    srPhase === "playing"
      ? "#FF5800"
      : srPhase === "result"
        ? srIsCorrect
          ? "#009B48"
          : "#C41E3A"
        : "#FFD500";

  const srPhaseBgTint =
    srPhase === "playing"
      ? "rgba(255,88,0,0.025)"
      : srPhase === "result"
        ? srIsCorrect
          ? "rgba(0,155,72,0.03)"
          : "rgba(196,30,58,0.03)"
        : "transparent";

  // ── FR Timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "showing") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("recall");
          return SHOW_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ── FR Auto-focus input ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "recall") inputRef.current?.focus();
  }, [phase]);

  // ── FR Game actions ───────────────────────────────────────────────────────

  function frBeginRound(seenList: string[], activPool = pool) {
    const next = pickRandom(activPool, seenList);
    if (!next) return;
    setCurrentCase(next);
    setInput("");
    setIsCorrect(null);
    setXpStatus("idle");
    setTimeLeft(SHOW_SECONDS);
    setPhase("showing");
  }

  function frHandleStart() {
    if (isCycleDone) {
      setSeen([]);
      frBeginRound([], pool);
    } else {
      frBeginRound(seen, pool);
    }
  }

  async function frHandleSubmit() {
    if (!currentCase || phase !== "recall") return;
    const correct = normalize(input) === normalize(currentCase.alg);
    setIsCorrect(correct);
    setSeen((prev) => [...prev, currentCase.name]);
    setPhase("result");
    if (correct) {
      setXpStatus("pending");
      const res = await awardMemoryXP(XP_PER_CORRECT, currentCase.name);
      setXpStatus("error" in res ? "no_auth" : "awarded");
    }
  }

  function frHandleNext() {
    frBeginRound(seen, pool);
  }

  function frHandleExit() {
    setPhase("idle");
    setCurrentCase(null);
    setInput("");
    setIsCorrect(null);
    setXpStatus("idle");
  }

  // ── CR Game actions ───────────────────────────────────────────────────────

  function crBeginRound(seenList: string[], activPool = pool) {
    const next = pickRandom(activPool, seenList);
    if (!next) return;
    const wrongs = pickWrongOptions(next, activPool);
    setCrCurrentCase(next);
    setCrOptions(shuffleArray([next, ...wrongs]));
    setCrSelected(null);
    setCrIsCorrect(null);
    setCrXpStatus("idle");
    setCrPhase("choosing");
  }

  function crHandleStart() {
    if (crIsCycleDone) {
      setCrSeen([]);
      crBeginRound([], pool);
    } else {
      crBeginRound(crSeen, pool);
    }
  }

  async function crHandleSelect(selected: TrainerCase) {
    if (!crCurrentCase || crPhase !== "choosing") return;
    const correct = selected.name === crCurrentCase.name;
    setCrSelected(selected.name);
    setCrIsCorrect(correct);
    setCrSeen((prev) => [...prev, crCurrentCase.name]);
    setCrPhase("result");
    if (correct) {
      setCrXpStatus("pending");
      const res = await awardMemoryXP(XP_PER_CORRECT, crCurrentCase.name);
      setCrXpStatus("error" in res ? "no_auth" : "awarded");
    }
  }

  function crHandleNext() {
    crBeginRound(crSeen, pool);
  }

  function crHandleExit() {
    setCrPhase("idle");
    setCrCurrentCase(null);
    setCrOptions([]);
    setCrSelected(null);
    setCrIsCorrect(null);
    setCrXpStatus("idle");
  }

  // ── SB Game actions ───────────────────────────────────────────────────────

  function sbBeginRound(seenList: string[], activPool = pool) {
    const next = pickRandom(activPool, seenList);
    if (!next) return;
    const algTokens = next.alg.trim().split(/\s+/);
    const tokens: MoveToken[] = algTokens.map((move, i) => ({
      id: i,
      move,
      used: false,
    }));
    setSbCurrentCase(next);
    setSbMoveTokens([...tokens].sort(() => Math.random() - 0.5));
    setSbBuilt([]);
    setSbIsCorrect(null);
    setSbXpStatus("idle");
    setSbPhase("building");
  }

  function sbHandleStart() {
    if (sbIsCycleDone) {
      setSbSeen([]);
      sbBeginRound([], pool);
    } else {
      sbBeginRound(sbSeen, pool);
    }
  }

  async function sbHandleClick(token: MoveToken) {
    if (!sbCurrentCase || sbPhase !== "building" || token.used) return;
    const thisCase = sbCurrentCase;
    const algTokens = thisCase.alg.trim().split(/\s+/);
    const expectedMove = algTokens[sbBuilt.length];

    setSbMoveTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, used: true } : t)),
    );

    if (token.move !== expectedMove) {
      setSbIsCorrect(false);
      setSbSeen((prev) => [...prev, thisCase.name]);
      setSbPhase("result");
      return;
    }

    const newBuilt = [...sbBuilt, token.move];
    setSbBuilt(newBuilt);

    if (newBuilt.length === algTokens.length) {
      setSbIsCorrect(true);
      setSbSeen((prev) => [...prev, thisCase.name]);
      setSbPhase("result");
      setSbXpStatus("pending");
      const res = await awardMemoryXP(XP_PER_CORRECT, thisCase.name);
      setSbXpStatus("error" in res ? "no_auth" : "awarded");
    }
  }

  function sbHandleNext() {
    sbBeginRound(sbSeen, pool);
  }

  function sbHandleExit() {
    setSbPhase("idle");
    setSbCurrentCase(null);
    setSbMoveTokens([]);
    setSbBuilt([]);
    setSbIsCorrect(null);
    setSbXpStatus("idle");
  }

  // ── SR Game actions ───────────────────────────────────────────────────────

  function srBeginRound(seenList: string[], activPool = pool) {
    const next = pickRandom(activPool, seenList);
    if (!next) return;
    const wrongs = pickWrongOptions(next, activPool);
    setSrCurrentCase(next);
    setSrOptions(shuffleArray([next, ...wrongs]));
    setSrSelected(null);
    setSrIsCorrect(null);
    setSrXpStatus("idle");
    setSrReactionMs(null);
    srStartTimeRef.current = Date.now();
    setSrPhase("playing");
  }

  function srHandleStart() {
    if (srIsCycleDone) {
      setSrSeen([]);
      setSrSessionTimes([]);
      srBeginRound([], pool);
    } else {
      srBeginRound(srSeen, pool);
    }
  }

  function srHandleSelect(selected: TrainerCase, selectedAt: number) {
    if (!srCurrentCase || srPhase !== "playing") return;
    const theCase = srCurrentCase;
    const reactionMs = selectedAt - srStartTimeRef.current;
    const correct = selected.name === theCase.name;
    setSrSelected(selected.name);
    setSrIsCorrect(correct);
    setSrReactionMs(reactionMs);
    setSrSeen((prev) => [...prev, theCase.name]);
    setSrSessionTimes((prev) => [...prev, reactionMs]);
    setSrPhase("result");
    if (correct) {
      const xp = srXpForTime(reactionMs);
      setSrXpStatus("pending");
      awardMemoryXP(xp, theCase.name).then((res) => {
        setSrXpStatus("error" in res ? "no_auth" : "awarded");
      });
    }
  }

  function srHandleNext() {
    srBeginRound(srSeen, pool);
  }

  function srHandleExit() {
    setSrPhase("idle");
    setSrCurrentCase(null);
    setSrOptions([]);
    setSrSelected(null);
    setSrIsCorrect(null);
    setSrXpStatus("idle");
    setSrReactionMs(null);
  }

  // ── Filter change (shared — resets both modes to idle) ────────────────────

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setActiveFilterColor((prev) => randomCubeColor(prev));
    setSeen([]);
    setPhase("idle");
    setCrSeen([]);
    setCrPhase("idle");
    setSbSeen([]);
    setSbPhase("idle");
    setSrSeen([]);
    setSrPhase("idle");
    setSrSessionTimes([]);
  }

  // ── Mode change (exit active session, keep cycle progress) ────────────────

  function handleModeChange(m: Mode) {
    if (m === mode) return;
    setMode(m);
    // Reset whichever mode we're leaving
    if (mode === "flash") {
      setPhase("idle");
      setCurrentCase(null);
      setInput("");
      setIsCorrect(null);
      setXpStatus("idle");
    } else if (mode === "recognition") {
      setCrPhase("idle");
      setCrCurrentCase(null);
      setCrOptions([]);
      setCrSelected(null);
      setCrIsCorrect(null);
      setCrXpStatus("idle");
    } else if (mode === "sequence") {
      setSbPhase("idle");
      setSbCurrentCase(null);
      setSbMoveTokens([]);
      setSbBuilt([]);
      setSbIsCorrect(null);
      setSbXpStatus("idle");
    } else {
      setSrPhase("idle");
      setSrCurrentCase(null);
      setSrOptions([]);
      setSrSelected(null);
      setSrIsCorrect(null);
      setSrXpStatus("idle");
      setSrReactionMs(null);
    }
  }

  // ── Progress bar values for the active mode ───────────────────────────────
  const activeDoneCount =
    mode === "flash"
      ? seen.length
      : mode === "recognition"
        ? crSeen.length
        : mode === "sequence"
          ? sbSeen.length
          : srSeen.length;
  const activePhaseNotIdle =
    mode === "flash"
      ? phase !== "idle"
      : mode === "recognition"
        ? crPhase !== "idle"
        : mode === "sequence"
          ? sbPhase !== "idle"
          : srPhase !== "idle";
  const activePhaseColor =
    mode === "flash"
      ? phaseColor
      : mode === "recognition"
        ? crPhaseColor
        : mode === "sequence"
          ? sbPhaseColor
          : srPhaseColor;

  // ── Render ────────────────────────────────────────────────────────────────

  const activeMeta = MODE_META.find((m) => m.id === mode)!;

  return (
    <div
      className="mx-auto max-w-3xl w-full px-6 py-14 flex flex-col gap-8"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* ── Page header ── */}
      <div className="flex flex-col gap-6">
        <Link
          href="/algorithms"
          className="inline-flex items-center gap-2 font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
        >
          ← ALGORITHMS
        </Link>

        <div className="flex flex-col gap-2">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            MEMORY TRAINER
          </span>
          <h1
            className="font-heading leading-snug"
            style={{
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: activeMeta.color,
            }}
          >
            {activeMeta.label}
          </h1>
        </div>

        {/* Mode switcher — 2×2 grid */}
        <ModeSwitcher mode={mode} onModeChange={handleModeChange} />

        {/* Accent rule */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(to right, ${activeMeta.color}80, ${activeMeta.color}20, transparent)`,
          }}
        />
      </div>

      {/* ── Cycle progress bar ── */}
      {activePhaseNotIdle && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
              CYCLE PROGRESS
            </span>
            <span
              className="font-heading text-[10px]"
              style={{ color: activePhaseColor }}
            >
              {activeDoneCount} / {pool.length} CASES
            </span>
          </div>
          <div
            className="h-2.5 bg-zinc-800/60 overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(activeDoneCount / pool.length) * 100}%`,
                backgroundColor: activePhaseColor,
                boxShadow: `0 0 10px ${activePhaseColor}90`,
              }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FLASH & RECALL GAME CARD
      ══════════════════════════════════════════════════════════════════════ */}
      {mode === "flash" && (
        <div
          className="overflow-hidden"
          style={{
            minHeight: 520,
            backgroundColor: "#0a0a11",
            backgroundImage:
              phaseBgTint !== "transparent"
                ? `linear-gradient(${phaseBgTint}, ${phaseBgTint})`
                : undefined,
            borderTop: `3px solid #FF5800`,
            borderRight: `1px solid ${phaseColor}25`,
            borderBottom: `1px solid ${phaseColor}25`,
            borderLeft: `1px solid ${phaseColor}25`,
          }}
        >
          {/* ── FR IDLE ── */}
          {phase === "idle" && (
            <IdlePanel
              pool={pool}
              isCycleDone={isCycleDone}
              filter={filter}
              activeFilterColor={activeFilterColor}
              onFilterChange={handleFilterChange}
              onStart={frHandleStart}
              howItWorksSteps={[
                "A case diagram appears with its algorithm",
                `You have ${SHOW_SECONDS} seconds to memorize it`,
                "The algorithm hides — type it from memory",
                `Correct answers earn +${XP_PER_CORRECT} XP`,
              ]}
              rightLabel="RANDOMIZED ORDER"
            />
          )}

          {/* ── FR SHOWING ── */}
          {phase === "showing" && currentCase && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex items-center justify-between w-full">
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#FF5800" }}
                >
                  ▶ MEMORIZE THIS
                </span>
                <div className="flex items-center gap-3">
                  <KindBadge kind={currentCase.kind} />
                  <button
                    onClick={frHandleExit}
                    className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                  >
                    ✕ EXIT
                  </button>
                </div>
              </div>

              <h2
                className="font-heading text-white text-center"
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {currentCase.name}
              </h2>

              <DiagramBox c={currentCase} />

              <div
                className="w-full flex flex-col items-center gap-2 p-5"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(255,88,0,0.3)",
                  boxShadow: "0 0 20px rgba(255,88,0,0.06)",
                }}
              >
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#FF5800" }}
                >
                  ALGORITHM
                </span>
                <p
                  className="font-mono text-lg tracking-widest text-center leading-relaxed text-white"
                  style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                >
                  {currentCase.alg}
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                    TIME TO MEMORIZE
                  </span>
                  <span
                    className="font-heading text-[9px]"
                    style={{ color: timeLeft <= 2 ? "#C41E3A" : "#FF5800" }}
                  >
                    {timeLeft}s
                  </span>
                </div>
                <div className="h-3 bg-zinc-800/60 overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${(timeLeft / SHOW_SECONDS) * 100}%`,
                      backgroundColor: timeLeft <= 2 ? "#C41E3A" : "#FF5800",
                      boxShadow: `0 0 10px ${timeLeft <= 2 ? "rgba(196,30,58,0.7)" : "rgba(255,88,0,0.6)"}`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── FR RECALL ── */}
          {phase === "recall" && currentCase && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex items-center justify-between w-full">
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#4a90d9" }}
                >
                  ✦ TYPE FROM MEMORY
                </span>
                <div className="flex items-center gap-3">
                  <KindBadge kind={currentCase.kind} />
                  <button
                    onClick={frHandleExit}
                    className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                  >
                    ✕ EXIT
                  </button>
                </div>
              </div>

              <h2
                className="font-heading text-white text-center"
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {currentCase.name}
              </h2>

              <DiagramBox c={currentCase} />

              <div className="w-full flex flex-col gap-3">
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#4a90d9" }}
                >
                  YOUR ANSWER
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") frHandleSubmit();
                  }}
                  placeholder="R U R' U' ..."
                  className="w-full font-mono text-white text-base py-3 px-4 outline-none"
                  style={{
                    backgroundColor: "#080810",
                    border: "1px solid rgba(74,144,217,0.25)",
                    caretColor: "#4a90d9",
                    boxShadow: "0 0 12px rgba(74,144,217,0.05)",
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
                <button
                  onClick={frHandleSubmit}
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

          {/* ── FR RESULT ── */}
          {phase === "result" && currentCase && isCorrect !== null && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex justify-end w-full">
                <button
                  onClick={frHandleExit}
                  className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                >
                  ✕ EXIT
                </button>
              </div>

              <div
                className="w-full flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: isCorrect
                    ? "rgba(0,155,72,0.1)"
                    : "rgba(196,30,58,0.1)",
                  border: `1px solid ${isCorrect ? "rgba(0,155,72,0.35)" : "rgba(196,30,58,0.35)"}`,
                  boxShadow: `0 0 20px ${isCorrect ? "rgba(0,155,72,0.08)" : "rgba(196,30,58,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-heading text-xl leading-none"
                    style={{ color: isCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <span
                    className="font-heading text-[12px] tracking-widest leading-none"
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
                      border: "1px solid rgba(255,213,0,0.35)",
                      backgroundColor: "rgba(255,213,0,0.06)",
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
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {currentCase.name}
              </h2>

              <DiagramBox c={currentCase} />

              <div
                className="w-full flex flex-col gap-3 p-4"
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

              {isCycleDone ? (
                <div className="w-full flex flex-col gap-4">
                  <div
                    className="w-full flex flex-col items-center gap-2 py-4 px-6 text-center"
                    style={{
                      backgroundColor: "rgba(255,213,0,0.05)",
                      border: "1px solid rgba(255,213,0,0.2)",
                    }}
                  >
                    <span
                      className="font-heading text-[11px] text-[#FFD500] tracking-widest"
                      style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                    >
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
                    className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
                  onClick={frHandleNext}
                  className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SEQUENCE BUILDER GAME CARD
      ══════════════════════════════════════════════════════════════════════ */}
      {mode === "sequence" && (
        <div
          className="overflow-hidden"
          style={{
            minHeight: 520,
            backgroundColor: "#0a0a11",
            backgroundImage:
              sbPhaseBgTint !== "transparent"
                ? `linear-gradient(${sbPhaseBgTint}, ${sbPhaseBgTint})`
                : undefined,
            borderTop: `3px solid #009B48`,
            borderRight: `1px solid ${sbPhaseColor}25`,
            borderBottom: `1px solid ${sbPhaseColor}25`,
            borderLeft: `1px solid ${sbPhaseColor}25`,
          }}
        >
          {/* ── SB IDLE ── */}
          {sbPhase === "idle" && (
            <IdlePanel
              pool={pool}
              isCycleDone={sbIsCycleDone}
              filter={filter}
              activeFilterColor={activeFilterColor}
              onFilterChange={handleFilterChange}
              onStart={sbHandleStart}
              howItWorksSteps={[
                "A case diagram appears — study it",
                "All the algorithm moves appear as buttons in scrambled order",
                "Click each move in the correct sequence to build the algorithm",
                `Complete the full sequence correctly to earn +${XP_PER_CORRECT} XP`,
              ]}
              rightLabel="CLICK TO BUILD"
            />
          )}

          {/* ── SB BUILDING ── */}
          {sbPhase === "building" &&
            sbCurrentCase &&
            (() => {
              const algTokens = sbCurrentCase.alg.trim().split(/\s+/);
              return (
                <div className="flex flex-col items-center gap-8 p-10">
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="font-heading text-[9px] tracking-widest"
                      style={{ color: "#009B48" }}
                    >
                      ▶ BUILD THE SEQUENCE
                    </span>
                    <div className="flex items-center gap-3">
                      <KindBadge kind={sbCurrentCase.kind} />
                      <button
                        onClick={sbHandleExit}
                        className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                      >
                        ✕ EXIT
                      </button>
                    </div>
                  </div>

                  <h2
                    className="font-heading text-white text-center"
                    style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
                  >
                    {sbCurrentCase.name}
                  </h2>

                  <DiagramBox c={sbCurrentCase} />

                  {/* Running sequence display */}
                  <div
                    className="w-full flex flex-col gap-2 p-4"
                    style={{
                      backgroundColor: "#080810",
                      border: "1px solid rgba(0,155,72,0.2)",
                      minHeight: 64,
                    }}
                  >
                    <span
                      className="font-heading text-[9px] tracking-widest"
                      style={{ color: "#009B48" }}
                    >
                      YOUR SEQUENCE — {sbBuilt.length} / {algTokens.length}
                    </span>
                    <div className="flex flex-wrap gap-2 min-h-[28px] items-center">
                      {sbBuilt.length === 0 ? (
                        <span className="font-heading text-[9px] text-zinc-700">
                          click a move below to start...
                        </span>
                      ) : (
                        sbBuilt.map((move, i) => (
                          <span
                            key={i}
                            className="font-heading text-sm leading-none px-2 py-1.5"
                            style={{
                              color: "#009B48",
                              backgroundColor: "rgba(0,155,72,0.1)",
                              border: "1px solid rgba(0,155,72,0.35)",
                            }}
                          >
                            {move}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Scrambled move buttons */}
                  <div className="w-full flex flex-col gap-3">
                    <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                      AVAILABLE MOVES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sbMoveTokens.map((token) => (
                        <button
                          key={token.id}
                          onClick={() => sbHandleClick(token)}
                          disabled={token.used}
                          className="font-heading text-sm leading-none px-3 py-2.5 transition-all duration-150"
                          style={{
                            backgroundColor: token.used
                              ? "rgba(255,255,255,0.02)"
                              : "#0e0e1a",
                            border: token.used
                              ? "1px solid rgba(255,255,255,0.05)"
                              : "1px solid rgba(255,255,255,0.18)",
                            color: token.used
                              ? "rgba(255,255,255,0.15)"
                              : "#ffffff",
                            cursor: token.used ? "default" : "pointer",
                            boxShadow: token.used
                              ? "none"
                              : "0 2px 0px rgba(0,0,0,0.6)",
                            transform: "translateY(0)",
                          }}
                          onMouseEnter={(e) => {
                            if (!token.used)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor = "rgba(0,155,72,0.6)";
                          }}
                          onMouseLeave={(e) => {
                            if (!token.used)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor = "rgba(255,255,255,0.18)";
                          }}
                        >
                          {token.move}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* ── SB RESULT ── */}
          {sbPhase === "result" && sbCurrentCase && sbIsCorrect !== null && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex justify-end w-full">
                <button
                  onClick={sbHandleExit}
                  className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                >
                  ✕ EXIT
                </button>
              </div>

              {/* Verdict banner */}
              <div
                className="w-full flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: sbIsCorrect
                    ? "rgba(0,155,72,0.1)"
                    : "rgba(196,30,58,0.1)",
                  border: `1px solid ${sbIsCorrect ? "rgba(0,155,72,0.35)" : "rgba(196,30,58,0.35)"}`,
                  boxShadow: `0 0 20px ${sbIsCorrect ? "rgba(0,155,72,0.08)" : "rgba(196,30,58,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-heading text-xl leading-none"
                    style={{ color: sbIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {sbIsCorrect ? "✓" : "✗"}
                  </span>
                  <span
                    className="font-heading text-[12px] tracking-widest leading-none"
                    style={{ color: sbIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {sbIsCorrect ? "CORRECT" : "WRONG MOVE"}
                  </span>
                </div>
                {sbIsCorrect && (
                  <span
                    className="font-heading text-[9px] leading-none px-2 py-1.5"
                    style={{
                      color: "#FFD500",
                      border: "1px solid rgba(255,213,0,0.35)",
                      backgroundColor: "rgba(255,213,0,0.06)",
                    }}
                  >
                    {sbXpStatus === "awarded"
                      ? `+${XP_PER_CORRECT} XP`
                      : sbXpStatus === "no_auth"
                        ? "SIGN IN TO EARN XP"
                        : sbXpStatus === "pending"
                          ? "AWARDING..."
                          : ""}
                  </span>
                )}
              </div>

              <h2
                className="font-heading text-white text-center"
                style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
              >
                {sbCurrentCase.name}
              </h2>

              <DiagramBox c={sbCurrentCase} />

              {/* Sequence recap */}
              <div
                className="w-full flex flex-col gap-3 p-4"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {!sbIsCorrect && (
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                      YOUR SEQUENCE
                    </span>
                    <div className="flex flex-wrap gap-2 items-center min-h-[28px]">
                      {sbBuilt.map((move, i) => (
                        <span
                          key={i}
                          className="font-heading text-sm leading-none px-2 py-1.5"
                          style={{
                            color: "#C41E3A",
                            backgroundColor: "rgba(196,30,58,0.08)",
                            border: "1px solid rgba(196,30,58,0.3)",
                          }}
                        >
                          {move}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className="flex flex-col gap-1"
                  style={
                    !sbIsCorrect
                      ? {
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          paddingTop: 12,
                        }
                      : {}
                  }
                >
                  <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                    CORRECT ALGORITHM
                  </span>
                  <p className="font-mono text-sm text-[#FFD700] tracking-wide leading-relaxed">
                    {sbCurrentCase.alg}
                  </p>
                </div>
              </div>

              {/* Next action */}
              {sbIsCycleDone ? (
                <div className="w-full flex flex-col gap-4">
                  <div
                    className="w-full flex flex-col items-center gap-2 py-4 px-6 text-center"
                    style={{
                      backgroundColor: "rgba(255,213,0,0.05)",
                      border: "1px solid rgba(255,213,0,0.2)",
                    }}
                  >
                    <span
                      className="font-heading text-[11px] text-[#FFD500] tracking-widest"
                      style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                    >
                      ★ CYCLE COMPLETE
                    </span>
                    <p className="font-sans text-zinc-500 text-xs">
                      All {pool.length} cases done.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSbSeen([]);
                      setSbPhase("idle");
                    }}
                    className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
                  onClick={sbHandleNext}
                  className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CASE RECOGNITION GAME CARD
      ══════════════════════════════════════════════════════════════════════ */}
      {mode === "recognition" && (
        <div
          className="overflow-hidden"
          style={{
            minHeight: 520,
            backgroundColor: "#0a0a11",
            backgroundImage:
              crPhaseBgTint !== "transparent"
                ? `linear-gradient(${crPhaseBgTint}, ${crPhaseBgTint})`
                : undefined,
            borderTop: `3px solid #4a90d9`,
            borderRight: `1px solid ${crPhaseColor}25`,
            borderBottom: `1px solid ${crPhaseColor}25`,
            borderLeft: `1px solid ${crPhaseColor}25`,
          }}
        >
          {/* ── CR IDLE ── */}
          {crPhase === "idle" && (
            <IdlePanel
              pool={pool}
              isCycleDone={crIsCycleDone}
              filter={filter}
              activeFilterColor={activeFilterColor}
              onFilterChange={handleFilterChange}
              onStart={crHandleStart}
              howItWorksSteps={[
                "An algorithm is shown — read it carefully",
                "Four case diagrams appear as options",
                "Select the diagram that matches the algorithm",
                `Correct answers earn +${XP_PER_CORRECT} XP`,
              ]}
              rightLabel="4 OPTIONS PER ROUND"
            />
          )}

          {/* ── CR CHOOSING ── */}
          {crPhase === "choosing" && crCurrentCase && (
            <div className="flex flex-col gap-8 p-10">
              <div className="flex items-center justify-between w-full">
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#4a90d9" }}
                >
                  ◈ IDENTIFY THE CASE
                </span>
                <div className="flex items-center gap-3">
                  <KindBadge kind={crCurrentCase.kind} />
                  <button
                    onClick={crHandleExit}
                    className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                  >
                    ✕ EXIT
                  </button>
                </div>
              </div>

              {/* Algorithm to identify */}
              <div
                className="w-full flex flex-col items-center gap-2 p-5"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(74,144,217,0.3)",
                  boxShadow: "0 0 20px rgba(74,144,217,0.06)",
                }}
              >
                <span
                  className="font-heading text-[9px] tracking-widest"
                  style={{ color: "#4a90d9" }}
                >
                  ALGORITHM
                </span>
                <p
                  className="font-mono text-lg tracking-widest text-center leading-relaxed text-white"
                  style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                >
                  {crCurrentCase.alg}
                </p>
              </div>

              <span className="font-heading text-[9px] text-zinc-600 tracking-widest text-center">
                SELECT THE MATCHING DIAGRAM
              </span>

              {/* 2×2 option grid */}
              <div className="grid grid-cols-2 gap-3">
                {crOptions.map((opt) => (
                  <OptionCard
                    key={opt.name}
                    c={opt}
                    state="default"
                    onClick={() => crHandleSelect(opt)}
                    disabled={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── CR RESULT ── */}
          {crPhase === "result" && crCurrentCase && crIsCorrect !== null && (
            <div className="flex flex-col gap-8 p-10">
              <div className="flex justify-end w-full">
                <button
                  onClick={crHandleExit}
                  className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                >
                  ✕ EXIT
                </button>
              </div>

              {/* Verdict banner */}
              <div
                className="w-full flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: crIsCorrect
                    ? "rgba(0,155,72,0.1)"
                    : "rgba(196,30,58,0.1)",
                  border: `1px solid ${crIsCorrect ? "rgba(0,155,72,0.35)" : "rgba(196,30,58,0.35)"}`,
                  boxShadow: `0 0 20px ${crIsCorrect ? "rgba(0,155,72,0.08)" : "rgba(196,30,58,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-heading text-xl leading-none"
                    style={{ color: crIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {crIsCorrect ? "✓" : "✗"}
                  </span>
                  <span
                    className="font-heading text-[12px] tracking-widest leading-none"
                    style={{ color: crIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {crIsCorrect ? "CORRECT" : "INCORRECT"}
                  </span>
                </div>
                {crIsCorrect && (
                  <span
                    className="font-heading text-[9px] leading-none px-2 py-1.5"
                    style={{
                      color: "#FFD500",
                      border: "1px solid rgba(255,213,0,0.35)",
                      backgroundColor: "rgba(255,213,0,0.06)",
                    }}
                  >
                    {crXpStatus === "awarded"
                      ? `+${XP_PER_CORRECT} XP`
                      : crXpStatus === "no_auth"
                        ? "SIGN IN TO EARN XP"
                        : crXpStatus === "pending"
                          ? "AWARDING..."
                          : ""}
                  </span>
                )}
              </div>

              {/* Algorithm reminder */}
              <div
                className="w-full flex flex-col items-center gap-2 p-4"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                  ALGORITHM
                </span>
                <p className="font-mono text-base tracking-widest text-center leading-relaxed text-white">
                  {crCurrentCase.alg}
                </p>
              </div>

              {/* 2×2 option grid — revealed */}
              <div className="grid grid-cols-2 gap-3">
                {crOptions.map((opt) => {
                  const isTheCorrect = opt.name === crCurrentCase.name;
                  const wasSelected = opt.name === crSelected;
                  const state: OptionState =
                    isTheCorrect && wasSelected
                      ? "correct"
                      : !isTheCorrect && wasSelected
                        ? "wrong"
                        : isTheCorrect && !wasSelected
                          ? "missed"
                          : "dim";
                  return (
                    <OptionCard
                      key={opt.name}
                      c={opt}
                      state={state}
                      onClick={() => {}}
                      disabled={true}
                    />
                  );
                })}
              </div>

              {/* Next action */}
              {crIsCycleDone ? (
                <div className="flex flex-col gap-4">
                  <div
                    className="w-full flex flex-col items-center gap-2 py-4 px-6 text-center"
                    style={{
                      backgroundColor: "rgba(255,213,0,0.05)",
                      border: "1px solid rgba(255,213,0,0.2)",
                    }}
                  >
                    <span
                      className="font-heading text-[11px] text-[#FFD500] tracking-widest"
                      style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                    >
                      ★ CYCLE COMPLETE
                    </span>
                    <p className="font-sans text-zinc-500 text-xs">
                      All {pool.length} cases done.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCrSeen([]);
                      setCrPhase("idle");
                    }}
                    className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
                  onClick={crHandleNext}
                  className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SPEED RECOGNITION GAME CARD
      ══════════════════════════════════════════════════════════════════════ */}
      {mode === "speed" && (
        <div
          className="overflow-hidden"
          style={{
            minHeight: 520,
            backgroundColor: "#0a0a11",
            backgroundImage:
              srPhaseBgTint !== "transparent"
                ? `linear-gradient(${srPhaseBgTint}, ${srPhaseBgTint})`
                : undefined,
            borderTop: `3px solid #FFD500`,
            borderRight: `1px solid ${srPhaseColor}25`,
            borderBottom: `1px solid ${srPhaseColor}25`,
            borderLeft: `1px solid ${srPhaseColor}25`,
          }}
        >
          {/* ── SR IDLE ── */}
          {srPhase === "idle" && (
            <IdlePanel
              pool={pool}
              isCycleDone={srIsCycleDone}
              filter={filter}
              activeFilterColor={activeFilterColor}
              onFilterChange={handleFilterChange}
              onStart={srHandleStart}
              howItWorksSteps={[
                "A case diagram flashes on screen",
                "Four case name buttons appear — tap the correct one",
                "Faster answers earn more XP: under 3s = full, under 6s = partial",
                "Wrong answers earn no XP",
              ]}
              rightLabel="TIMED RECOGNITION"
            />
          )}

          {/* ── SR PLAYING ── */}
          {srPhase === "playing" && srCurrentCase && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span
                    className="font-heading text-[9px] tracking-widest inline-flex items-center gap-1"
                    style={{ color: "#FF5800" }}
                  >
                    <PixelIcon name="lightning" size={9} />
                    SPEED RECOGNITION
                  </span>
                  {srSessionAvgMs !== null && (
                    <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                      AVG {(srSessionAvgMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <KindBadge kind={srCurrentCase.kind} />
                  <button
                    onClick={srHandleExit}
                    className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                  >
                    ✕ EXIT
                  </button>
                </div>
              </div>

              <DiagramBox c={srCurrentCase} />

              {/* Name buttons — 2×2 grid */}
              <div className="w-full grid grid-cols-2 gap-3">
                {srOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => srHandleSelect(opt, Date.now())}
                    className="font-heading text-[10px] leading-none py-5 px-3 tracking-widest transition-all active:translate-y-[1px] cursor-pointer"
                    style={{
                      backgroundColor: "#080810",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#e0e0e0",
                    }}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>

              <span className="font-heading text-[8px] text-zinc-700 tracking-widest">
                TAP THE CORRECT CASE NAME
              </span>
            </div>
          )}

          {/* ── SR RESULT ── */}
          {srPhase === "result" && srCurrentCase && srIsCorrect !== null && (
            <div className="flex flex-col items-center gap-8 p-10">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  {srReactionMs !== null && (
                    <span
                      className="font-heading text-[9px] leading-none px-2 py-1.5"
                      style={{
                        color:
                          srReactionMs < 3000
                            ? "#FFD500"
                            : srReactionMs < 6000
                              ? "#FF5800"
                              : "#55556a",
                        border: `1px solid ${srReactionMs < 3000 ? "rgba(255,213,0,0.3)" : srReactionMs < 6000 ? "rgba(255,88,0,0.3)" : "rgba(85,85,106,0.3)"}`,
                      }}
                    >
                      {(srReactionMs / 1000).toFixed(2)}s
                    </span>
                  )}
                  {srIsCorrect && (
                    <span
                      className="font-heading text-[9px] leading-none px-2 py-1.5"
                      style={{
                        color: "#FFD500",
                        border: "1px solid rgba(255,213,0,0.35)",
                        backgroundColor: "rgba(255,213,0,0.06)",
                      }}
                    >
                      {srXpStatus === "awarded"
                        ? `+${srReactionMs !== null ? srXpForTime(srReactionMs) : 0} XP`
                        : srXpStatus === "no_auth"
                          ? "SIGN IN TO EARN XP"
                          : srXpStatus === "pending"
                            ? "AWARDING..."
                            : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={srHandleExit}
                  className="font-heading text-[9px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
                >
                  ✕ EXIT
                </button>
              </div>

              <div
                className="w-full flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: srIsCorrect
                    ? "rgba(0,155,72,0.1)"
                    : "rgba(196,30,58,0.1)",
                  border: `1px solid ${srIsCorrect ? "rgba(0,155,72,0.35)" : "rgba(196,30,58,0.35)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-heading text-xl leading-none"
                    style={{ color: srIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {srIsCorrect ? "✓" : "✗"}
                  </span>
                  <span
                    className="font-heading text-[12px] tracking-widest leading-none"
                    style={{ color: srIsCorrect ? "#009B48" : "#C41E3A" }}
                  >
                    {srIsCorrect ? "CORRECT" : "INCORRECT"}
                  </span>
                </div>
                {!srIsCorrect && srSelected && (
                  <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
                    you picked: {srSelected}
                  </span>
                )}
              </div>

              <DiagramBox c={srCurrentCase} />

              <div
                className="w-full flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: "#080810",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                  CORRECT CASE
                </span>
                <span className="font-heading text-[11px] text-white tracking-widest">
                  {srCurrentCase.name}
                </span>
              </div>

              {srSessionAvgMs !== null && (
                <div
                  className="w-full flex items-center justify-between px-4 py-3"
                  style={{
                    backgroundColor: "#080810",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
                    SESSION AVG REACTION
                  </span>
                  <span className="font-heading text-[11px] text-white tracking-widest">
                    {(srSessionAvgMs / 1000).toFixed(2)}s
                  </span>
                </div>
              )}

              {srIsCycleDone ? (
                <div className="w-full flex flex-col gap-4">
                  <div
                    className="w-full flex flex-col items-center gap-2 py-4 px-6 text-center"
                    style={{
                      backgroundColor: "rgba(255,213,0,0.05)",
                      border: "1px solid rgba(255,213,0,0.2)",
                    }}
                  >
                    <span
                      className="font-heading text-[11px] text-[#FFD500] tracking-widest"
                      style={{ textShadow: "0 0 12px rgba(255,213,0,0.4)" }}
                    >
                      ★ CYCLE COMPLETE
                    </span>
                    <p className="font-sans text-zinc-500 text-xs">
                      All {pool.length} cases done.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSrSeen([]);
                      setSrSessionTimes([]);
                      setSrPhase("idle");
                    }}
                    className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
                  onClick={srHandleNext}
                  className="w-full font-heading text-[11px] leading-none py-5 cursor-pointer transition-all active:translate-y-[2px]"
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
      )}
    </div>
  );
}
