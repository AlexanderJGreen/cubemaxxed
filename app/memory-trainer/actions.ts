"use server";

import { createClient } from "@/lib/supabase/server";

export async function awardMemoryXP(
  amount: number,
  algorithmId: string,
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_logged_in" };

  await supabase.rpc("increment_xp", { user_id: user.id, amount });

  await supabase.from("algorithm_progress").upsert(
    { user_id: user.id, algorithm_id: algorithmId, mastered: true },
    { onConflict: "user_id,algorithm_id" },
  );

  return { ok: true };
}
