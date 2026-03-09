// ── Hardcoded mock data (replace with real data once auth is wired up) ──
const USER = {
  username:          "SpeedCuber42",
  rank:              "BRONZE",
  tier:              "II",
  rankColor:         "#cd7f32",
  rankBg:            "#1e1408",
  rankGlow:          "rgba(205,127,50,0.4)",
  nextRank:          "BRONZE III",
  currentXP:         1240,
  tierStartXP:       800,
  tierEndXP:         2000,
  totalXP:           1240,
  memberSince:       "January 12, 2025",
  currentStreak:     7,
  bestStreak:        14,
  streakFreeze:      true,
};

const STATS = [
  { label: "TOTAL SOLVES",         value: "34",    sub: "all time"        },
  { label: "BEST SINGLE",          value: "1:58",  sub: "personal best"   },
  { label: "BEST AVERAGE OF 5",    value: "2:43",  sub: "ao5"             },
  { label: "BEST AVERAGE OF 12",   value: "3:12",  sub: "ao12"            },
  { label: "TOTAL XP EARNED",      value: "1,240", sub: "across all time" },
  { label: "LESSONS COMPLETED",    value: "8",     sub: "of 43 total"     },
  { label: "ALGORITHMS MASTERED",  value: "3",     sub: "of 78 total",  span: true },
];

// Achievement categories and their accent colors
const CATEGORY_COLORS: Record<string, string> = {
  "LEARNING": "#0051A2",
  "SPEED":    "#C41E3A",
  "PRACTICE": "#009B48",
  "STREAK":   "#FF5800",
  "HIDDEN":   "#55556a",
};

type Achievement = {
  name:     string;
  desc:     string;
  symbol:   string;
  category: string;
  unlocked: boolean;
  hidden:   boolean; // hidden achievements always display as ???
};

// Unlocked state reflects this user's progress:
// Stage 1 done, partway through Stage 2, 34 solves, best 1:58, 7-day streak (best 14)
const ACHIEVEMENTS: Achievement[] = [
  // ── Learning ──
  { name: "First Steps",      desc: "Complete your first lesson",                       symbol: "▸",  category: "LEARNING", unlocked: true,  hidden: false },
  { name: "First Solve",      desc: "Complete Stage 2",                                 symbol: "◆",  category: "LEARNING", unlocked: false, hidden: false },
  { name: "Method Master",    desc: "Complete Stage 7 — full CFOP learned",             symbol: "★",  category: "LEARNING", unlocked: false, hidden: false },
  { name: "Perfect Student",  desc: "Pass every quiz first try in a stage",             symbol: "◉",  category: "LEARNING", unlocked: false, hidden: false },
  { name: "Scholar",          desc: "Complete all 43 lessons",                          symbol: "▤",  category: "LEARNING", unlocked: false, hidden: false },
  // ── Speed ──
  { name: "Sub-2:00 Club",    desc: "Log a solve under 2 minutes",                      symbol: "◷",  category: "SPEED",    unlocked: true,  hidden: false },
  { name: "Sub-1:00 Club",    desc: "Log a solve under 1 minute",                       symbol: "◷",  category: "SPEED",    unlocked: false, hidden: false },
  { name: "Sub-45 Club",      desc: "Log a solve under 45 seconds",                     symbol: "◷",  category: "SPEED",    unlocked: false, hidden: false },
  { name: "Sub-30 Club",      desc: "Log a solve under 30 seconds",                     symbol: "◷",  category: "SPEED",    unlocked: false, hidden: false },
  // ── Practice ──
  { name: "Getting Started",  desc: "Log 10 total solves",                              symbol: "▲",  category: "PRACTICE", unlocked: true,  hidden: false },
  { name: "Century",          desc: "Log 100 total solves",                             symbol: "▲▲", category: "PRACTICE", unlocked: false, hidden: false },
  { name: "Thousand Club",    desc: "Log 1,000 total solves",                           symbol: "✦",  category: "PRACTICE", unlocked: false, hidden: false },
  { name: "Alg. Apprentice",  desc: "Master 10 algorithms",                             symbol: "◈",  category: "PRACTICE", unlocked: false, hidden: false },
  { name: "Alg. Expert",      desc: "Master all 2-look OLL and PLL algorithms",         symbol: "◈◈", category: "PRACTICE", unlocked: false, hidden: false },
  // ── Streak ──
  { name: "First Week",       desc: "Reach a 7-day streak",                             symbol: "7",  category: "STREAK",   unlocked: true,  hidden: false },
  { name: "Monthly Grinder",  desc: "Reach a 30-day streak",                            symbol: "30", category: "STREAK",   unlocked: false, hidden: false },
  { name: "Dedicated",        desc: "Reach a 100-day streak",                           symbol: "100",category: "STREAK",   unlocked: false, hidden: false },
  { name: "One Year Strong",  desc: "Reach a 365-day streak",                           symbol: "365",category: "STREAK",   unlocked: false, hidden: false },
  // ── Hidden ──
  { name: "Night Owl",        desc: "Log a solve after midnight",                       symbol: "?",  category: "HIDDEN",   unlocked: false, hidden: true  },
  { name: "Early Bird",       desc: "Log a solve before 6 AM",                          symbol: "?",  category: "HIDDEN",   unlocked: false, hidden: true  },
  { name: "Speed Demon",      desc: "Solve 20 times in a single session",               symbol: "?",  category: "HIDDEN",   unlocked: false, hidden: true  },
  { name: "Perfectionist",    desc: "Get a personal best 5 times in one week",          symbol: "?",  category: "HIDDEN",   unlocked: false, hidden: true  },
];

const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

// ── Sub-components ────────────────────────────────────────────────────────────

function AchievementBadge({ a }: { a: Achievement }) {
  const show     = a.unlocked && !a.hidden;
  const color    = CATEGORY_COLORS[a.category];
  const dimColor = "rgba(255,255,255,0.07)";

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 transition-colors duration-200"
      style={{
        backgroundColor: show ? `${color}08` : "#0a0a12",
        border: show
          ? `1px solid ${color}30`
          : "1px solid rgba(255,255,255,0.04)",
      }}
      title={show ? a.desc : undefined}
    >
      {/* Icon square */}
      <div
        className="flex items-center justify-center font-heading leading-none"
        style={{
          width: 44,
          height: 44,
          backgroundColor: show ? `${color}15` : "#13131e",
          border: `2px solid ${show ? color : dimColor}`,
          color: show ? color : "rgba(255,255,255,0.1)",
          fontSize: a.symbol.length > 2 ? "7px" : a.symbol.length > 1 ? "9px" : "14px",
          boxShadow: show ? `0 0 14px ${color}40` : "none",
        }}
      >
        {a.hidden ? "?" : a.symbol}
      </div>

      {/* Name */}
      <span
        className="font-heading text-center leading-relaxed"
        style={{
          fontSize: "7px",
          color: show ? "#ededed" : "rgba(255,255,255,0.15)",
          maxWidth: 80,
        }}
      >
        {a.hidden ? "???" : a.name}
      </span>

      {/* Category pill */}
      <span
        className="font-heading leading-none tracking-widest"
        style={{
          fontSize: "6px",
          color: show ? color : "rgba(255,255,255,0.08)",
        }}
      >
        {a.hidden ? "HIDDEN" : a.category}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const xpInTier   = USER.currentXP - USER.tierStartXP;
const xpNeeded   = USER.tierEndXP  - USER.tierStartXP;
const xpProgress = Math.round((xpInTier / xpNeeded) * 100);
const TIER_ORDER = ["I", "II", "III"];
const tierIndex  = TIER_ORDER.indexOf(USER.tier);

export default function Profile() {
  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14 flex flex-col gap-6">

      {/* ── Page eyebrow ── */}
      <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
        PROFILE
      </span>

      {/* ── Identity card ── */}
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8"
        style={{ border: `1px solid ${USER.rankColor}25`, backgroundColor: "#0f0f1a" }}
      >
        {/* Rank badge */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <div
              style={{
                width: 64,
                height: 64,
                transform: "rotate(45deg)",
                backgroundColor: USER.rankBg,
                border: `3px solid ${USER.rankColor}`,
                boxShadow: `0 0 32px ${USER.rankGlow}, 0 0 64px ${USER.rankGlow.replace("0.4", "0.15")}, inset 0 0 12px rgba(255,255,255,0.04)`,
              }}
            />
          </div>
          <div className="flex gap-[6px]">
            {TIER_ORDER.map((t, i) => (
              <div
                key={t}
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: USER.rankColor,
                  opacity: i <= tierIndex ? 1 : 0.18,
                  boxShadow: i <= tierIndex ? `0 0 6px ${USER.rankColor}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Username + rank info */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h1
            className="font-heading text-white leading-snug"
            style={{ fontSize: "clamp(13px, 2.5vw, 18px)" }}
          >
            {USER.username}
          </h1>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span
              className="font-heading text-[10px] leading-none"
              style={{ color: USER.rankColor }}
            >
              {USER.rank} {USER.tier}
            </span>
            <div className="w-px h-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="font-sans text-xs text-zinc-500">
              {USER.totalXP.toLocaleString()} total XP
            </span>
          </div>
          <span className="font-sans text-xs text-zinc-600">
            Member since {USER.memberSince}
          </span>
        </div>
      </div>

      {/* ── XP progress bar ── */}
      <div
        className="flex flex-col gap-4 p-6"
        style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            RANK PROGRESS
          </span>
          <span className="font-heading text-[9px] leading-none" style={{ color: USER.rankColor }}>
            {USER.rank} {USER.tier} → {USER.nextRank}
          </span>
        </div>
        <div
          className="relative h-4 w-full bg-[#1a1a26]"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-all"
            style={{
              width: `${xpProgress}%`,
              backgroundColor: USER.rankColor,
              boxShadow: `0 0 12px ${USER.rankGlow}`,
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center font-heading text-[8px] leading-none"
            style={{ color: xpProgress > 20 ? USER.rankBg : USER.rankColor }}
          >
            {xpProgress}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-zinc-500">
            {xpInTier.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next tier
          </span>
          <span className="font-heading text-[9px] text-zinc-600">
            {(xpNeeded - xpInTier).toLocaleString()} XP remaining
          </span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="flex flex-col gap-3 p-5"
          style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
        >
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
            MEMBER SINCE
          </span>
          <span className="font-heading text-xs text-white leading-snug">
            {USER.memberSince}
          </span>
          <span className="font-sans text-xs text-zinc-700">joined cubemaxxed</span>
        </div>

        <div
          className="flex flex-col gap-3 p-5"
          style={{ border: "1px solid rgba(255,133,0,0.15)", backgroundColor: "#0f0f1a" }}
        >
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
            CURRENT STREAK
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading leading-none"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#FF5800" }}
            >
              {USER.currentStreak}
            </span>
            <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
          </div>
          <span className="font-sans text-xs text-zinc-700">
            {USER.streakFreeze ? "1 freeze available" : "no freeze available"}
          </span>
        </div>

        <div
          className="flex flex-col gap-3 p-5"
          style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
        >
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
            BEST STREAK
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading leading-none"
              style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#FFD500" }}
            >
              {USER.bestStreak}
            </span>
            <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
          </div>
          <span className="font-sans text-xs text-zinc-700">personal record</span>
        </div>
      </div>

      {/* ── Performance stats ── */}
      <div
        className="flex flex-col gap-5 p-6"
        style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
      >
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
          STATS
        </span>

        <div className="grid grid-cols-2 gap-3">
          {STATS.map(({ label, value, sub, span }) => (
            <div
              key={label}
              className="flex flex-col gap-2.5 p-4"
              style={{
                backgroundColor: "#0a0a12",
                border: "1px solid rgba(255,255,255,0.04)",
                gridColumn: span ? "1 / -1" : undefined,
              }}
            >
              <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
                {label}
              </span>
              <span className="font-heading text-lg text-white leading-none">
                {value}
              </span>
              <span className="font-sans text-xs text-zinc-700">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ── */}
      <div
        className="flex flex-col gap-6 p-6"
        style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
              ACHIEVEMENTS
            </span>
            <span className="font-sans text-xs text-zinc-500">
              {unlockedCount} of {ACHIEVEMENTS.length} unlocked
            </span>
          </div>
          {/* Progress pip row */}
          <div className="flex gap-[3px] flex-wrap justify-end" style={{ maxWidth: 160 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: a.unlocked
                    ? CATEGORY_COLORS[a.category]
                    : "rgba(255,255,255,0.06)",
                  boxShadow: a.unlocked
                    ? `0 0 4px ${CATEGORY_COLORS[a.category]}80`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {ACHIEVEMENTS.map((a) => (
            <AchievementBadge key={a.name} a={a} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 border-t border-white/[0.03]">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div style={{ width: 6, height: 6, backgroundColor: color }} />
              <span className="font-heading text-[7px] text-zinc-600">{cat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
