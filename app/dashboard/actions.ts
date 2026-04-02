"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/streak";
import { checkAndSetRankupCookie } from "@/lib/rankup";

export async function useStreakFreeze(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_freeze_available, last_xp_date, current_streak")
    .eq("id", user.id)
    .single();

  if (!profile?.streak_freeze_available) return;
  if (!profile.current_streak) return;

  const today = new Date().toISOString().slice(0, 10);

  await supabase
    .from("profiles")
    .update({ streak_freeze_available: false, last_xp_date: today, freeze_used_date: today })
    .eq("id", user.id);

  revalidatePath("/dashboard");
}

export async function claimChallengeXP(formData: FormData): Promise<void> {
  const challengeKey = formData.get("challengeKey") as string;
  const xp = parseInt(formData.get("xp") as string, 10);

  if (!challengeKey || isNaN(xp) || xp <= 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // UNIQUE(user_id, challenge_key) constraint prevents double-claiming —
  // if already claimed this will return a conflict error and we bail out.
  const { error } = await supabase
    .from("challenge_completions")
    .insert({ user_id: user.id, challenge_key: challengeKey, xp_awarded: xp });

  if (error) return;

  await checkAndSetRankupCookie(supabase, user.id, xp);
  await supabase.rpc("increment_xp", { user_id: user.id, amount: xp });
  await updateStreak(supabase, user.id);

  revalidatePath("/dashboard");
}
