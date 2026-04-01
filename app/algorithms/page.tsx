"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  OLL_CASES,
  PLL_CASES,
  type OLLCase as FullOLLCase,
  type PLLCase as FullPLLCase,
} from "./data";
import { createClient } from "@/lib/supabase/client";
import { F2L_CASES, type F2LCase } from "./f2l-data";
import dynamic from "next/dynamic";
import type F2LDiagramType from "@/app/components/F2LDiagram";

const F2LDiagram = dynamic<React.ComponentProps<typeof F2LDiagramType>>(
  () => import("@/app/components/F2LDiagram"),
  { ssr: false }
);

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "oll-pll" | "full-oll" | "full-pll" | "f2l" | "favorites";
export type S = "Y" | "G";

export interface DiagramProps {
  top: [S, S, S, S, S, S, S, S, S];
  back: [S, S, S];
  front: [S, S, S];
  left: [S, S, S];
  right: [S, S, S];
}

export interface OLLCase {
  name: string;
  diagram: DiagramProps;
  alg: string;
}

// ── Favorites ─────────────────────────────────────────────────────────────────

interface FavoritesCtx {
  isFavorited: (key: string) => boolean;
  toggle: (key: string) => void;
  size: number;
}

const FavoritesContext = React.createContext<FavoritesCtx>({
  isFavorited: () => false,
  toggle: () => {},
  size: 0,
});

function useFavorites(): FavoritesCtx {
  const [keys, setKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cubemaxxed:favorites");
      if (stored) setKeys(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  function toggle(key: string) {
    setKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem("cubemaxxed:favorites", JSON.stringify([...next]));
      return next;
    });
  }

  return { isFavorited: (k) => keys.has(k), toggle, size: keys.size };
}

// ── Achievements ──────────────────────────────────────────────────────────────

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "2look-done",
    name: "2-Look Done",
    description: "Learned all 16 two-look OLL & PLL cases.",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none" shapeRendering="crispEdges">
        <rect x="11" y="4"  width="6" height="20" fill="#FFD700" rx="1" />
        <rect x="4"  y="11" width="20" height="6"  fill="#FFD700" rx="1" />
      </svg>
    ),
  },
  {
    id: "yellow-face",
    name: "Yellow Face",
    description: "Learned all 57 full OLL cases.",
    icon: (
      <svg viewBox="0 0 28 28" width="28" height="28" fill="none">
        {[0, 1, 2].flatMap((row) =>
          [0, 1, 2].map((col) => (
            <rect key={`${row}-${col}`} x={4 + col * 8} y={4 + row * 8} width="6" height="6" rx="1" fill="#FFD700" />
          ))
        )}
      </svg>
    ),
  },
  {
    id: "last-layer",
    name: "Last Layer",
    description: "Learned all 21 full PLL cases.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0051A2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
  {
    id: "full-send",
    name: "Full Send",
    description: "Learned every OLL and PLL algorithm. Incredible.",
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF5800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 20h14" />
      </svg>
    ),
  },
];

function checkAchievements(keys: Set<string>): string[] {
  const earned: string[] = [];

  const twoLookKeys = [
    ...EDGE_ORI.map((c) => `2l-oll-${c.name}`),
    ...CORNER_ORI.map((c) => `2l-oll-${c.name}`),
    ...CORNER_PERM.map((c) => `2l-pll-${c.name}`),
    ...EDGE_PERM.map((c) => `2l-pll-${c.name}`),
  ];
  if (twoLookKeys.every((k) => keys.has(k))) earned.push("2look-done");
  if (OLL_CASES.every((c) => keys.has(`full-oll-${c.id}`))) earned.push("yellow-face");
  if (PLL_CASES.every((c) => keys.has(`full-pll-${c.id}`))) earned.push("last-layer");
  if (
    [...twoLookKeys, ...OLL_CASES.map((c) => `full-oll-${c.id}`), ...PLL_CASES.map((c) => `full-pll-${c.id}`)].every(
      (k) => keys.has(k)
    )
  )
    earned.push("full-send");

  return earned;
}

// ── Progress ──────────────────────────────────────────────────────────────────

interface ProgressCtx {
  isLearned: (key: string) => boolean;
  toggle: (key: string) => void;
  isAuthenticated: boolean;
  pendingAchievement: Achievement | null;
  dismissAchievement: () => void;
}

const ProgressContext = React.createContext<ProgressCtx>({
  isLearned: () => false,
  toggle: () => {},
  isAuthenticated: false,
  pendingAchievement: null,
  dismissAchievement: () => {},
});

function useProgress(): ProgressCtx {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const earnedIdsRef = useRef<Set<string>>(new Set());
  const userIdRef = useRef<string | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cubemaxxed:learned");
      if (stored) setKeys(new Set(JSON.parse(stored) as string[]));
    } catch {}

    try {
      const earned = localStorage.getItem("cubemaxxed:achievements");
      if (earned) earnedIdsRef.current = new Set(JSON.parse(earned) as string[]);
    } catch {}

    const supabase = createClient();
    supabaseRef.current = supabase;
    supabase.auth.getUser().then(({ data }) => {
      userIdRef.current = data.user?.id ?? null;
      setIsAuthenticated(!!data.user);
    });
  }, []);

  function toggle(key: string) {
    setKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem("cubemaxxed:learned", JSON.stringify([...next]));

      const nowEarned = checkAchievements(next);
      const newlyEarned = nowEarned.filter((id) => !earnedIdsRef.current.has(id));
      if (newlyEarned.length > 0) {
        newlyEarned.forEach((id) => earnedIdsRef.current.add(id));
        localStorage.setItem("cubemaxxed:achievements", JSON.stringify([...earnedIdsRef.current]));

        // Persist to Supabase if the user is signed in
        if (userIdRef.current && supabaseRef.current) {
          const uid = userIdRef.current;
          const db = supabaseRef.current;
          newlyEarned.forEach((id) => {
            db.from("user_achievements").insert({ user_id: uid, achievement_id: id }).then(() => {});
          });
        }

        const achievement = ACHIEVEMENTS.find((a) => a.id === newlyEarned[0]);
        if (achievement) setPendingAchievement(achievement);
      }

      return next;
    });
  }

  return {
    isLearned: (k) => keys.has(k),
    toggle,
    isAuthenticated,
    pendingAchievement,
    dismissAchievement: () => setPendingAchievement(null),
  };
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

export function CaseDiagram({ top, back, front, left, right, compact }: DiagramProps & { compact?: boolean }) {
  const cell = compact ? 20 : 28;
  const side = compact ? 7 : 10;
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

export const EDGE_ORI: OLLCase[] = [
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

export const CORNER_ORI: OLLCase[] = [
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

// ── AlgDisplay — inline editable algorithm with localStorage persistence ──────

function AlgDisplay({ defaultAlg, caseKey, align = "center" }: { defaultAlg: string; caseKey: string; align?: "center" | "start" }) {
  const { isFavorited, toggle: toggleFav } = React.useContext(FavoritesContext);
  const { isLearned, toggle: toggleLearned, isAuthenticated } = React.useContext(ProgressContext);
  const storageKey = `cubemaxxed:alg:${caseKey}`;
  const [custom, setCustom] = useState<string | null>(() => typeof window !== "undefined" ? localStorage.getItem(storageKey) : null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const favorited = isFavorited(caseKey);
  const learned = isLearned(caseKey);

  const alg = custom ?? defaultAlg;
  const isCustom = custom !== null;

  function startEdit() {
    setDraft(alg);
    setIsEditing(true);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === defaultAlg) {
      localStorage.removeItem(storageKey);
      setCustom(null);
    } else {
      localStorage.setItem(storageKey, trimmed);
      setCustom(trimmed);
    }
    setIsEditing(false);
  }

  function resetAlg(e: React.MouseEvent) {
    e.stopPropagation();
    localStorage.removeItem(storageKey);
    setCustom(null);
  }

  function copy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(alg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
          if (e.key === "Escape") { e.preventDefault(); setIsEditing(false); }
        }}
        className="font-mono text-xs tracking-wide text-center w-full bg-[#1a1a2e] border border-zinc-600 rounded-md px-2 py-1 text-[#FFD700] focus:outline-none focus:border-yellow-500/60 transition-colors"
      />
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={copy}
        title="Copy algorithm"
        className={`font-mono text-xs tracking-wide text-center leading-relaxed cursor-pointer transition-colors duration-150 w-full ${copied ? "text-green-400" : isCustom ? "text-yellow-300 hover:text-white" : "text-[#FFD700] hover:text-white"}`}
      >
        {copied ? "COPIED!" : alg}
      </button>
      <div className={`flex items-center gap-2 mt-2 ${align === "center" ? "justify-center" : ""}`}>
        {isCustom && (
          <button
            onClick={resetAlg}
            title="Reset to default"
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
        <button
          onClick={startEdit}
          title="Edit algorithm"
          className="text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFav(caseKey); }}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`transition-colors ${favorited ? "text-yellow-400 hover:text-yellow-300" : "text-zinc-500 hover:text-zinc-200"}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) { window.location.href = "/auth/login"; return; }
            toggleLearned(caseKey);
          }}
          title={!isAuthenticated ? "Sign in to track progress" : learned ? "Mark as not learned" : "Mark as learned"}
          className={`transition-colors ${learned ? "text-green-400 hover:text-green-300" : "text-zinc-500 hover:text-zinc-200"}`}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {learned
              ? <><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></>
              : <><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" strokeOpacity="0.3" /></>
            }
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Card & Section (2-Look OLL) ───────────────────────────────────────────────

function CaseCard({ c, compact }: { c: OLLCase; compact?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] hover:border-zinc-600 hover:bg-[#0d0d18] hover:scale-[1.02] transition-all duration-150 ${compact ? "pt-4 px-4 pb-8" : "pt-7 px-7 pb-8"}`}>
      <p className="font-heading text-white text-[11px] leading-snug text-center">
        {c.name}
      </p>
      <div className={`rounded-lg bg-[#13131f] border border-zinc-800 flex items-center justify-center ${compact ? "p-2" : "p-3"}`}>
        <CaseDiagram {...c.diagram} compact={compact} />
      </div>
      <AlgDisplay defaultAlg={c.alg} caseKey={`2l-oll-${c.name}`} />
    </div>
  );
}

function Section({ title, cases, cols = "auto" }: { title: string; cases: OLLCase[]; cols?: "3" | "auto" }) {
  const compact = cols === "3";
  const { isLearned } = React.useContext(ProgressContext);
  const learnedCount = cases.filter((c) => isLearned(`2l-oll-${c.name}`)).length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-400 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.1] relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-green-500/50 transition-all duration-500 rounded-full"
            style={{ width: `${(learnedCount / cases.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-[9px] text-zinc-500 whitespace-nowrap" suppressHydrationWarning>
          {learnedCount}/{cases.length}
        </span>
      </div>
      <div className={compact ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"}>
        {cases.map((c) => (
          <CaseCard key={c.name} c={c} compact={compact} />
        ))}
      </div>
    </div>
  );
}

// ── PLL Types & Colors ────────────────────────────────────────────────────────

export type PColor = "Y" | "R" | "G" | "O" | "B";

const PLL_COLORS: Record<PColor, string> = {
  Y: "#FFD500",
  R: "#C41E3A",
  G: "#009B48",
  O: "#FF5800",
  B: "#0051A2",
};

export interface PLLDiagramProps {
  top: [PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor, PColor];
  back: [PColor, PColor, PColor];
  front: [PColor, PColor, PColor];
  left: [PColor, PColor, PColor];
  right: [PColor, PColor, PColor];
}

export interface PLLCase {
  name: string;
  diagram: PLLDiagramProps;
  alg: string;
}

function psty(c: PColor): React.CSSProperties {
  return { backgroundColor: PLL_COLORS[c], borderRadius: 2 };
}

export function PLLCaseDiagram({ top, back, front, left, right, compact }: PLLDiagramProps & { compact?: boolean }) {
  const cell = compact ? 20 : 28;
  const side = compact ? 7 : 10;
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

export const CORNER_PERM: PLLCase[] = [
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

export const EDGE_PERM: PLLCase[] = [
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

function PLLCaseCard({ c, compact }: { c: PLLCase; compact?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] hover:border-zinc-600 hover:bg-[#0d0d18] hover:scale-[1.02] transition-all duration-150 ${compact ? "pt-4 px-4 pb-8" : "pt-7 px-7 pb-8"}`}>
      <p className="font-heading text-white text-[11px] leading-snug text-center">
        {c.name}
      </p>
      <div className={`rounded-lg bg-[#13131f] border border-zinc-800 flex items-center justify-center ${compact ? "p-2" : "p-3"}`}>
        <PLLCaseDiagram {...c.diagram} compact={compact} />
      </div>
      <AlgDisplay defaultAlg={c.alg} caseKey={`2l-pll-${c.name}`} />
    </div>
  );
}

function PLLSection({ title, cases, cols = "auto" }: { title: string; cases: PLLCase[]; cols?: "3" | "auto" }) {
  const compact = cols === "3";
  const { isLearned } = React.useContext(ProgressContext);
  const learnedCount = cases.filter((c) => isLearned(`2l-pll-${c.name}`)).length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-400 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.1] relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-green-500/50 transition-all duration-500 rounded-full"
            style={{ width: `${(learnedCount / cases.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-[9px] text-zinc-500 whitespace-nowrap" suppressHydrationWarning>
          {learnedCount}/{cases.length}
        </span>
      </div>
      <div className={compact ? "grid grid-cols-3 gap-3" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"}>
        {cases.map((c) => (
          <PLLCaseCard key={c.name} c={c} compact={compact} />
        ))}
      </div>
    </div>
  );
}

// ── Full OLL Components ───────────────────────────────────────────────────────

function FullOLLCard({ c }: { c: FullOLLCase }) {
  return (
    <div className="relative flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] pt-7 px-7 pb-8 hover:border-zinc-600 hover:bg-[#0d0d18] hover:scale-[1.02] transition-all duration-150">
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
      <AlgDisplay defaultAlg={c.alg} caseKey={`full-oll-${c.id}`} />
    </div>
  );
}

function FullOLLSection({ title, cases }: { title: string; cases: FullOLLCase[] }) {
  const { isLearned } = React.useContext(ProgressContext);
  const learnedCount = cases.filter((c) => isLearned(`full-oll-${c.id}`)).length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-400 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.1] relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-green-500/50 transition-all duration-500 rounded-full"
            style={{ width: `${(learnedCount / cases.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-[9px] text-zinc-500 whitespace-nowrap" suppressHydrationWarning>
          {learnedCount}/{cases.length}
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
    <div className="relative flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-[#0a0a11] pt-7 px-7 pb-8 hover:border-zinc-600 hover:bg-[#0d0d18] hover:scale-[1.02] transition-all duration-150">
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
      <AlgDisplay defaultAlg={c.alg} caseKey={`full-pll-${c.id}`} />
    </div>
  );
}

function FullPLLSection({ title, cases }: { title: string; cases: FullPLLCase[] }) {
  const { isLearned } = React.useContext(ProgressContext);
  const learnedCount = cases.filter((c) => isLearned(`full-pll-${c.id}`)).length;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-heading text-[9px] text-zinc-400 tracking-widest whitespace-nowrap">
          {title.toUpperCase()}
        </span>
        <div className="flex-1 h-px bg-white/[0.1] relative overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-green-500/50 transition-all duration-500 rounded-full"
            style={{ width: `${(learnedCount / cases.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-[9px] text-zinc-500 whitespace-nowrap" suppressHydrationWarning>
          {learnedCount}/{cases.length}
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

// ── Achievement Toast ─────────────────────────────────────────────────────────

function AchievementToast({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(onDismiss, 5000);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-4 bg-[#0d0d18] border border-zinc-700 rounded-2xl p-4 shadow-2xl w-80 transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#13131f] border border-zinc-700 flex items-center justify-center shrink-0">
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-[9px] text-zinc-500 tracking-widest">ACHIEVEMENT UNLOCKED</p>
        <p className="font-heading text-white text-sm mt-0.5">{achievement.name}</p>
        <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{achievement.description}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-0.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ── Favorites Tab ─────────────────────────────────────────────────────────────

function FavoritesTab() {
  const { isFavorited } = React.useContext(FavoritesContext);

  const fav2LOLL  = [...EDGE_ORI, ...CORNER_ORI].filter((c) => isFavorited(`2l-oll-${c.name}`));
  const fav2LPLL  = [...CORNER_PERM, ...EDGE_PERM].filter((c) => isFavorited(`2l-pll-${c.name}`));
  const favFullOLL = OLL_CASES.filter((c) => isFavorited(`full-oll-${c.id}`));
  const favFullPLL = PLL_CASES.filter((c) => isFavorited(`full-pll-${c.id}`));
  const favF2L = F2L_CASES.filter((c) => isFavorited(`f2l-${c.id}`));
  const total = fav2LOLL.length + fav2LPLL.length + favFullOLL.length + favFullPLL.length + favF2L.length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0a0a11] border border-zinc-800 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <p className="font-heading text-zinc-300 text-sm">No favorites yet</p>
          <p className="text-zinc-600 text-xs mt-2 max-w-[22rem] leading-relaxed">
            Star any algorithm from the other tabs to save it here for quick reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {fav2LOLL.length  > 0 && <Section        title="2-Look OLL" cases={fav2LOLL}  />}
      {fav2LPLL.length  > 0 && <PLLSection     title="2-Look PLL" cases={fav2LPLL}  />}
      {favFullOLL.length > 0 && <FullOLLSection title="Full OLL"   cases={favFullOLL} />}
      {favFullPLL.length > 0 && <FullPLLSection title="Full PLL"   cases={favFullPLL} />}
      {favF2L.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="font-heading text-[10px] text-zinc-300 tracking-widest whitespace-nowrap">F2L</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favF2L.map((c) => <F2LCaseCard key={c.id} c={c} />)}
          </div>
        </div>
      )}
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
  { id: "oll-pll",   label: "2-Look OLL + PLL" },
  { id: "full-oll",  label: "Full OLL"          },
  { id: "full-pll",  label: "Full PLL"          },
  { id: "f2l",       label: "F2L"               },
  { id: "favorites", label: "Favorites"         },
];

// ── F2L ───────────────────────────────────────────────────────────────────────

function F2LCaseCard({ c }: { c: F2LCase }) {
  return (
    <div className="flex flex-row items-center gap-4 bg-[#0a0a11] border border-zinc-800 rounded-lg p-3">
      <div className="shrink-0">
        <F2LDiagram stickerColors={c.stickerColors} size={80} />
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <span className="font-heading text-[9px] text-zinc-500 tracking-widest">{c.name.toUpperCase()}</span>
        <AlgDisplay defaultAlg={c.alg} caseKey={`f2l-${c.id}`} align="start" />
      </div>
    </div>
  );
}

function F2LTab() {
  const sections = Array.from(new Map(F2L_CASES.map((c) => [c.section, c.section])).keys());
  return (
    <div className="flex flex-col gap-16">
      {sections.map((section, si) => {
        const groups = Array.from(new Map(
          F2L_CASES.filter((c) => c.section === section).map((c) => [c.group, c.group])
        ).keys());
        return (
          <div key={section} className="flex flex-col gap-10">
            {/* Section header */}
            <div className="flex items-center gap-4">
              <span className="font-heading text-[10px] text-zinc-300 tracking-widest whitespace-nowrap">
                {section.toUpperCase()}
              </span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
            {/* Groups within section */}
            {groups.map((group) => {
              const cases = F2L_CASES.filter((c) => c.group === group);
              const showHeader = group !== section;
              return (
                <div key={group} className="flex flex-col gap-5">
                  {showHeader && (
                    <div className="font-heading text-[9px] text-zinc-500 tracking-widest border-b border-white/[0.05] pb-3">
                      {group.toUpperCase()}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cases.map((c) => (
                      <F2LCaseCard key={c.id} c={c} />
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Section divider (not after last section) */}
            {si < sections.length - 1 && (
              <div className="h-px bg-white/[0.04] mt-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CUBE_COLORS = ["#C41E3A", "#0051A2", "#009B48", "#FF5800", "#FFD500", "#ffffff"];

function randomCubeColor(exclude?: string) {
  const options = CUBE_COLORS.filter((c) => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

export default function Algorithms() {
  const favorites = useFavorites();
  const progress = useProgress();
  const [tab, setTab] = useState<Tab>("oll-pll");

  useEffect(() => {
    const saved = localStorage.getItem("cubemaxxed:alg-tab");
    const valid: Tab[] = ["oll-pll", "full-oll", "full-pll", "f2l", "favorites"];
    if (saved && (valid as string[]).includes(saved)) setTab(saved as Tab);
  }, []);
  const [activeColor, setActiveColor] = useState(() => randomCubeColor());
  const [search, setSearch] = useState("");

  const ollGroups = groupBy(
    search.trim() ? OLL_CASES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : OLL_CASES,
    "group",
  );
  const pllGroups = groupBy(
    search.trim() ? PLL_CASES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : PLL_CASES,
    "group",
  );

  return (
    <>
    <ProgressContext.Provider value={progress}>
    <FavoritesContext.Provider value={favorites}>
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
          REFERENCE
        </span>
        <h1 className="font-heading text-white text-xl leading-snug mt-2">
          ALGORITHMS
        </h1>
        <p className="text-zinc-400 text-sm mt-2" suppressHydrationWarning>
          {tab === "oll-pll"   && "2-Look OLL + PLL — orient and permute the last layer in four steps."}
          {tab === "full-oll"  && "Full OLL — all 57 orientation cases."}
          {tab === "full-pll"  && "Full PLL — all 21 permutation cases."}
          {tab === "f2l"       && "F2L — all 41 cases for inserting corner-edge pairs into the first two layers."}
          {tab === "favorites" && "Your starred algorithms — one place for the cases you're drilling."}
        </p>
        <p className="font-heading text-[9px] text-zinc-600 tracking-widest mt-3">
          {OLL_CASES.length} OLL · {PLL_CASES.length} PLL · {EDGE_ORI.length + CORNER_ORI.length + CORNER_PERM.length + EDGE_PERM.length} 2-LOOK
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#0a0a11] border border-zinc-800 rounded-lg p-1 w-fit mb-10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              const next = randomCubeColor(activeColor);
              setActiveColor(next);
              setTab(t.id);
              setSearch("");
              localStorage.setItem("cubemaxxed:alg-tab", t.id);
            }}
            className={`relative px-5 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 ${
              tab === t.id ? "bg-[#13131f] border border-zinc-700 shadow-sm" : "border border-transparent"
            }`}
          >
            <span className="font-bold invisible">{t.label}</span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                tab === t.id ? "font-bold" : "font-medium text-zinc-400 hover:text-zinc-100"
              }`}
              style={tab === t.id ? { color: activeColor } : undefined}
              suppressHydrationWarning
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div suppressHydrationWarning>

      {/* 2-Look OLL + PLL side by side */}
      {tab === "oll-pll" && (
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
          {/* OLL column — far left */}
          <div className="flex flex-col gap-10 lg:w-[46%]">
            <div className="font-heading text-[9px] text-zinc-500 tracking-widest border-b border-white/[0.05] pb-3">
              2-LOOK OLL
            </div>
            <Section title="Edge Orientation — Yellow Cross" cases={EDGE_ORI} cols="3" />
            <Section title="Corner Orientation — Full Yellow Face" cases={CORNER_ORI} cols="3" />
          </div>
          {/* Vertical divider */}
          <div className="hidden lg:block w-px bg-white/[0.06] self-stretch" />
          {/* PLL column — far right */}
          <div className="flex flex-col gap-10 lg:w-[46%]">
            <div className="font-heading text-[9px] text-zinc-500 tracking-widest border-b border-white/[0.05] pb-3">
              2-LOOK PLL
            </div>
            <PLLSection title="Corner Permutation" cases={CORNER_PERM} cols="3" />
            <PLLSection title="Edge Permutation" cases={EDGE_PERM} cols="3" />
          </div>
        </div>
      )}

      {/* Full OLL */}
      {tab === "full-oll" && (
        <div className="flex flex-col gap-10">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search OLL cases..."
            className="w-full max-w-xs bg-[#0a0a11] border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {ollGroups.length === 0 ? (
            <p className="text-zinc-600 text-sm">No cases match &quot;{search}&quot;.</p>
          ) : (
            <div className="flex flex-col gap-12">
              {ollGroups.map(([group, cases]) => (
                <FullOLLSection key={group} title={group} cases={cases} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full PLL */}
      {tab === "full-pll" && (
        <div className="flex flex-col gap-10">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PLL cases..."
            className="w-full max-w-xs bg-[#0a0a11] border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {pllGroups.length === 0 ? (
            <p className="text-zinc-600 text-sm">No cases match &quot;{search}&quot;.</p>
          ) : (
            <div className="flex flex-col gap-12">
              {pllGroups.map(([group, cases]) => (
                <FullPLLSection key={group} title={group} cases={cases} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* F2L */}
      {tab === "f2l" && <F2LTab />}

      {/* Favorites */}
      {tab === "favorites" && <FavoritesTab />}

      </div>{/* end tab content */}
    </div>
    </FavoritesContext.Provider>
    </ProgressContext.Provider>

    {/* Achievement toast */}
    {progress.pendingAchievement && (
      <AchievementToast
        achievement={progress.pendingAchievement}
        onDismiss={progress.dismissAchievement}
      />
    )}
    </>
  );
}
