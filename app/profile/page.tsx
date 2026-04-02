import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRankInfo, formatTime, calcAo } from "@/lib/rank";
import { RankBadge } from "@/app/components/RankBadge";
import { PixelIcon, type PixelIconName } from "@/app/components/PixelIcon";
import { getSolveChartData, getPersonalBests } from "@/lib/analytics";
import { getCubes } from "@/app/cubes/actions";
import { getGoals } from "@/app/goals/actions";
import SolveChartClient from "./SolveChartClient";
import CubeFilter from "./CubeFilter";
import CubeManager from "./CubeManager";
import CubeComparison from "./CubeComparison";
import { GrandmasterGlow } from "./GrandmasterGlow";
import { GoalsSection } from "@/app/components/GoalsSection";

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
  icon: PixelIconName;
  category: string;
  hidden: boolean;
};

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_steps",      name: "First Steps",     desc: "Complete your first lesson",               icon: "arrow",      category: "LEARNING", hidden: false },
  { id: "first_solve",      name: "First Solve",      desc: "Complete Stage 2",                         icon: "diamond",    category: "LEARNING", hidden: false },
  { id: "method_master",    name: "Method Master",    desc: "Complete Stage 7 — full CFOP learned",     icon: "star",       category: "LEARNING", hidden: false },
  { id: "perfect_student",  name: "Perfect Student",  desc: "Pass every quiz first try in a stage",     icon: "bullseye",   category: "LEARNING", hidden: false },
  { id: "scholar",          name: "Scholar",          desc: "Complete all 43 lessons",                  icon: "book",       category: "LEARNING", hidden: false },
  { id: "sub_120",          name: "Sub-2:00 Club",    desc: "Log a solve under 2 minutes",              icon: "clock",      category: "SPEED",    hidden: false },
  { id: "sub_60",           name: "Sub-1:00 Club",    desc: "Log a solve under 1 minute",               icon: "clock",      category: "SPEED",    hidden: false },
  { id: "sub_45",           name: "Sub-45 Club",      desc: "Log a solve under 45 seconds",             icon: "clock",      category: "SPEED",    hidden: false },
  { id: "sub_30",           name: "Sub-30 Club",      desc: "Log a solve under 30 seconds",             icon: "clock",      category: "SPEED",    hidden: false },
  { id: "getting_started",  name: "Getting Started",  desc: "Log 10 total solves",                      icon: "mountain",   category: "PRACTICE", hidden: false },
  { id: "century",          name: "Century",          desc: "Log 100 total solves",                     icon: "mountain",   category: "PRACTICE", hidden: false },
  { id: "thousand_club",    name: "Thousand Club",    desc: "Log 1,000 total solves",                   icon: "fourstar",   category: "PRACTICE", hidden: false },
  { id: "alg_apprentice",   name: "Alg. Apprentice",  desc: "Master 10 algorithms",                     icon: "algdiamond", category: "PRACTICE", hidden: false },
  { id: "alg_expert",       name: "Alg. Expert",      desc: "Master all 2-look OLL and PLL algorithms", icon: "algdiamond", category: "PRACTICE", hidden: false },
  { id: "2look-done",       name: "2-Look Done",      desc: "Learned all 16 two-look OLL & PLL cases",  icon: "algdiamond", category: "PRACTICE", hidden: false },
  { id: "yellow-face",      name: "Yellow Face",      desc: "Learned all 57 full OLL cases",            icon: "algdiamond", category: "PRACTICE", hidden: false },
  { id: "last-layer",       name: "Last Layer",       desc: "Learned all 21 full PLL cases",            icon: "algdiamond", category: "PRACTICE", hidden: false },
  { id: "full-send",        name: "Full Send",        desc: "Learned every OLL and PLL algorithm",      icon: "fourstar",   category: "PRACTICE", hidden: false },
  { id: "first_week",       name: "First Week",       desc: "Reach a 7-day streak",                     icon: "flame",      category: "STREAK",   hidden: false },
  { id: "monthly_grinder",  name: "Monthly Grinder",  desc: "Reach a 30-day streak",                    icon: "flame",      category: "STREAK",   hidden: false },
  { id: "dedicated",        name: "Dedicated",        desc: "Reach a 100-day streak",                   icon: "flame",      category: "STREAK",   hidden: false },
  { id: "one_year_strong",  name: "One Year Strong",  desc: "Reach a 365-day streak",                   icon: "flame",      category: "STREAK",   hidden: false },
  { id: "night_owl",        name: "Night Owl",        desc: "Log a solve after midnight",                icon: "star",       category: "HIDDEN",   hidden: true  },
  { id: "early_bird",       name: "Early Bird",       desc: "Log a solve before 6 AM",                  icon: "star",       category: "HIDDEN",   hidden: true  },
  { id: "speed_demon",      name: "Speed Demon",      desc: "Solve 20 times in a single session",       icon: "lightning",  category: "HIDDEN",   hidden: true  },
  { id: "perfectionist",    name: "Perfectionist",    desc: "Get a personal best 5 times in one week",  icon: "fourstar",   category: "HIDDEN",   hidden: true  },
];

const TIER_ORDER = ["I", "II", "III"];

function AchievementBadge({ a, unlocked }: { a: Achievement; unlocked: boolean }) {
  const show = unlocked && !a.hidden;
  const color = CATEGORY_COLORS[a.category];

  return (
    <div
      className="flex flex-col items-center gap-2.5 p-3"
      style={{
        backgroundColor: show ? `${color}0a` : "#0a0a12",
        border: show ? `1px solid ${color}35` : "1px solid rgba(255,255,255,0.04)",
        boxShadow: show ? `inset 0 1px 0 ${color}20` : "none",
      }}
      title={show ? a.desc : undefined}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 48, height: 48,
          backgroundColor: show ? `${color}18` : "#13131e",
          border: `2px solid ${show ? color : "rgba(255,255,255,0.06)"}`,
          color: show ? color : "rgba(255,255,255,0.1)",
          boxShadow: show ? `0 0 18px ${color}50, inset 0 0 8px ${color}15` : "none",
        }}
      >
        {a.hidden
          ? <span className="font-heading" style={{ fontSize: 16 }}>?</span>
          : <PixelIcon name={a.icon} size={24} />
        }
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

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<{ cube?: string }>;
}) {
  const { cube: selectedCubeId } = await searchParams;
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

  const now = new Date();
  const todayUTCStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();

  const solvesQuery = supabase.from("solve_times").select("time_ms").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
  const todaySolvesQuery = supabase.from("solve_times").select("time_ms").eq("user_id", user.id).gte("created_at", todayUTCStart);

  const [solvesRes, lessonsRes, algsRes, achievementsRes, chartData, personalBests, todaySolvesRes, cubes, goals] = await Promise.all([
    selectedCubeId ? solvesQuery.eq("cube_id", selectedCubeId) : solvesQuery,
    supabase.from("lesson_completions").select("id", { count: "exact" }).eq("user_id", user.id),
    supabase.from("algorithm_progress").select("id", { count: "exact" }).eq("user_id", user.id).eq("mastered", true),
    supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
    getSolveChartData(user.id, selectedCubeId),
    getPersonalBests(user.id, selectedCubeId),
    selectedCubeId ? todaySolvesQuery.eq("cube_id", selectedCubeId) : todaySolvesQuery,
    getCubes(),
    getGoals(),
  ]);

  const solves = solvesRes.data ?? [];
  const totalSolves = solves.length;
  const bestSingle = totalSolves > 0 ? Math.min(...solves.map((s) => s.time_ms)) : null;
  const ao5 = calcAo(solves.slice(0, 5).map((s) => s.time_ms));
  const ao12 = calcAo(solves.slice(0, 12).map((s) => s.time_ms));
  const lessonCount = lessonsRes.count ?? 0;
  const algCount = algsRes.count ?? 0;
  const unlockedIds = new Set((achievementsRes.data ?? []).map((a) => a.achievement_id));

  // Session breakdown
  const todaySolves = todaySolvesRes.data ?? [];
  const todaySolveCount = todaySolves.length;
  const todayBest = todaySolveCount > 0 ? Math.min(...todaySolves.map((s) => s.time_ms)) : null;
  const todayAo5 = calcAo(todaySolves.slice(0, 5).map((s) => s.time_ms));
  const allTimeTimes = chartData.map((d) => d.time_ms);
  const allTimeAvg = allTimeTimes.length > 0
    ? Math.round(allTimeTimes.reduce((a, b) => a + b, 0) / allTimeTimes.length)
    : null;
  const todayAvg = todaySolveCount > 0
    ? Math.round(todaySolves.reduce((a, b) => a + b.time_ms, 0) / todaySolveCount)
    : null;
  const sessionVsAvg: "better" | "worse" | "same" | null =
    todayAvg !== null && allTimeAvg !== null
      ? todayAvg < allTimeAvg * 0.98 ? "better"
      : todayAvg > allTimeAvg * 1.02 ? "worse"
      : "same"
      : null;

  const rank = getRankInfo(profile.total_xp);
  const xpInTier = profile.total_xp - rank.start;
  const xpNeeded = rank.end - rank.start;
  const xpProgress = rank.end >= 999999 ? 100 : Math.min(100, Math.round((xpInTier / xpNeeded) * 100));
  const tierIndex = TIER_ORDER.indexOf(rank.tier);

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const displayName = user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Cuber";
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id)).length;

  const STATS = [
    { label: "TOTAL SOLVES",        value: totalSolves.toString(),                    sub: "all time",       color: "#009B48" },
    { label: "BEST SINGLE",         value: bestSingle ? formatTime(bestSingle) : "—", sub: "personal best",  color: "#C41E3A" },
    { label: "BEST AVERAGE OF 5",   value: ao5 ? formatTime(ao5) : "—",               sub: "ao5",            color: "#4FC3F7" },
    { label: "BEST AVERAGE OF 12",  value: ao12 ? formatTime(ao12) : "—",             sub: "ao12",           color: "#FFD500" },
    { label: "TOTAL XP EARNED",     value: profile.total_xp.toLocaleString(),         sub: "across all time",color: "#FF5800" },
    { label: "LESSONS COMPLETED",   value: lessonCount.toString(),                    sub: "of 43 total",    color: "#0051A2" },
    { label: "ALGORITHMS MASTERED", value: algCount.toString(),                       sub: "of 78 total",    color: "#a855f7", span: true },
  ];

  const ACHIEVEMENT_CATEGORIES = ["LEARNING", "SPEED", "PRACTICE", "STREAK", "HIDDEN"] as const;

  const heroCardInner = (
    <>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Badge + tier dots */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${rank.glow}35 0%, transparent 65%)` }}
            />
            <RankBadge name={rank.rank} />
          </div>
          <div className="flex gap-2.5">
            {TIER_ORDER.map((t, i) => (
              <div
                key={t}
                style={{
                  width: 9, height: 9,
                  backgroundColor: rank.color,
                  opacity: i <= tierIndex ? 1 : 0.18,
                  boxShadow: i <= tierIndex ? `0 0 8px ${rank.color}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Identity info */}
        <div className="flex flex-col gap-4 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col gap-1.5">
            <span className="font-heading text-white leading-none" style={{ fontSize: "clamp(18px, 3vw, 30px)" }}>
              {displayName}
            </span>
            <span className="font-heading leading-none" style={{ fontSize: "clamp(10px, 1.8vw, 13px)", color: rank.color, letterSpacing: "0.12em" }}>
              {rank.rank} {rank.tier}
            </span>
            <span className="font-sans text-xs text-zinc-600 mt-0.5">Member since {memberSince}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center sm:justify-start">
            {[
              { label: "TOTAL XP",    value: profile.total_xp.toLocaleString(),        color: rank.color },
              { label: "STREAK",      value: `${profile.current_streak}d`,             color: "#FF5800"  },
              { label: "LESSONS",     value: `${lessonCount}/43`,                       color: "#0051A2"  },
              { label: "ALGS",        value: `${algCount}/78`,                          color: "#a855f7"  },
              { label: "ACHIEVEMENTS",value: `${unlockedCount}/${ACHIEVEMENTS.length}`, color: "#FFD500"  },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-heading text-[7px] text-zinc-600 tracking-widest leading-none">{label}</span>
                <span className="font-heading text-sm leading-none" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom rank-colored gradient rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(to right, transparent, ${rank.color}25, transparent)` }}
      />
    </>
  );

  return (
    <div className="relative min-h-screen">

      {/* Background — dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 py-14 flex flex-col gap-6">

        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">PROFILE</span>
          <CubeFilter cubes={cubes} selectedId={selectedCubeId ?? null} />
        </div>

        {/* ── Hero identity card ── */}
        {rank.rank === "GRANDMASTER" ? (
          <GrandmasterGlow>{heroCardInner}</GrandmasterGlow>
        ) : (
          <div
            className="relative overflow-hidden p-8 sm:p-10"
            style={{
              border: `1px solid ${rank.color}20`,
              backgroundColor: "#0f0f1a",
              boxShadow: `0 0 32px ${rank.color}80`,
            }}
          >
            {heroCardInner}
          </div>
        )}

        {/* ── XP progress ── */}
        <div
          className="flex flex-col gap-4 p-6"
          style={{ border: `1px solid ${rank.color}22`, backgroundColor: "#0f0f1a" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">RANK PROGRESS</span>
            <span className="font-heading text-[9px] leading-none" style={{ color: rank.color }}>
              {rank.rank} {rank.tier} → {rank.nextLabel}
            </span>
          </div>
          <div className="relative h-5 w-full bg-[#1a1a26]" style={{ border: `1px solid ${rank.color}18` }}>
            <div
              className="absolute inset-y-0 left-0 transition-all"
              style={{ width: `${xpProgress}%`, backgroundColor: rank.color, boxShadow: `0 0 16px ${rank.glow}` }}
            />
            {/* Segmented tick marks */}
            {[25, 50, 75].map((pct) => (
              <div
                key={pct}
                className="absolute inset-y-0 w-px"
                style={{ left: `${pct}%`, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1 }}
              />
            ))}
            <span
              className="absolute inset-0 flex items-center justify-center font-heading text-[8px] leading-none"
              style={{ color: xpProgress > 20 ? rank.bg : rank.color, zIndex: 2 }}
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

        {/* ── My Cubes ── */}
        <CubeManager initialCubes={cubes} />

        {/* ── Head-to-head comparison ── */}
        {cubes.length >= 2 && <CubeComparison cubes={cubes} />}

        {/* ── Goals ── */}
        <GoalsSection goals={goals} cubes={cubes} />

        {/* ── Streak + member stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
            <div className="h-[2px] w-5" style={{ backgroundColor: rank.color }} />
            <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">MEMBER SINCE</span>
            <span className="font-heading text-xs text-white leading-snug">{memberSince}</span>
            <span className="font-sans text-xs text-zinc-700">joined cubemaxxed</span>
          </div>
          <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,88,0,0.2)", backgroundColor: "#0f0f1a", boxShadow: profile.current_streak > 0 ? "0 0 20px rgba(255,88,0,0.06)" : "none" }}>
            <div className="h-[2px] w-5" style={{ backgroundColor: "#FF5800" }} />
            <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">CURRENT STREAK</span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading leading-none" style={{ fontSize: "clamp(22px, 3vw, 30px)", color: "#FF5800" }}>
                {profile.current_streak}
              </span>
              <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
            </div>
            <span className="font-sans text-xs text-zinc-700">
              {profile.streak_freeze_available ? "1 freeze available" : "no freeze available"}
            </span>
          </div>
          <div className="flex flex-col gap-3 p-5" style={{ border: "1px solid rgba(255,213,0,0.15)", backgroundColor: "#0f0f1a" }}>
            <div className="h-[2px] w-5" style={{ backgroundColor: "#FFD500" }} />
            <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">BEST STREAK</span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading leading-none" style={{ fontSize: "clamp(22px, 3vw, 30px)", color: "#FFD500" }}>
                {profile.longest_streak}
              </span>
              <span className="font-heading text-[8px] text-zinc-500">DAYS</span>
            </div>
            <span className="font-sans text-xs text-zinc-700">personal record</span>
          </div>
        </div>

        {/* ── Stats + Personal Bests (2-column on large screens) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Performance stats */}
          <div className="flex flex-col gap-5 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
            <div className="flex items-center gap-3">
              <span className="font-heading text-[9px] text-zinc-600 tracking-widest">STATS</span>
              {selectedCubeId && cubes.find((c) => c.id === selectedCubeId) && (
                <span className="font-heading text-[8px] tracking-widest px-2 py-0.5" style={{ color: "#009B48", border: "1px solid rgba(0,155,72,0.3)", backgroundColor: "rgba(0,155,72,0.06)" }}>
                  {cubes.find((c) => c.id === selectedCubeId)!.name.toUpperCase()}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ label, value, sub, color, span }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2.5 p-4"
                  style={{
                    backgroundColor: "#0a0a12",
                    border: "1px solid rgba(255,255,255,0.04)",
                    gridColumn: span ? "1 / -1" : undefined,
                  }}
                >
                  <div className="h-[2px] w-5" style={{ backgroundColor: color }} />
                  <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">{label}</span>
                  <span className="font-heading text-lg leading-none" style={{ color }}>{value}</span>
                  <span className="font-sans text-xs text-zinc-700">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal bests */}
          <div className="flex flex-col gap-5 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">PERSONAL BESTS</span>
            <div className="grid grid-cols-2 gap-3">
              {personalBests.map((pb) => {
                const achieved = pb.time_ms !== null;
                const date = pb.achievedAt
                  ? new Date(pb.achievedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : null;
                return (
                  <div
                    key={pb.milestone}
                    className="flex flex-col gap-2.5 p-4"
                    style={{
                      backgroundColor: achieved ? "#0d1a10" : "#0a0a12",
                      border: achieved ? "1px solid rgba(0,155,72,0.25)" : "1px solid rgba(255,255,255,0.04)",
                      boxShadow: achieved ? "inset 0 1px 0 rgba(0,155,72,0.1)" : "none",
                    }}
                  >
                    {achieved && <div className="h-[2px] w-5" style={{ backgroundColor: "#009B48" }} />}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-[8px] tracking-widest leading-relaxed" style={{ color: achieved ? "#009B48" : "rgba(255,255,255,0.15)" }}>
                        {pb.label}
                      </span>
                      {!achieved && (
                        <span className="font-heading text-[7px]" style={{ color: "rgba(255,255,255,0.1)" }}>LOCKED</span>
                      )}
                    </div>
                    <span className="font-heading text-lg leading-none" style={{ color: achieved ? "#ffffff" : "rgba(255,255,255,0.12)" }}>
                      {achieved ? pb.timeFormatted : "—"}
                    </span>
                    <span className="font-sans text-xs" style={{ color: achieved ? "#55556a" : "rgba(255,255,255,0.08)" }}>
                      {date ?? "not yet achieved"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Solve progress graph ── */}
        <div className="flex flex-col gap-5 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">SOLVE PROGRESS</span>
            <span className="font-sans text-xs text-zinc-600">single · ao5 · ao12 over time</span>
          </div>
          <SolveChartClient data={chartData} />
        </div>

        {/* ── Session breakdown ── */}
        <div className="flex flex-col gap-4 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">TODAY&apos;S SESSION</span>
          {todaySolveCount === 0 ? (
            <span className="font-sans text-sm text-zinc-600">No solves logged today yet.</span>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "SOLVES",  value: todaySolveCount.toString(),                    sub: "today",                                                                    color: "#009B48" },
                { label: "BEST",    value: todayBest ? formatTime(todayBest) : "—",        sub: "today's single",                                                           color: "#C41E3A" },
                { label: "AO5",     value: todayAo5 ? formatTime(todayAo5) : "—",          sub: todaySolveCount < 5 ? `need ${5 - todaySolveCount} more` : "today",         color: "#4FC3F7" },
                {
                  label: "VS AVG",
                  value: sessionVsAvg === "better" ? "BETTER" : sessionVsAvg === "worse" ? "WORSE" : "ON PAR",
                  sub: "vs all-time avg",
                  color: sessionVsAvg === "better" ? "#009B48" : sessionVsAvg === "worse" ? "#C41E3A" : "#ffffff",
                  border: sessionVsAvg === "better" ? "1px solid rgba(0,155,72,0.2)" : sessionVsAvg === "worse" ? "1px solid rgba(196,30,58,0.2)" : undefined,
                },
              ].map(({ label, value, sub, color, border }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2.5 p-4"
                  style={{ backgroundColor: "#0a0a12", border: border ?? "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="h-[2px] w-5" style={{ backgroundColor: color }} />
                  <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">{label}</span>
                  <span className="font-heading text-lg leading-none" style={{ color }}>{value}</span>
                  <span className="font-sans text-xs text-zinc-700">{sub}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Achievements ── */}
        <div className="flex flex-col gap-6 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-heading text-[9px] text-zinc-600 tracking-widest">ACHIEVEMENTS</span>
              <span className="font-sans text-xs text-zinc-500">{unlockedCount} of {ACHIEVEMENTS.length} unlocked</span>
            </div>
            {/* Mini pixel progress dots */}
            <div className="flex gap-[3px] flex-wrap justify-end" style={{ maxWidth: 160 }}>
              {ACHIEVEMENTS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    width: 6, height: 6,
                    backgroundColor: unlockedIds.has(a.id) ? CATEGORY_COLORS[a.category] : "rgba(255,255,255,0.06)",
                    boxShadow: unlockedIds.has(a.id) ? `0 0 4px ${CATEGORY_COLORS[a.category]}90` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Achievements grouped by category */}
          <div className="flex flex-col gap-6">
            {ACHIEVEMENT_CATEGORIES.map((cat) => {
              const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat);
              const catColor = CATEGORY_COLORS[cat];
              const catUnlocked = catAchievements.filter((a) => unlockedIds.has(a.id)).length;
              return (
                <div key={cat} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ backgroundColor: `${catColor}25` }} />
                    <div className="flex items-center gap-2">
                      <div style={{ width: 6, height: 6, backgroundColor: catColor, boxShadow: `0 0 6px ${catColor}` }} />
                      <span className="font-heading text-[8px] tracking-widest" style={{ color: catColor }}>{cat}</span>
                      <span className="font-heading text-[7px] text-zinc-700">{catUnlocked}/{catAchievements.length}</span>
                    </div>
                    <div className="h-px flex-1" style={{ backgroundColor: `${catColor}25` }} />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                    {catAchievements.map((a) => (
                      <AchievementBadge key={a.id} a={a} unlocked={unlockedIds.has(a.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
