import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Call this after awarding XP to a user.
 * Increments streak if today is a new calendar day since last XP,
 * resets to 1 if they missed a day (and no freeze available),
 * and updates longest_streak accordingly.
 */
export async function updateStreak(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_xp_date, streak_freeze_available")
    .eq("id", userId)
    .single();

  if (!profile) return;

  const todayUTC = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const lastDate: string | null = profile.last_xp_date;

  // Already recorded XP today — nothing to change
  if (lastDate === todayUTC) return;

  let newStreak: number;

  if (!lastDate) {
    // First ever XP
    newStreak = 1;
  } else {
    const last = new Date(lastDate);
    const today = new Date(todayUTC);
    const daysDiff = Math.round(
      (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 1) {
      // Consecutive day
      newStreak = (profile.current_streak ?? 0) + 1;
    } else if (daysDiff === 2 && profile.streak_freeze_available) {
      // Missed one day but freeze saves it
      newStreak = (profile.current_streak ?? 0) + 1;
      await supabase
        .from("profiles")
        .update({ streak_freeze_available: false })
        .eq("id", userId);
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(newStreak, profile.longest_streak ?? 0);

  // Check streak achievements
  const streakAchievements: string[] = [];
  if (newStreak >= 7)   streakAchievements.push("first_week");
  if (newStreak >= 30)  streakAchievements.push("monthly_grinder");
  if (newStreak >= 100) streakAchievements.push("dedicated");
  if (newStreak >= 365) streakAchievements.push("one_year_strong");

  await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_xp_date: todayUTC,
    })
    .eq("id", userId);

  if (streakAchievements.length > 0) {
    await supabase.from("user_achievements").upsert(
      streakAchievements.map((id) => ({ user_id: userId, achievement_id: id })),
      { onConflict: "user_id,achievement_id" },
    );
  }
}
