"use client";

import { useState, useEffect, useRef } from "react";
import { RankBadge } from "./RankBadge";
import type { RankUpInfo } from "@/lib/rankup";

const DISMISS_MS = 6000;

// Fixed scatter destinations for pixel particles
const PARTICLES: { x: number; y: number; size: number; delay: number; dx: number; dy: number }[] = [
  { x: 18, y: 12, size: 4, delay: 0,    dx: -90,  dy: -70 },
  { x: 82, y: 15, size: 3, delay: 0.08, dx:  80,  dy: -90 },
  { x: 10, y: 48, size: 5, delay: 0.16, dx: -110, dy:  10 },
  { x: 90, y: 42, size: 4, delay: 0.12, dx:  110, dy:   5 },
  { x: 22, y: 82, size: 3, delay: 0.24, dx: -75,  dy:  90 },
  { x: 78, y: 78, size: 5, delay: 0.04, dx:  90,  dy:  85 },
  { x: 50, y:  8, size: 3, delay: 0.20, dx:  10,  dy: -110 },
  { x: 50, y: 92, size: 4, delay: 0.10, dx: -10,  dy:  110 },
  { x: 35, y: 10, size: 3, delay: 0.30, dx: -50,  dy: -100 },
  { x: 65, y: 10, size: 3, delay: 0.18, dx:  50,  dy: -100 },
  { x:  8, y: 68, size: 4, delay: 0.28, dx: -100, dy:  60  },
  { x: 92, y: 22, size: 3, delay: 0.06, dx:  100, dy: -60  },
];

export default function RankUpModal() {
  const [info, setInfo]         = useState<RankUpInfo | null>(null);
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(100);
  const activeRef               = useRef(false); // avoids adding info to effect deps

  // Poll /api/rankup every second. The route handler reads + clears the cookie
  // server-side, avoiding any client-side cookie parsing or encoding issues.
  useEffect(() => {
    async function check() {
      if (activeRef.current) return;
      try {
        const res = await fetch("/api/rankup");
        const data: RankUpInfo | null = await res.json();
        if (data) {
          activeRef.current = true;
          setInfo(data);
          setVisible(true);
        }
      } catch {
        // network error — try again next tick
      }
    }

    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-dismiss countdown
  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100);
      setProgress(pct);
      if (elapsed >= DISMISS_MS) {
        clearInterval(tick);
        dismiss();
      }
    }, 50);
    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setVisible(false);
    setTimeout(() => {
      setInfo(null);
      activeRef.current = false;
    }, 350);
  }

  if (!info) return null;

  const particleKeyframes = PARTICLES.map(
    (p, i) => `
      @keyframes rup${i} {
        from { opacity: 1; transform: translate(0,0) scale(1); }
        to   { opacity: 0; transform: translate(${p.dx}px, ${p.dy}px) scale(0); }
      }
    `,
  ).join("");

  return (
    <>
      <style>{`
        ${particleKeyframes}
        @keyframes rupOverlay  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rupCard     { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes rupPulse    { 0%,100% { opacity:1; } 50% { opacity:0.55; } }
        @keyframes rupGlow     {
          0%,100% { box-shadow: 0 0 32px ${info.glow}, 0 0 64px ${info.glow}40; }
          50%     { box-shadow: 0 0 52px ${info.glow}, 0 0 100px ${info.glow}60; }
        }
        .rup-overlay { animation: rupOverlay 0.25s ease forwards; }
        .rup-card    { animation: rupCard 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards, rupGlow 2s ease-in-out 0.5s infinite; }
        .rup-label   { animation: rupPulse 1.8s ease-in-out 0.4s infinite; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer rup-overlay"
        style={{
          backgroundColor: "rgba(0,0,0,0.82)",
          opacity: visible ? undefined : 0,
          transition: visible ? undefined : "opacity 0.35s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={dismiss}
      >
        {/* Floating pixel particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: info.color,
              boxShadow: `0 0 ${p.size * 3}px ${info.color}`,
              animation: `rup${i} 1.4s ease-out ${p.delay}s forwards`,
            }}
          />
        ))}

        {/* Modal card */}
        <div
          className="rup-card relative flex flex-col items-center gap-5 px-10 py-9 mx-6"
          style={{
            backgroundColor: "#0a0a12",
            border: `2px solid ${info.color}`,
            maxWidth: 360,
            width: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner accent pixels */}
          {[
            { top: -4, left: -4 },
            { top: -4, right: -4 },
            { bottom: -4, left: -4 },
            { bottom: -4, right: -4 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ width: 6, height: 6, backgroundColor: info.color, ...pos }}
            />
          ))}

          {/* "RANK UP" label */}
          <span
            className="rup-label font-heading text-[8px] tracking-[0.4em] leading-none"
            style={{ color: info.color }}
          >
            ★ RANK UP ★
          </span>

          {/* Badge */}
          <div className="relative flex items-center justify-center" style={{ width: 88, height: 88 }}>
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle, ${info.glow} 0%, transparent 70%)` }}
            />
            <RankBadge name={info.rank} />
          </div>

          {/* Rank name + tier */}
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="font-heading leading-none text-center"
              style={{ fontSize: "clamp(14px, 4vw, 20px)", color: info.color }}
            >
              {info.rank}
            </span>
            <span
              className="font-heading text-[9px] tracking-[0.3em] leading-none"
              style={{ color: `${info.color}70` }}
            >
              TIER {info.tier}
            </span>
          </div>

          {/* Flavour text */}
          <span className="font-sans text-xs text-zinc-500 text-center leading-relaxed">
            You&apos;ve reached a new rank.<br />Keep grinding.
          </span>

          {/* Countdown bar */}
          <div className="w-full h-px bg-[#1a1a26]">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: info.color,
                boxShadow: `0 0 6px ${info.color}`,
                transition: "width 0.05s linear",
              }}
            />
          </div>

          <span className="font-heading text-[7px] text-zinc-700 tracking-widest">
            CLICK ANYWHERE TO DISMISS
          </span>
        </div>
      </div>
    </>
  );
}
