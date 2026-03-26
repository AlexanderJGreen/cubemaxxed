"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/streak";

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

  await supabase.rpc("increment_xp", { user_id: user.id, amount: xp });
  await updateStreak(supabase, user.id);

  revalidatePath("/dashboard");
}
