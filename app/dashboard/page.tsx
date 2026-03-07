import Link from "next/link";

// ── Hardcoded mock data (replace with real data once auth is wired up) ──
const USER = {
  username: "SpeedCuber42",
  rank: "BRONZE",
  tier: "II",
  rankColor: "#cd7f32",
  rankBg: "#1e1408",
  rankGlow: "rgba(205,127,50,0.4)",
  currentXP: 1240,
  tierStartXP: 800,   // XP floor of Bronze II
  tierEndXP: 2000,    // XP ceiling of Bronze II → Bronze III
  streak: 7,
  totalSolves: 34,
  avgTime: "2:43",
  algorithmsMastered: 3,
  lastLesson: {
    stage: 2,
    lesson: 3,
    title: "Solving the Bottom Layer",
  },
};

const xpInTier   = USER.currentXP - USER.tierStartXP;
const xpNeeded   = USER.tierEndXP - USER.tierStartXP;
const xpProgress = Math.round((xpInTier / xpNeeded) * 100); // 37

const CHALLENGES = {
  daily: {
    label:    "DAILY CHALLENGE",
    task:     "Log 5 solves today",
    current:  2,
    goal:     5,
    xp:       30,
    accent:   "#009B48",
    resetsIn: "14h 22m",
  },
  weekly: {
    label:    "WEEKLY CHALLENGE",
    task:     "Log 30 solves this week",
    current:  11,
    goal:     30,
    xp:       150,
    accent:   "#0051A2",
    resetsIn: "4d 6h",
  },
};

const QUICK_STATS = [
  { label: "TOTAL SOLVES",        value: USER.totalSolves.toString() },
  { label: "AVG TIME",            value: USER.avgTime                 },
  { label: "ALGORITHMS MASTERED", value: USER.algorithmsMastered.toString() },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-4xl w-full px-6 py-14 flex flex-col gap-8">

      {/* ── Page eyebrow ── */}
      <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
        DASHBOARD
      </span>

      {/* ── Top row: rank identity + streak ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Rank identity card */}
        <div
          className="flex items-center gap-5 p-6 bg-[#0f0f1a]"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Diamond badge */}
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <div
              style={{
                width: 38,
                height: 38,
                transform: "rotate(45deg)",
                backgroundColor: USER.rankBg,
                border: `2px solid ${USER.rankColor}`,
                boxShadow: `0 0 20px ${USER.rankGlow}, inset 0 0 8px rgba(255,255,255,0.04)`,
              }}
            />
          </div>

          {/* Name + rank */}
          <div className="flex flex-col gap-2 min-w-0">
            <span className="font-heading text-white text-[11px] leading-none truncate">
              {USER.username}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="font-heading text-[9px] leading-none"
                style={{ color: USER.rankColor }}
              >
                {USER.rank} {USER.tier}
              </span>
              {/* Tier dots */}
              <div className="flex gap-[4px]">
                {["I", "II", "III"].map((t) => (
                  <div
                    key={t}
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: USER.rankColor,
                      opacity: t <= USER.tier ? 1 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="font-sans text-xs text-zinc-600">
              {USER.currentXP.toLocaleString()} total XP
            </span>
          </div>
        </div>

        {/* Streak card */}
        <div
          className="flex items-center gap-5 p-6 bg-[#0f0f1a]"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="text-4xl leading-none select-none" style={{ filter: "saturate(1.4)" }}>
            🔥
          </span>
          <div className="flex flex-col gap-1.5">
            <span
              className="font-heading leading-none"
              style={{ fontSize: "clamp(22px, 4vw, 36px)", color: "#FF5800" }}
            >
              {USER.streak}
            </span>
            <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
              DAY STREAK
            </span>
            <span className="font-sans text-xs text-zinc-600 mt-0.5">
              1 freeze available this week
            </span>
          </div>
        </div>
      </div>

      {/* ── XP progress bar ── */}
      <div
        className="flex flex-col gap-4 p-6 bg-[#0f0f1a]"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Labels */}
        <div className="flex items-center justify-between">
          <span
            className="font-heading text-[9px] leading-none"
            style={{ color: USER.rankColor }}
          >
            {USER.rank} {USER.tier}
          </span>
          <span className="font-heading text-[9px] text-zinc-500 leading-none">
            {USER.rank} III
          </span>
        </div>

        {/* Track */}
        <div className="relative h-4 w-full bg-[#1a1a26]" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Fill — pixel-sharp, no rounding */}
          <div
            className="absolute inset-y-0 left-0 transition-all"
            style={{
              width: `${xpProgress}%`,
              backgroundColor: USER.rankColor,
              boxShadow: `0 0 12px ${USER.rankGlow}`,
            }}
          />
          {/* Percentage label inside bar */}
          <span
            className="absolute inset-0 flex items-center justify-center font-heading text-[8px] leading-none"
            style={{ color: xpProgress > 20 ? USER.rankBg : USER.rankColor }}
          >
            {xpProgress}%
          </span>
        </div>

        {/* XP count */}
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-zinc-500">
            {xpInTier.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next tier
          </span>
          <span className="font-heading text-[9px] text-zinc-600">
            {(xpNeeded - xpInTier).toLocaleString()} XP remaining
          </span>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_STATS.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-3 p-5 bg-[#0f0f1a]"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
              {label}
            </span>
            <span className="font-heading text-xl text-white leading-none">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Challenges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(CHALLENGES).map((c) => {
          const pct = Math.round((c.current / c.goal) * 100);
          const isDone = c.current >= c.goal;

          return (
            <div
              key={c.label}
              className="flex flex-col gap-5 p-6 bg-[#0f0f1a]"
              style={{ border: `1px solid ${isDone ? c.accent : "rgba(255,255,255,0.05)"}` }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <span className="font-heading text-[9px] tracking-widest leading-relaxed" style={{ color: c.accent }}>
                  {c.label}
                </span>
                {/* XP badge */}
                <span
                  className="flex-shrink-0 font-heading text-[9px] leading-none px-2 py-1.5"
                  style={{
                    color: c.accent,
                    border: `1px solid ${c.accent}`,
                    opacity: 0.9,
                  }}
                >
                  +{c.xp} XP
                </span>
              </div>

              {/* Task name */}
              <p className="font-sans text-sm text-zinc-200 leading-relaxed">
                {c.task}
              </p>

              {/* Progress — segmented pips for small goals, bar for large */}
              {c.goal <= 10 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1.5">
                    {Array.from({ length: c.goal }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-3"
                        style={{
                          backgroundColor: i < c.current ? c.accent : "#1a1a26",
                          border: `1px solid ${i < c.current ? c.accent : "rgba(255,255,255,0.08)"}`,
                          boxShadow: i < c.current ? `0 0 6px ${c.accent}60` : "none",
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-heading text-[9px] text-zinc-500">
                    {c.current} / {c.goal} COMPLETE
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div
                    className="relative h-3 w-full bg-[#1a1a26]"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="absolute inset-y-0 left-0"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: c.accent,
                        boxShadow: `0 0 8px ${c.accent}80`,
                      }}
                    />
                  </div>
                  <span className="font-heading text-[9px] text-zinc-500">
                    {c.current} / {c.goal} COMPLETE
                  </span>
                </div>
              )}

              {/* Footer */}
              <span className="font-sans text-xs text-zinc-700">
                {isDone ? "✓ Completed — well done!" : `Resets in ${c.resetsIn}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Continue Learning ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-[#0f0f1a]"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            CONTINUE WHERE YOU LEFT OFF
          </span>
          <span className="font-sans text-xs text-zinc-500">
            Stage {USER.lastLesson.stage} · Lesson {USER.lastLesson.lesson}
          </span>
          <span className="font-sans text-base text-zinc-200">
            {USER.lastLesson.title}
          </span>
        </div>

        <Link
          href="/learn"
          className="flex-shrink-0 font-heading text-[11px] leading-none text-[#0d0d14] bg-[#FFD500] px-6 py-4 transition-all duration-75 hover:brightness-110 active:translate-x-[3px] active:translate-y-[3px] whitespace-nowrap"
          style={{
            boxShadow: "4px 4px 0px #a38a00, 7px 7px 0px rgba(163,138,0,0.2)",
          }}
        >
          CONTINUE LEARNING
        </Link>
      </div>

    </div>
  );
}
