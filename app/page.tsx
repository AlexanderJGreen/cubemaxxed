import Link from "next/link";
import { RankBadge } from "@/app/components/RankBadge";

const FEATURES = [
  {
    color: "#0051A2",
    label: "LESSONS",
    title: "STRUCTURED CURRICULUM",
    desc: "43 lessons across 7 stages take you from never touching a cube to completing a full CFOP solve.",
    symbol: "▤",
  },
  {
    color: "#FFD500",
    label: "GAMIFICATION",
    title: "XP, RANKS & STREAKS",
    desc: "Earn XP for every action, climb 24 rank tiers, and build streaks that multiply your rewards.",
    symbol: "▲",
  },
  {
    color: "#009B48",
    label: "TRAINER",
    title: "ALGORITHM TRAINER",
    desc: "Drill OLL and PLL with spaced repetition — the system tracks what you know and targets what you don't.",
    symbol: "◈",
  },
  {
    color: "#C41E3A",
    label: "TIMER",
    title: "BUILT-IN TIMER",
    desc: "Scramble, solve, and log your times with a full-featured timer that tracks every session.",
    symbol: "◷",
  },
];

const RANKS = [
  {
    name: "UNRANKED",
    color: "#55556a",
    bg: "#0d0d14",
    glow: "rgba(85,85,106,0.4)",
  },
  {
    name: "BRONZE",
    color: "#cd7f32",
    bg: "#1e1408",
    glow: "rgba(205,127,50,0.4)",
  },
  {
    name: "SILVER",
    color: "#a8a9ad",
    bg: "#151519",
    glow: "rgba(168,169,173,0.4)",
  },
  {
    name: "GOLD",
    color: "#FFD500",
    bg: "#1a1500",
    glow: "rgba(255,213,0,0.4)",
  },
  {
    name: "PLATINUM",
    color: "#4fc3f7",
    bg: "#061018",
    glow: "rgba(79,195,247,0.4)",
  },
  {
    name: "DIAMOND",
    color: "#b9f2ff",
    bg: "#071215",
    glow: "rgba(185,242,255,0.4)",
  },
  {
    name: "MASTER",
    color: "#C41E3A",
    bg: "#150408",
    glow: "rgba(196,30,58,0.4)",
  },
  {
    name: "GRANDMASTER",
    color: "#ff9100",
    bg: "#170900",
    glow: "rgba(255,145,0,0.4)",
  },
];


// Scrambled cube face — all 6 colors present, deliberately mixed
const STICKERS = [
  "#FF5800",
  "#ffffff",
  "#0051A2",
  "#FFD500",
  "#C41E3A",
  "#FFD500",
  "#C41E3A",
  "#009B48",
  "#FF5800",
];

// Floating pixel squares — positioned around the hero
const FLOATERS = [
  { color: "#C41E3A", size: 7, left: "6%", delay: "0s", duration: "9s" },
  { color: "#FFD500", size: 11, left: "18%", delay: "2.5s", duration: "12s" },
  { color: "#009B48", size: 5, left: "33%", delay: "4s", duration: "10s" },
  { color: "#0051A2", size: 9, left: "52%", delay: "1.2s", duration: "14s" },
  { color: "#FF5800", size: 7, left: "67%", delay: "3.5s", duration: "11s" },
  { color: "#FFD500", size: 13, left: "80%", delay: "5.5s", duration: "13s" },
  { color: "#C41E3A", size: 5, left: "92%", delay: "7s", duration: "9s" },
  { color: "#009B48", size: 8, left: "44%", delay: "6s", duration: "15s" },
];

const STATS = [
  { value: "43", label: "Lessons" },
  { value: "7", label: "Stages" },
  { value: "24", label: "Ranks" },
];

export default function Home() {
  return (
    <>
      <section
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "linear-gradient(to bottom, black 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 55%, transparent 100%)",
          }}
        />

        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Floating pixel squares */}
        {FLOATERS.map((f, i) => (
          <div
            key={i}
            className="absolute bottom-0 pointer-events-none"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              backgroundColor: f.color,
              animation: `floatUp ${f.duration} ${f.delay} linear infinite`,
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-20 mx-auto max-w-6xl w-full px-6 py-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left column — text */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Eyebrow badge */}
            <span
              className="self-start font-heading text-[9px] leading-none text-[#FFD500] px-3 py-2 tracking-widest"
              style={{ border: "1px solid rgba(255,213,0,0.35)" }}
            >
              FREE TO START
            </span>

            {/* Headline + Subtitle */}
            <div className="flex flex-col gap-4">
              <div className="font-heading flex flex-col gap-7">
                <span
                  className="leading-snug text-zinc-300"
                  style={{ fontSize: "clamp(13px, 2.2vw, 20px)" }}
                >
                  LEARN TO SPEEDCUBE
                </span>
                <span
                  className="leading-none"
                  style={{
                    fontSize: "clamp(26px, 5.5vw, 60px)",
                    color: "#FFD500",
                    textShadow: "0 0 60px rgba(255,213,0,0.15)",
                  }}
                >
                  THE FUN WAY.
                </span>
              </div>

              {/* Subtitle */}
              <p className="font-sans text-lg text-zinc-400 max-w-md leading-relaxed">
                Structured lessons, real XP, daily streaks, and ranks that
                actually mean something. Built for total beginners. Addicting
                enough to keep you going.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
              <Link
                href="/learn"
                className="font-heading text-[11px] leading-none text-[#0d0d14] bg-[#FFD500] px-6 py-4 transition-all duration-75 hover:brightness-110 active:translate-x-[3px] active:translate-y-[3px]"
                style={{
                  boxShadow:
                    "4px 4px 0px #a38a00, 7px 7px 0px rgba(163,138,0,0.25)",
                }}
              >
                GET STARTED
              </Link>
              <span className="font-sans text-sm text-zinc-600">
                No account needed to explore
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-2 border-t border-white/5">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="font-heading text-sm text-white">
                    {value}
                  </span>
                  <span className="font-sans text-xs text-zinc-600 uppercase tracking-widest">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — pixel cube */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div
              className="grid grid-cols-3 gap-[3px] p-[6px] bg-[#1a1a26]"
              style={{ animation: "cubeGlow 3.5s ease-in-out infinite" }}
            >
              {STICKERS.map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: 76,
                    height: 76,
                    backgroundColor: color,
                    boxShadow:
                      "inset -3px -3px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
            <span className="font-heading text-[8px] text-zinc-700 tracking-widest">
              SCRAMBLED
            </span>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative mx-auto max-w-6xl w-full px-6 py-24">
        {/* Section header */}
        <div className="flex flex-col gap-3 mb-14">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            WHAT YOU GET
          </span>
          <h2
            className="font-heading text-white leading-snug"
            style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
          >
            EVERYTHING YOU NEED
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ color, label, title, symbol, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-5 p-6 bg-[#0f0f1a] transition-colors duration-200 hover:bg-[#13131f] group"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Top accent bar */}
              <div className="h-[3px] w-8" style={{ backgroundColor: color }} />

              {/* Icon + label */}
              <div className="flex items-center gap-2">
                <span
                  className="font-heading text-base leading-none"
                  style={{ color }}
                >
                  {symbol}
                </span>
                <span
                  className="font-heading text-[8px] leading-none tracking-widest"
                  style={{ color }}
                >
                  {label}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-heading text-white leading-relaxed"
                style={{ fontSize: "10px" }}
              >
                {title}
              </h3>

              {/* Description */}
              <p className="font-sans text-sm text-zinc-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rank Progression Section ── */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-16">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
              PROGRESSION
            </span>
            <h2
              className="font-heading text-white leading-snug"
              style={{ fontSize: "clamp(14px, 2vw, 20px)" }}
            >
              CLIMB THE RANKS
            </h2>
            <p className="font-sans text-sm text-zinc-500 max-w-md leading-relaxed mt-1">
              Every rank has 3 tiers — 24 milestones total. XP earned through
              lessons, practice, and daily streaks, not raw speed.
            </p>
          </div>

          {/* Rank row — horizontally scrollable on small screens */}
          <div className="overflow-x-auto py-12 pr-8">
            <div className="relative flex items-start justify-between min-w-[680px]">
              {/* Connecting line — runs behind the badges */}
              <div
                className="absolute left-8 right-8 pointer-events-none"
                style={{
                  top: "32px",
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />

              {RANKS.map((rank, i) => {
                return (
                  <div
                    key={rank.name}
                    className="flex flex-col items-center gap-3 relative z-10"
                  >
                    {/* Pixel art badge */}
                    <div className="w-16 h-16 flex items-center justify-center">
                      <RankBadge
                        name={rank.name}
                        color={rank.color}
                        glow={rank.name === "GRANDMASTER" ? rank.glow : undefined}
                      />
                    </div>

                    {/* Rank name */}
                    <span
                      className="font-heading text-center leading-relaxed"
                      style={{
                        fontSize: "8px",
                        color: rank.color,
                        width: 64,
                        transform:
                          rank.name === "GRANDMASTER"
                            ? "translateX(-10px)"
                            : undefined,
                      }}
                    >
                      {rank.name}
                    </span>

                    {/* Sub-tier dots — 3 per rank */}
                    <div className="flex gap-[5px]">
                      {[0, 1, 2].map((t) => (
                        <div
                          key={t}
                          style={{
                            width: 5,
                            height: 5,
                            backgroundColor: rank.color,
                            opacity: 0.45,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <p className="font-sans text-xs text-zinc-700 mt-10">
            ◆ Each dot represents one sub-tier. Complete all 3 to advance to the
            next rank.
          </p>
        </div>
      </section>
    </>
  );
}
