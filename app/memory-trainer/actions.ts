"use server";

import { createClient } from "@/lib/supabase/server";

export async function awardMemoryXP(
  amount: number,
): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "not_logged_in" };

  await supabase.rpc("increment_xp", { user_id: user.id, amount });
  return { ok: true };
}
