import { cookies } from "next/headers";
import { getRankInfo } from "./rank";
import type { SupabaseClient } from "@supabase/supabase-js";

export type RankUpInfo = {
  rank: string;
  tier: string;
  color: string;
  glow: string;
};

/**
 * Call this BEFORE the increment_xp RPC with the amount to be awarded.
 * Reads current XP, computes rank before/after, and sets a short-lived
 * cookie if the user crosses a rank or tier boundary.
 */
export async function checkAndSetRankupCookie(
  supabase: SupabaseClient,
  userId: string,
  xpToAdd: number,
): Promise<void> {
  const { data } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  if (!data) return;

  const before = getRankInfo(data.total_xp);
  const after  = getRankInfo(data.total_xp + xpToAdd);

  if (before.rank !== after.rank || before.tier !== after.tier) {
    const cookieStore = await cookies();
    cookieStore.set(
      "rankup_pending",
      JSON.stringify({
        rank:  after.rank,
        tier:  after.tier,
        color: after.color,
        glow:  after.glow,
      } satisfies RankUpInfo),
      { maxAge: 300, path: "/", sameSite: "lax" },
    );
  }
}
