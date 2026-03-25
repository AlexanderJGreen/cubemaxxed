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
