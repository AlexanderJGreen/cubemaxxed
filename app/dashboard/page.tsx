import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRankInfo, formatTime, calcAo } from "@/lib/rank";
import { RankBadge } from "@/app/components/RankBadge";
import { claimChallengeXP, useStreakFreeze } from "./actions";
import { FreezeTimer } from "@/app/components/FreezeTimer";

// ─── Challenge System ────────────────────────────────────────────────────────

type ChallengeType =
  | "solves_today"
  | "lessons_today"
  | "solves_week"
  | "lessons_week"
  | "streak_days";

interface Challenge {
  text: string;
  xp: number;
  type: ChallengeType;
  target: number;
}

const DAILY_CHALLENGES: Challenge[] = [
  { text: "Log 5 solves in the timer", xp: 30, type: "solves_today", target: 5 },
  { text: "Complete a lesson", xp: 40, type: "lessons_today", target: 1 },
  { text: "Log 3 solves in the timer", xp: 20, type: "solves_today", target: 3 },
  { text: "Log 10 solves in the timer", xp: 50, type: "solves_today", target: 10 },
  { text: "Complete 2 lessons", xp: 60, type: "lessons_today", target: 2 },
  { text: "Get in a practice session", xp: 25, type: "solves_today", target: 1 },
  { text: "Log 7 solves in the timer", xp: 40, type: "solves_today", target: 7 },
];

const WEEKLY_CHALLENGES: Challenge[] = [
  { text: "Log 30 solves this week", xp: 150, type: "solves_week", target: 30 },
  { text: "Complete 3 lessons this week", xp: 200, type: "lessons_week", target: 3 },
  { text: "Keep your streak going all week", xp: 100, type: "streak_days", target: 7 },
  { text: "Log 15 solves this week", xp: 100, type: "solves_week", target: 15 },
  { text: "Complete 5 lessons this week", xp: 300, type: "lessons_week", target: 5 },
  { text: "Log 50 solves this week", xp: 200, type: "solves_week", target: 50 },
  { text: "Complete 2 lessons this week", xp: 150, type: "lessons_week", target: 2 },
];

function getDailyChallenge(dateStr: string): Challenge {
  const d = new Date(dateStr);
  const daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[daysSinceEpoch % DAILY_CHALLENGES.length];
}

function getWeeklyChallenge(weekStartStr: string): Challenge {
  const d = new Date(weekStartStr);
  const weeksSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24 * 7));
  return WEEKLY_CHALLENGES[weeksSinceEpoch % WEEKLY_CHALLENGES.length];
}

function getChallengeProgress(
  challenge: Challenge,
  counts: {
    solvesToday: number;
    lessonsToday: number;
    solvesWeek: number;
    lessonsWeek: number;
    streakDays: number;
  }
): number {
  switch (challenge.type) {
    case "solves_today":  return Math.min(challenge.target, counts.solvesToday);
    case "lessons_today": return Math.min(challenge.target, counts.lessonsToday);
    case "solves_week":   return Math.min(challenge.target, counts.solvesWeek);
    case "lessons_week":  return Math.min(challenge.target, counts.lessonsWeek);
    case "streak_days":   return Math.min(challenge.target, counts.streakDays);
  }
}

function ChallengeCard({
  label,
  challenge,
  progress,
  accentColor,
  accentGlow,
  resetLabel,
  challengeKey,
  claimed,
  claimAction,
}: {
  label: string;
  challenge: Challenge;
  progress: number;
  accentColor: string;
  accentGlow: string;
  resetLabel: string;
  challengeKey: string;
  claimed: boolean;
  claimAction: (formData: FormData) => Promise<void>;
}) {
  const pct = Math.min(100, Math.round((progress / challenge.target) * 100));
  const done = progress >= challenge.target;

  return (
    <div
      className="flex flex-col gap-4 p-6 bg-[#0f0f1a]"
      style={{
        border: `1px solid ${
          claimed
            ? "rgba(255,255,255,0.05)"
            : done
              ? accentColor + "50"
              : "rgba(255,255,255,0.05)"
        }`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
          {label}
        </span>
        <span
          className="font-heading text-[8px] leading-none shrink-0"
          style={{ color: claimed ? "#52525b" : accentColor }}
        >
          +{challenge.xp} XP
        </span>
      </div>

      <span
        className="font-sans text-sm leading-relaxed"
        style={{ color: claimed ? "#52525b" : "#d4d4d8" }}
      >
        {challenge.text}
      </span>

      <div className="flex flex-col gap-2 mt-auto">
        <div
          className="relative h-3 w-full bg-[#1a1a26]"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: claimed ? "#3f3f46" : accentColor,
              boxShadow:
                !claimed && done
                  ? `0 0 10px ${accentGlow}`
                  : !claimed && pct > 0
                    ? `0 0 6px ${accentGlow}`
                    : undefined,
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-zinc-600">
            {progress} / {challenge.target}
          </span>
          {claimed ? (
            <span className="font-heading text-[8px] leading-none text-zinc-600">
              CLAIMED
            </span>
          ) : !done ? (
            <span className="font-sans text-xs text-zinc-700">{resetLabel}</span>
          ) : null}
        </div>
      </div>

      {done && !claimed && (
        <form action={claimAction}>
          <input type="hidden" name="challengeKey" value={challengeKey} />
          <input type="hidden" name="xp" value={challenge.xp.toString()} />
          <button
            type="submit"
            className="w-full font-heading text-[10px] leading-none text-[#0d0d14] py-3 transition-all duration-75 hover:brightness-110 active:translate-y-[2px]"
            style={{
              backgroundColor: accentColor,
              boxShadow: `3px 3px 0px rgba(0,0,0,0.5)`,
            }}
          >
            CLAIM +{challenge.xp} XP
          </button>
        </form>
      )}
    </div>
  );
}

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

  // Date helpers for challenge windows (UTC)
  const now = new Date();
  const todayUTC = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const utcDay = now.getUTCDay(); // 0=Sun,1=Mon,...
  const daysFromMonday = utcDay === 0 ? 6 : utcDay - 1;
  const weekStartDate = new Date(now);
  weekStartDate.setUTCDate(now.getUTCDate() - daysFromMonday);
  const weekStartUTC = weekStartDate.toISOString().split("T")[0];

  const dailyKey  = `daily_${todayUTC}`;
  const weeklyKey = `weekly_${weekStartUTC}`;

  const [challengeSolvesTodayRes, challengeLessonsTodayRes, challengeSolvesWeekRes, challengeLessonsWeekRes, claimedRes] =
    await Promise.all([
      supabase
        .from("solve_times")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .gte("created_at", `${todayUTC}T00:00:00.000Z`),
      supabase
        .from("lesson_completions")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .gte("completed_at", `${todayUTC}T00:00:00.000Z`),
      supabase
        .from("solve_times")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .gte("created_at", `${weekStartUTC}T00:00:00.000Z`),
      supabase
        .from("lesson_completions")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .gte("completed_at", `${weekStartUTC}T00:00:00.000Z`),
      supabase
        .from("challenge_completions")
        .select("challenge_key")
        .eq("user_id", user.id)
        .in("challenge_key", [dailyKey, weeklyKey]),
    ]);

  const claimedKeys = new Set((claimedRes.data ?? []).map((r) => r.challenge_key));

  const challengeCounts = {
    solvesToday:  challengeSolvesTodayRes.count  ?? 0,
    lessonsToday: challengeLessonsTodayRes.count ?? 0,
    solvesWeek:   challengeSolvesWeekRes.count   ?? 0,
    lessonsWeek:  challengeLessonsWeekRes.count  ?? 0,
    streakDays:   profile.current_streak,
  };

  const dailyChallenge  = getDailyChallenge(todayUTC);
  const weeklyChallenge = getWeeklyChallenge(weekStartUTC);
  const dailyProgress   = getChallengeProgress(dailyChallenge,  challengeCounts);
  const weeklyProgress  = getChallengeProgress(weeklyChallenge, challengeCounts);
  const dailyClaimed    = claimedKeys.has(dailyKey);
  const weeklyClaimed   = claimedKeys.has(weeklyKey);

  // Format reset countdowns
  const msUntilMidnight = new Date(`${todayUTC}T00:00:00.000Z`).getTime() + 86400000 - now.getTime();
  const hrsUntilMidnight = Math.floor(msUntilMidnight / 3600000);
  const minsUntilMidnight = Math.floor((msUntilMidnight % 3600000) / 60000);
  const dailyResetLabel = `resets in ${hrsUntilMidnight}h ${minsUntilMidnight}m`;

  const nextMonday = new Date(weekStartDate);
  nextMonday.setUTCDate(weekStartDate.getUTCDate() + 7);
  const msUntilWeekEnd = nextMonday.getTime() - now.getTime();
  const daysUntilWeekEnd = Math.floor(msUntilWeekEnd / 86400000);
  const weeklyResetLabel = daysUntilWeekEnd === 0 ? "resets tomorrow" : `resets in ${daysUntilWeekEnd}d`;

  const rank = getRankInfo(profile.total_xp);
  const xpInTier = profile.total_xp - rank.start;
  const xpNeeded = rank.end - rank.start;
  const xpProgress =
    rank.end >= 999999
      ? 100
      : Math.min(100, Math.round((xpInTier / xpNeeded) * 100));

  const displayName = user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Cuber";

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

  const STAT_COLORS = ["#009B48", "#FFD500", "#4FC3F7", "#a855f7"];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 30% at 50% 0%, ${rank.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl w-full px-6 py-14 flex flex-col gap-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <RankBadge name={rank.rank} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
              WELCOME BACK
            </span>
            <span
              className="font-heading leading-none"
              style={{ fontSize: "clamp(16px, 3vw, 24px)", color: "#ffffff" }}
            >
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
              <span className="font-sans text-xs text-zinc-600">
                · {profile.total_xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* XP progress bar */}
        <div
          className="flex flex-col gap-4 p-6 bg-[#0f0f1a]"
          style={{ border: `1px solid ${rank.color}28` }}
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
                boxShadow: `0 0 16px ${rank.glow}`,
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
              {xpInTier.toLocaleString()} / {xpNeeded.toLocaleString()} XP to next tier
            </span>
            <span className="font-heading text-[9px] text-zinc-600">
              {Math.max(0, xpNeeded - xpInTier).toLocaleString()} XP remaining
            </span>
          </div>
        </div>

        {/* Streak card */}
        <div
          className="flex items-center gap-5 p-6 bg-[#0f0f1a]"
          style={{
            border: profile.current_streak > 0
              ? "1px solid rgba(255,88,0,0.3)"
              : "1px solid rgba(255,255,255,0.05)",
            boxShadow: profile.current_streak > 0
              ? "0 0 24px rgba(255,88,0,0.08)"
              : undefined,
          }}
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
            {profile.freeze_used_date === todayUTC ? (
              <FreezeTimer />
            ) : profile.streak_freeze_available ? (
              <form action={useStreakFreeze}>
                <button
                  type="submit"
                  className="font-heading text-[8px] tracking-widest mt-0.5 px-2 py-1 transition-colors"
                  style={{
                    color: "#4FC3F7",
                    border: "1px solid rgba(79,195,247,0.3)",
                    backgroundColor: "rgba(79,195,247,0.06)",
                  }}
                >
                  USE FREEZE
                </button>
              </form>
            ) : (
              <span className="font-sans text-xs text-zinc-600 mt-0.5">
                {profile.streak_freeze_available
                  ? "1 freeze available"
                  : "no freeze available"}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_STATS.map(({ label, value, sub }, i) => (
            <div
              key={label}
              className="flex flex-col gap-3 p-5 bg-[#0f0f1a]"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="h-[2px] w-6" style={{ backgroundColor: STAT_COLORS[i] }} />
              <span className="font-heading text-[8px] text-zinc-600 tracking-widest leading-relaxed">
                {label}
              </span>
              <span
                className="font-heading text-xl leading-none"
                style={{ color: STAT_COLORS[i] }}
              >
                {value}
              </span>
              <span className="font-sans text-xs text-zinc-700">{sub}</span>
            </div>
          ))}
        </div>

        {/* Daily & Weekly Challenges */}
        <div className="flex flex-col gap-3">
          <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
            CHALLENGES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChallengeCard
              label="DAILY CHALLENGE"
              challenge={dailyChallenge}
              progress={dailyProgress}
              accentColor="#FFD500"
              accentGlow="rgba(255,213,0,0.5)"
              resetLabel={dailyResetLabel}
              challengeKey={dailyKey}
              claimed={dailyClaimed}
              claimAction={claimChallengeXP}
            />
            <ChallengeCard
              label="WEEKLY CHALLENGE"
              challenge={weeklyChallenge}
              progress={weeklyProgress}
              accentColor="#4FC3F7"
              accentGlow="rgba(79,195,247,0.5)"
              resetLabel={weeklyResetLabel}
              challengeKey={weeklyKey}
              claimed={weeklyClaimed}
              claimAction={claimChallengeXP}
            />
          </div>
        </div>

        {/* Continue Learning */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-[#0f0f1a]"
          style={{ border: "1px solid rgba(255,213,0,0.15)" }}
        >
          <div className="flex flex-col gap-2">
            <span className="font-heading text-[9px] text-zinc-500 tracking-widest">
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
    </div>
  );
}
