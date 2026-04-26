"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAndSetRankupCookie } from "@/lib/rankup";
import { getStreakMultiplierForUser } from "@/lib/streak";

const VALID_MEMORY_XP = new Set([3, 8, 10, 15]);

export async function awardMemoryXP(
  amount: number,
  algorithmId: string,
): Promise<{ ok: true } | { error: string }> {
  if (!VALID_MEMORY_XP.has(amount)) return { error: "invalid_amount" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_logged_in" };

  const multiplier = await getStreakMultiplierForUser(supabase, user.id);
  const finalAmount = Math.round(amount * multiplier);
  await checkAndSetRankupCookie(supabase, user.id, finalAmount);
  await supabase.rpc("increment_xp", { user_id: user.id, amount: finalAmount });

  await supabase.from("algorithm_progress").upsert(
    { user_id: user.id, algorithm_id: algorithmId, mastered: true },
    { onConflict: "user_id,algorithm_id" },
  );

  return { ok: true };
}
