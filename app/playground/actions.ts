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

  // Award 5 XP
  await supabase.rpc("increment_xp", { user_id: user.id, amount: 5 });
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
  10: "algorithm_apprentice",
  20: "algorithm_expert",
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
