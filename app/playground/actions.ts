"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/streak";

const ACHIEVEMENT_THRESHOLDS = [
  { id: "sub_120", ms: 120_000 },
  { id: "sub_60",  ms:  60_000 },
  { id: "sub_45",  ms:  45_000 },
  { id: "sub_30",  ms:  30_000 },
];

const PRACTICE_MILESTONES: Record<number, string> = {
  10:    "getting_started",
  100:   "century",
  1000:  "thousand_club",
};

export async function saveSolve(
  time_ms: number,
  scramble: string,
  localDate?: string,
  localHour?: number,
  xp: number = 5,
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // silently skip if not logged in

  // Insert solve
  await supabase.from("solve_times").insert({
    user_id: user.id,
    time_ms,
    scramble,
  });

  await supabase.rpc("increment_xp", { user_id: user.id, amount: xp });
  await updateStreak(supabase, user.id, localDate);

  // --- Achievement checks ---
  const achievements: string[] = [];

  // Speed achievements
  for (const { id, ms } of ACHIEVEMENT_THRESHOLDS) {
    if (time_ms < ms) achievements.push(id);
  }

  // Practice milestone achievements
  const { count: totalSolves } = await supabase
    .from("solve_times")
    .select("id", { count: "exact" })
    .eq("user_id", user.id);

  if (totalSolves !== null) {
    for (const [threshold, id] of Object.entries(PRACTICE_MILESTONES)) {
      if (totalSolves >= Number(threshold)) achievements.push(id);
    }
  }

  // Hidden: Night Owl — solve logged between midnight and 3:59 AM
  if (localHour !== undefined && localHour < 4) {
    achievements.push("night_owl");
  }

  // Hidden: Early Bird — solve logged between 4 AM and 5:59 AM
  if (localHour !== undefined && localHour >= 4 && localHour < 6) {
    achievements.push("early_bird");
  }

  // Hidden: Speed Demon — 20+ solves in a single day
  if (localDate && totalSolves !== null) {
    const { count: todaySolves } = await supabase
      .from("solve_times")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", `${localDate}T00:00:00`)
      .lt("created_at", `${localDate}T23:59:59`);
    if (todaySolves !== null && todaySolves >= 20) {
      achievements.push("speed_demon");
    }
  }

  // Hidden: Perfectionist — set 5+ personal bests in the past 7 days
  // A PB is any solve faster than all solves that came before it.
  // Strategy: find the best time from before 7 days ago, then count
  // how many solves in the past 7 days beat that baseline (each
  // successive one sets a new PB within the window).
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  const { data: oldBestRow } = await supabase
    .from("solve_times")
    .select("time_ms")
    .eq("user_id", user.id)
    .lt("created_at", sevenDaysAgoStr)
    .order("time_ms", { ascending: true })
    .limit(1)
    .single();

  const { data: recentSolves } = await supabase
    .from("solve_times")
    .select("time_ms")
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgoStr)
    .order("time_ms", { ascending: true });

  if (recentSolves) {
    let runningBest = oldBestRow?.time_ms ?? Infinity;
    let pbCount = 0;
    // iterate in chronological order (fastest first is wrong — we need created_at order)
    // re-query in time order for correctness
    const { data: recentChron } = await supabase
      .from("solve_times")
      .select("time_ms")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgoStr)
      .order("created_at", { ascending: true });

    for (const row of recentChron ?? []) {
      if (row.time_ms < runningBest) {
        runningBest = row.time_ms;
        pbCount++;
      }
    }
    if (pbCount >= 5) achievements.push("perfectionist");
  }

  if (achievements.length > 0) {
    await supabase.from("user_achievements").upsert(
      achievements.map((id) => ({ user_id: user.id, achievement_id: id })),
      { onConflict: "user_id,achievement_id" },
    );
  }

  revalidatePath("/dashboard");
}

// ─── Algorithm Trainer ───────────────────────────────────────────────────────

export type AlgProgressRecord = {
  mastered: boolean;
  correct_streak: number;
  times_seen: number;
  times_correct: number;
};

const ALG_MILESTONES: Record<number, string> = {
  10: "alg_apprentice",
  20: "alg_expert",
};

export async function getAlgorithmProgress(): Promise<Record<string, AlgProgressRecord>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("algorithm_progress")
    .select("algorithm_id, mastered, correct_streak, times_seen, times_correct")
    .eq("user_id", user.id);

  const result: Record<string, AlgProgressRecord> = {};
  for (const row of data ?? []) {
    result[row.algorithm_id] = {
      mastered:       row.mastered        ?? false,
      correct_streak: row.correct_streak  ?? 0,
      times_seen:     row.times_seen      ?? 0,
      times_correct:  row.times_correct   ?? 0,
    };
  }
  return result;
}

export async function recordAlgorithmAnswer(
  algorithmId: string,
  newStreak: number,
  timesSeenTotal: number,
  timesCorrectTotal: number,
  mastered: boolean,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("algorithm_progress").upsert(
    {
      user_id:        user.id,
      algorithm_id:   algorithmId,
      mastered,
      correct_streak: newStreak,
      times_seen:     timesSeenTotal,
      times_correct:  timesCorrectTotal,
    },
    { onConflict: "user_id,algorithm_id" },
  );

  if (mastered) {
    await supabase.rpc("increment_xp", { user_id: user.id, amount: 30 });
    await updateStreak(supabase, user.id);

    const { count } = await supabase
      .from("algorithm_progress")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("mastered", true);

    if (count !== null) {
      const achievements = Object.entries(ALG_MILESTONES)
        .filter(([threshold]) => count >= Number(threshold))
        .map(([, id]) => ({ user_id: user.id, achievement_id: id }));

      if (achievements.length > 0) {
        await supabase.from("user_achievements").upsert(achievements, {
          onConflict: "user_id,achievement_id",
        });
      }
    }

    revalidatePath("/dashboard");
  }
}
