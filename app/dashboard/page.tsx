import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRankInfo, formatTime, calcAo } from "@/lib/rank";

const FIRE_GRID = [
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 1, 2, 2, 2, 1, 0],
  [1, 1, 2, 2, 2, 1, 1],
  [1, 2, 2, 3, 2, 2, 1],
  [0, 2, 3, 3, 3, 2, 0],
  [0, 0, 3, 3, 3, 0, 0],
  [0, 0, 0, 3, 0, 0, 0],
];
const FIRE_COLORS: Record<number, string> = {
  1: "#FFD500",
  2: "#FF5800",
  3: "#C41E3A",
};

function PixelFire() {
  return (
    <div className="flex flex-col gap-px select-none shrink-0 self-center">
      {FIRE_GRID.map((row, r) => (
        <div key={r} className="flex gap-px">
          {row.map((cell, c) => (
            <div
              key={c}
              style={{
                width: 4,
                height: 4,
                backgroundColor: cell ? FIRE_COLORS[cell] : "transparent",
                boxShadow:
                  cell === 1
                    ? "0 0 3px #FFD500"
                    : cell === 2
                      ? "0 0 3px #FF5800"
                      : cell === 3
                        ? "0 0 3px #C41E3A"
                        : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch profile — create if missing (handles users created before trigger)
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({ id: user.id });
    profile = {
      id: user.id,
      total_xp: 0,
      current_streak: 0,
      longest_streak: 0,
      streak_freeze_available: true,
      created_at: new Date().toISOString(),
    };
  }

  // Fetch stats in parallel
  const [solvesRes, lessonsRes, algsRes, lastLessonRes] = await Promise.all([
    supabase
      .from("solve_times")
      .select("time_ms, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("lesson_completions")
      .select("lesson_id, stage", { count: "exact" })
      .eq("user_id", user.id),
    supabase
      .from("algorithm_progress")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("mastered", true),
    supabase
      .from("lesson_completions")
      .select("lesson_id, stage")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1),
  ]);

  const solves = solvesRes.data ?? [];
  const totalSolves = solves.length;
  const bestSingle =
    totalSolves > 0 ? Math.min(...solves.map((s) => s.time_ms)) : null;
  const last5 = solves.slice(0, 5).map((s) => s.time_ms);
  const ao5 = calcAo(last5);

  const lessonCount = lessonsRes.count ?? 0;
  const algCount = algsRes.count ?? 0;
  const lastLesson = lastLessonRes.data?.[0] ?? null;

  const rank = getRankInfo(profile.total_xp);
  const xpInTier = profile.total_xp - rank.start;
  const xpNeeded = rank.end - rank.start;
  const xpProgress =
    rank.end >= 999999
      ? 100
      : Math.min(100, Math.round((xpInTier / xpNeeded) * 100));

  const displayName = user.email?.split("@")[0] ?? "Cuber";

  const QUICK_STATS = [
    { label: "TOTAL SOLVES", value: totalSolves.toString(), sub: "all time" },
    {
      label: "BEST SINGLE",
      value: bestSingle ? formatTime(bestSingle) : "—",
      sub: "personal best",
    },
    {
      label: "CURRENT AO5",
      value: ao5 ? formatTime(ao5) : "—",
      sub: "last 5 solves",
    },
    {
      label: "ALGORITHMS MASTERED",
      value: algCount.toString(),
      sub: "of 78 total",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl w-full px-6 py-14 flex flex-col gap-8">
      <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
        DASHBOARD
      </span>

      {/* Top row: rank identity + streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rank identity card */}
        <div
          className="flex items-center gap-5 p-6 bg-[#0f0f1a]"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <div
              style={{
                width: 38,
                height: 38,
                transform: "rotate(45deg)",
                backgroundColor: rank.bg,
                border: `2px solid ${rank.color}`,
                boxShadow: `0 0 20px ${rank.glow}, inset 0 0 8px rgba(255,255,255,0.04)`,
              }}
            />
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <span className="font-heading text-white text-[11px] leading-none truncate">
              {displayName}
            </span>
            <div className="flex items-center gap-2">
              <span
                className="font-heading text-[9px] leading-none"
                style={{ color: rank.color }}
              >
                {rank.rank} {rank.tier}
              </span>
              <div className="flex gap-[4px]">
                {["I", "II", "III"].map((t) => (
                  <div
                    key={t}
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: rank.color,
                      opacity: t <= rank.tier ? 1 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="font-sans text-xs text-zinc-600">
              {profile.total_xp.toLocaleString()} total XP
            </span>
          </div>
        </div>

        {/* Streak card */}
        <div
          className="flex items-center gap-5 p-6 bg-[#0f0f1a]"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <PixelFire />
          <div className="flex flex-col gap-1.5">
            <span
              className="font-heading leading-none"
              style={{ fontSize: "clamp(22px, 4vw, 36px)", color: "#FF5800" }}
            >
              {profile.current_streak}
            </span>
            <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
              DAY STREAK
            </span>
            <span className="font-sans text-xs text-zinc-600 mt-0.5">
              {profile.streak_freeze_available
                ? "1 freeze available this week"
                : "no freeze available"}
            </span>
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div
        className="flex flex-col gap-4 p-6 bg-[#0f0f1a]"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="font-heading text-[9px] leading-none"
            style={{ color: rank.color }}
          >
            {rank.rank} {rank.tier}
          </span>
          <span className="font-heading text-[9px] text-zinc-500 leading-none">
            {rank.nextLabel}
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
              backgroundColor: rank.color,
              boxShadow: `0 0 12px ${rank.glow}`,
            }}
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
            {xpInTier.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next
            tier
          </span>
          <span className="font-heading text-[9px] text-zinc-600">
            {Math.max(0, xpNeeded - xpInTier).toLocaleString()} XP remaining
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_STATS.map(({ label, value, sub }) => (
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
            <span className="font-sans text-xs text-zinc-700">{sub}</span>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-[#0f0f1a]"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
            {lastLesson ? "CONTINUE WHERE YOU LEFT OFF" : "START LEARNING"}
          </span>
          {lastLesson ? (
            <span className="font-sans text-xs text-zinc-500">
              Stage {lastLesson.stage} · Lesson {lastLesson.lesson_id}
            </span>
          ) : (
            <span className="font-sans text-sm text-zinc-400">
              You haven&apos;t started any lessons yet.
            </span>
          )}
          <span className="font-sans text-xs text-zinc-600">
            {lessonCount} of 43 lessons completed
          </span>
        </div>

        <Link
          href="/learn"
          className="flex-shrink-0 font-heading text-[11px] leading-none text-[#0d0d14] bg-[#FFD500] px-6 py-4 transition-all duration-75 hover:brightness-110 active:translate-x-[3px] active:translate-y-[3px] whitespace-nowrap"
          style={{
            boxShadow: "4px 4px 0px #a38a00, 7px 7px 0px rgba(163,138,0,0.2)",
          }}
        >
          {lastLesson ? "CONTINUE LEARNING" : "START LEARNING"}
        </Link>
      </div>
    </div>
  );
}
