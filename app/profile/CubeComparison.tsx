"use client";

import { useState, useEffect, useRef } from "react";
import { getCubeStats, type Cube, type CubeStats } from "@/app/cubes/actions";
import { formatTime } from "@/lib/rank";

const EMPTY_STATS: CubeStats = { totalSolves: 0, bestSingle: null, ao5: null, ao12: null };

function CubeDropdown({
  cubes,
  value,
  onChange,
  exclude,
  placeholder,
}: {
  cubes: Cube[];
  value: string | null;
  onChange: (id: string | null) => void;
  exclude: string | null;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = cubes.find((c) => c.id === value);
  const available = cubes.filter((c) => c.id !== exclude);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full font-heading text-[10px] tracking-widest px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors"
        style={{
          backgroundColor: "#0d0d14",
          border: value ? "1px solid rgba(255,213,0,0.35)" : "1px solid rgba(255,255,255,0.1)",
          color: value ? "#FFD500" : "rgba(255,255,255,0.3)",
        }}
      >
        <span className="flex-1 text-left truncate">{selected ? selected.name.toUpperCase() : placeholder}</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 8, lineHeight: 1, position: "relative", top: 2 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          className="absolute z-50 w-full"
          style={{ border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", backgroundColor: "#0d0d14" }}
        >
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className="w-full text-left font-heading text-[10px] tracking-widest px-4 py-2 transition-colors"
            style={{ color: !value ? "#FFD500" : "rgba(255,255,255,0.35)" }}
          >
            {placeholder}
          </button>
          {available.length > 0 && (
            <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", margin: "2px 0" }} />
          )}
          {available.map((c) => (
            <button
              key={c.id}
              onClick={() => { onChange(c.id); setOpen(false); }}
              className="w-full text-left font-heading text-[10px] tracking-widest px-4 py-2 transition-colors"
              style={{
                color: c.id === value ? "#FFD500" : "rgba(255,255,255,0.45)",
                backgroundColor: c.id === value ? "rgba(255,213,0,0.05)" : "transparent",
              }}
            >
              {c.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type StatRow = {
  label: string;
  aVal: string;
  bVal: string;
  // "a" wins, "b" wins, or "tie"
  winner: "a" | "b" | "tie" | null;
};

function buildRows(a: CubeStats, b: CubeStats): StatRow[] {
  function cmp(aMs: number | null, bMs: number | null, lowerWins: boolean): "a" | "b" | "tie" | null {
    if (aMs === null && bMs === null) return null;
    if (aMs === null) return "b";
    if (bMs === null) return "a";
    if (aMs === bMs) return "tie";
    return lowerWins ? (aMs < bMs ? "a" : "b") : (aMs > bMs ? "a" : "b");
  }

  return [
    {
      label: "TOTAL SOLVES",
      aVal: a.totalSolves > 0 ? String(a.totalSolves) : "—",
      bVal: b.totalSolves > 0 ? String(b.totalSolves) : "—",
      winner: cmp(a.totalSolves || null, b.totalSolves || null, false),
    },
    {
      label: "BEST SINGLE",
      aVal: a.bestSingle !== null ? formatTime(a.bestSingle) : "—",
      bVal: b.bestSingle !== null ? formatTime(b.bestSingle) : "—",
      winner: cmp(a.bestSingle, b.bestSingle, true),
    },
    {
      label: "AO5",
      aVal: a.ao5 !== null ? formatTime(a.ao5) : "—",
      bVal: b.ao5 !== null ? formatTime(b.ao5) : "—",
      winner: cmp(a.ao5, b.ao5, true),
    },
    {
      label: "AO12",
      aVal: a.ao12 !== null ? formatTime(a.ao12) : "—",
      bVal: b.ao12 !== null ? formatTime(b.ao12) : "—",
      winner: cmp(a.ao12, b.ao12, true),
    },
  ];
}

export default function CubeComparison({ cubes }: { cubes: Cube[] }) {
  const [cubeA, setCubeA] = useState<string | null>(cubes[0]?.id ?? null);
  const [cubeB, setCubeB] = useState<string | null>(cubes[1]?.id ?? null);
  const [statsA, setStatsA] = useState<CubeStats>(EMPTY_STATS);
  const [statsB, setStatsB] = useState<CubeStats>(EMPTY_STATS);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  useEffect(() => {
    if (!cubeA) { setStatsA(EMPTY_STATS); return; }
    setLoadingA(true);
    getCubeStats(cubeA).then((s) => { setStatsA(s); setLoadingA(false); });
  }, [cubeA]);

  useEffect(() => {
    if (!cubeB) { setStatsB(EMPTY_STATS); return; }
    setLoadingB(true);
    getCubeStats(cubeB).then((s) => { setStatsB(s); setLoadingB(false); });
  }, [cubeB]);

  const loading = loadingA || loadingB;
  const bothSelected = cubeA !== null && cubeB !== null;
  const rows = bothSelected ? buildRows(statsA, statsB) : [];

  const cubeAName = cubes.find((c) => c.id === cubeA)?.name ?? "";
  const cubeBName = cubes.find((c) => c.id === cubeB)?.name ?? "";

  // Count wins per side
  const aWins = rows.filter((r) => r.winner === "a").length;
  const bWins = rows.filter((r) => r.winner === "b").length;

  return (
    <div className="flex flex-col gap-5 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
      <span className="font-heading text-[9px] text-zinc-600 tracking-widest">HEAD-TO-HEAD</span>

      {/* Cube selectors */}
      <div className="flex items-center gap-3">
        <CubeDropdown
          cubes={cubes}
          value={cubeA}
          onChange={setCubeA}
          exclude={cubeB}
          placeholder="SELECT CUBE A"
        />
        <span className="font-heading text-[10px] text-zinc-700 shrink-0">VS</span>
        <CubeDropdown
          cubes={cubes}
          value={cubeB}
          onChange={setCubeB}
          exclude={cubeA}
          placeholder="SELECT CUBE B"
        />
      </div>

      {/* Need at least 2 cubes */}
      {cubes.length < 2 && (
        <p className="font-sans text-xs text-zinc-600">Add at least 2 cubes to compare them head-to-head.</p>
      )}

      {/* Comparison table */}
      {bothSelected && (
        <div className="flex flex-col">
          {/* Header row */}
          <div
            className="grid items-center py-3 px-4 mb-1"
            style={{ gridTemplateColumns: "1fr auto 1fr", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span
              className="font-heading text-sm truncate"
              style={{ color: aWins > bWins ? "#FFD500" : "rgba(255,255,255,0.5)" }}
            >
              {cubeAName}
              {aWins > bWins && <span className="ml-2 text-[8px]">★</span>}
            </span>
            <span className="font-heading text-[8px] text-zinc-700 tracking-widest text-center w-24">STAT</span>
            <span
              className="font-heading text-sm truncate text-right"
              style={{ color: bWins > aWins ? "#FFD500" : "rgba(255,255,255,0.5)" }}
            >
              {bWins > aWins && <span className="mr-2 text-[8px]">★</span>}
              {cubeBName}
            </span>
          </div>

          {/* Stat rows */}
          {loading ? (
            <div className="py-8 text-center">
              <span className="font-heading text-[9px] text-zinc-700 tracking-widest">LOADING...</span>
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row.label}
                className="grid items-center py-3 px-4"
                style={{
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: "1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {/* Cube A value */}
                <div className="flex items-center gap-2">
                  <span
                    className="font-heading text-base leading-none"
                    style={{
                      color: row.winner === "a" ? "#FFD500"
                           : row.winner === "tie" ? "rgba(255,255,255,0.5)"
                           : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {row.aVal}
                  </span>
                  {row.winner === "a" && (
                    <div style={{ width: 4, height: 4, backgroundColor: "#FFD500", boxShadow: "0 0 6px #FFD500", flexShrink: 0 }} />
                  )}
                </div>

                {/* Label */}
                <span className="font-heading text-[8px] text-zinc-600 tracking-widest text-center w-24">{row.label}</span>

                {/* Cube B value */}
                <div className="flex items-center gap-2 justify-end">
                  {row.winner === "b" && (
                    <div style={{ width: 4, height: 4, backgroundColor: "#FFD500", boxShadow: "0 0 6px #FFD500", flexShrink: 0 }} />
                  )}
                  <span
                    className="font-heading text-base leading-none"
                    style={{
                      color: row.winner === "b" ? "#FFD500"
                           : row.winner === "tie" ? "rgba(255,255,255,0.5)"
                           : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {row.bVal}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Win summary */}
          {!loading && bothSelected && (aWins > 0 || bWins > 0) && (
            <div
              className="flex items-center justify-between px-4 pt-4 mt-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="font-heading text-[9px] tracking-widest" style={{ color: aWins >= bWins ? "#FFD500" : "rgba(255,255,255,0.2)" }}>
                {aWins} WIN{aWins !== 1 ? "S" : ""}
              </span>
              <span className="font-heading text-[8px] text-zinc-700 tracking-widest">
                {aWins === bWins ? "TIED" : aWins > bWins ? `${cubeAName.toUpperCase()} LEADS` : `${cubeBName.toUpperCase()} LEADS`}
              </span>
              <span className="font-heading text-[9px] tracking-widest" style={{ color: bWins >= aWins ? "#FFD500" : "rgba(255,255,255,0.2)" }}>
                {bWins} WIN{bWins !== 1 ? "S" : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
