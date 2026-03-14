import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRankInfo, formatTime, calcAo } from "@/lib/rank";

const CATEGORY_COLORS: Record<string, string> = {
  LEARNING: "#0051A2",
  SPEED:    "#C41E3A",
  PRACTICE: "#009B48",
  STREAK:   "#FF5800",
  HIDDEN:   "#55556a",
};

type Achievement = {
  id: string;
  name: string;
  desc: string;
  symbol: string;
  category: string;
  hidden: boolean;
};

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_steps",      name: "First Steps",     desc: "Complete your first lesson",               symbol: "▸",   category: "LEARNING", hidden: false },
  { id: "first_solve",      name: "First Solve",      desc: "Complete Stage 2",                         symbol: "◆",   category: "LEARNING", hidden: false },
  { id: "method_master",    name: "Method Master",    desc: "Complete Stage 7 — full CFOP learned",     symbol: "★",   category: "LEARNING", hidden: false },
  { id: "perfect_student",  name: "Perfect Student",  desc: "Pass every quiz first try in a stage",     symbol: "◉",   category: "LEARNING", hidden: false },
  { id: "scholar",          name: "Scholar",          desc: "Complete all 43 lessons",                  symbol: "▤",   category: "LEARNING", hidden: false },
  { id: "sub_120",          name: "Sub-2:00 Club",    desc: "Log a solve under 2 minutes",              symbol: "◷",   category: "SPEED",    hidden: false },
  { id: "sub_60",           name: "Sub-1:00 Club",    desc: "Log a solve under 1 minute",               symbol: "◷",   category: "SPEED",    hidden: false },
  { id: "sub_45",           name: "Sub-45 Club",      desc: "Log a solve under 45 seconds",             symbol: "◷",   category: "SPEED",    hidden: false },
  { id: "sub_30",           name: "Sub-30 Club",      desc: "Log a solve under 30 seconds",             symbol: "◷",   category: "SPEED",    hidden: false },
  { id: "getting_started",  name: "Getting Started",  desc: "Log 10 total solves",                      symbol: "▲",   category: "PRACTICE", hidden: false },
  { id: "century",          name: "Century",          desc: "Log 100 total solves",                     symbol: "▲▲",  category: "PRACTICE", hidden: false },
  { id: "thousand_club",    name: "Thousand Club",    desc: "Log 1,000 total solves",                   symbol: "✦",   category: "PRACTICE", hidden: false },
  { id: "alg_apprentice",   name: "Alg. Apprentice",  desc: "Master 10 algorithms",                     symbol: "◈",   category: "PRACTICE", hidden: false },
  { id: "alg_expert",       name: "Alg. Expert",      desc: "Master all 2-look OLL and PLL algorithms", symbol: "◈◈",  category: "PRACTICE", hidden: false },
  { id: "first_week",       name: "First Week",       desc: "Reach a 7-day streak",                     symbol: "7",   category: "STREAK",   hidden: false },
  { id: "monthly_grinder",  name: "Monthly Grinder",  desc: "Reach a 30-day streak",                    symbol: "30",  category: "STREAK",   hidden: false },
  { id: "dedicated",        name: "Dedicated",        desc: "Reach a 100-day streak",                   symbol: "100", category: "STREAK",   hidden: false },
  { id: "one_year_strong",  name: "One Year Strong",  desc: "Reach a 365-day streak",                   symbol: "365", category: "STREAK",   hidden: false },
  { id: "night_owl",        name: "Night Owl",        desc: "Log a solve after midnight",                symbol: "?",   category: "HIDDEN",   hidden: true  },
  { id: "early_bird",       name: "Early Bird",       desc: "Log a solve before 6 AM",                  symbol: "?",   category: "HIDDEN",   hidden: true  },
  { id: "speed_demon",      name: "Speed Demon",      desc: "Solve 20 times in a single session",       symbol: "?",   category: "HIDDEN",   hidden: true  },
  { id: "perfectionist",    name: "Perfectionist",    desc: "Get a personal best 5 times in one week",  symbol: "?",   category: "HIDDEN",   hidden: true  },
];

const TIER_ORDER = ["I", "II", "III"];

function AchievementBadge({ a, unlocked }: { a: Achievement; unlocked: boolean }) {
  const show = unlocked && !a.hidden;
  const color = CATEGORY_COLORS[a.category];
  const dimColor = "rgba(255,255,255,0.07)";

  return (
    <div
      className="flex flex-col items-center gap-3 p-4"
      style={{
        backgroundColor: show ? `${color}08` : "#0a0a12",
        border: show ? `1px solid ${color}30` : "1px solid rgba(255,255,255,0.04)",
      }}
      title={show ? a.desc : undefined}
    >
      <div
        className="flex items-center justify-center font-heading leading-none"
        style={{
          width: 44, height: 44,
          backgroundColor: show ? `${color}15` : "#13131e",
          border: `2px solid ${show ? color : dimColor}`,
          color: show ? color : "rgba(255,255,255,0.1)",
          fontSize: a.symbol.length > 2 ? "7px" : a.symbol.length > 1 ? "9px" : "14px",
          boxShadow: show ? `0 0 14px ${color}40` : "none",
        }}
      >
        {a.hidden ? "?" : a.symbol}
      </div>
      <span
        className="font-heading text-center leading-relaxed"
        style={{ fontSize: "7px", color: show ? "#ededed" : "rgba(255,255,255,0.15)", maxWidth: 80 }}
      >
        {a.hidden ? "???" : a.name}
      </span>
      <span
        className="font-heading leading-none tracking-widest"
        style={{ fontSize: "6px", color: show ? color : "rgba(255,255,255,0.08)" }}
      >
        {a.hidden ? "HIDDEN" : a.category}
      </span>
    </div>
  );
}

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({ id: user.id });
    profile = { id: user.id, total_xp: 0, current_streak: 0, longest_streak: 0, streak_freeze_available: true, created_at: new Date().toISOString() };
  }

  const [solvesRes, lessonsRes, algsRes, achievementsRes] = await Promise.all([
    supabase.from("solve_times").select("time_ms").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100),
    supabase.from("lesson_completions").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("algorithm_progress").select("id", { count: "exact" }).eq("user_id", user.id).eq("mastered", true),
    supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
  ]);

  const solves = solvesRes.data ?? [];
  const totalSolves = solves.length;
  const bestSingle = totalSolves > 0 ? Math.min(...solves.map((s) => s.time_ms)) : null;
  const ao5 = calcAo(solves.slice(0, 5).map((s) => s.time_ms));
  const ao12 = calcAo(solves.slice(0, 12).map((s) => s.time_ms));
  const lessonCount = lessonsRes.count ?? 0;
  const algCount = algsRes.count ?? 0;
  const unlockedIds = new Set((achievementsRes.data ?? []).map((a) => a.achievement_id));

  const rank = getRankInfo(profile.total_xp);
  const xpInTier = profile.total_xp - rank.start;
  const xpNeeded = rank.end - rank.start;
  const xpProgress = rank.end >= 999999 ? 100 : Math.min(100, Math.round((xpInTier / xpNeeded) * 100));
  const tierIndex = TIER_ORDER.indexOf(rank.tier);

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const displayName = user.email?.split("@")[0] ?? "Cuber";
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).length;

  const STATS = [
    { label: "TOTAL SOLVES",        value: totalSolves.toString(),                    sub: "all time"        },
    { label: "BEST SINGLE",         value: bestSingle ? formatTime(bestSingle) : "—", sub: "personal best"   },
    { label: "BEST AVERAGE OF 5",   value: ao5 ? formatTime(ao5) : "—",               sub: "ao5"             },
    { label: "BEST AVERAGE OF 12",  value: ao12 ? formatTime(ao12) : "—",             sub: "ao12"            },
    { label: "TOTAL XP EARNED",     value: profile.total_xp.toLocaleString(),         sub: "across all time" },
    { label: "LESSONS COMPLETED",   value: lessonCount.toString(),                    sub: "of 43 total"     },
    { label: "ALGORITHMS MASTERED", value: algCount.toString(),                       sub: "of 78 total", span: true },
  ];

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14 flex flex-col gap-6">

      <span className="font-heading text-[9px] text-zinc-600 tracking-widest">PROFILE</span>

      {/* Identity card */}
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8"
        style={{ border: `1px solid ${rank.color}25`, backgroundColor: "#0f0f1a" }}
      >
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <div
              style={{
                width: 64, height: 64,
                transform: "rotate(45deg)",
                backgroundColor: rank.bg,
                border: `3px solid ${rank.color}`,
                boxShadow: `0 0 32px ${rank.glow}, 0 0 64px ${rank.glow.replace("0.4", "0.15")}, inset 0 0 12px rgba(255,255,255,0.04)`,
              }}
            />
          </div>
          <div className="flex gap-[6px]">
            {TIER_ORDER.map((t, i) => (
              <div
                key={t}
                style={{
                  width: 7, height: 7,
                  backgroundColor: rank.color,
                  opacity: i <= tierIndex ? 1 : 0.18,
                  boxShadow: i <= tierIndex ? `0 0 6px ${rank.color}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h1 className="font-heading text-white leading-snug" style={{ fontSize: "clamp(13px, 2.5vw, 18px)" }}>
            {displayName}
          </h1>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-heading text-[10px] leading-none" style={{ color: rank.color }}>
              {rank.rank} {rank.tier}
            </span>
            <div className="w-px h-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <span className="font-sans text-xs text-zinc-500">
              {profile.total_xp.toLocaleString()} total XP
            </span>
          </div>
          <span className="font-sans text-xs text-zinc-600">Member since {memberSince}</span>
        </div>
      </div>

      {/* XP progress */}
      <div
        className="flex flex-col gap-4 p-6"
        style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">RANK PROGRESS</span>
          <span className="font-heading text-[9px] leading-none" style={{ color: rank.color }}>
            {rank.rank} {rank.tier} → {rank.nextLabel}
          </span>
        </div>
        <div className="relative h-4 w-full bg-[#1a1a26]" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="absolute inset-y-0 left-0 transition-all"
            style={{ width: `${xpProgress}%`, backgroundColor: rank.color, boxShadow: `0 0 12px ${rank.glow}` }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center font-heading text-[8px] leading-none"
            style={{ color: xpProgress > 20 ? rank.bg : rank.color }}
          >
            {xpProgress}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-zinc-500">
            {xpInTier.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next tier
          </span>
          <span className="font-heading text-[9px] text-zinc-600">
            {Math.max(0, xpNeeded - xpInTier).toLocaleString()} XP remaining
          </span>
        </div>
      </div>

      {/* Streak + member stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">MEMBER SINCE</span>
          <span className="font-heading text-xs text-white leading-snug">{memberSince}</span>
          <span className="font-sans text-xs text-zinc-700">joined cubemaxxed</span>
        </div>
        <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,133,0,0.15)", backgroundColor: "#0f0f1a" }}>
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">CURRENT STREAK</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading leading-none" style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#FF5800" }}>
              {profile.current_streak}
            </span>
            <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
          </div>
          <span className="font-sans text-xs text-zinc-700">
            {profile.streak_freeze_available ? "1 freeze available" : "no freeze available"}
          </span>
        </div>
        <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">BEST STREAK</span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading leading-none" style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "#FFD500" }}>
              {profile.longest_streak}
            </span>
            <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
          </div>
          <span className="font-sans text-xs text-zinc-700">personal record</span>
        </div>
      </div>

      {/* Performance stats */}
      <div className="flex flex-col gap-5 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">STATS</span>
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
              <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">{label}</span>
              <span className="font-heading text-lg text-white leading-none">{value}</span>
              <span className="font-sans text-xs text-zinc-700">{sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="flex flex-col gap-6 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">ACHIEVEMENTS</span>
            <span className="font-sans text-xs text-zinc-500">{unlockedCount} of {ACHIEVEMENTS.length} unlocked</span>
          </div>
          <div className="flex gap-[3px] flex-wrap justify-end" style={{ maxWidth: 160 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 5, height: 5,
                  backgroundColor: unlockedIds.has(a.id) ? CATEGORY_COLORS[a.category] : "rgba(255,255,255,0.06)",
                  boxShadow: unlockedIds.has(a.id) ? `0 0 4px ${CATEGORY_COLORS[a.category]}80` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {ACHIEVEMENTS.map((a) => (
            <AchievementBadge key={a.id} a={a} unlocked={unlockedIds.has(a.id)} />
          ))}
        </div>

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
