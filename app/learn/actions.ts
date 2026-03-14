"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STAGES } from "./data";

export async function completeLesson(lessonId: string, stageNum: number, xpReward: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Record lesson completion (ignore if already completed)
  const { error } = await supabase.from("lesson_completions").insert({
    user_id: user.id,
    lesson_id: lessonId,
    stage: stageNum,
    xp_earned: xpReward,
  });

  // If already completed (unique constraint), don't award XP again
  if (error) {
    // Just navigate forward without re-awarding XP
  } else {
    // Award XP
    await supabase.rpc("increment_xp", { user_id: user.id, amount: xpReward });

    // Check and unlock achievements
    const { count: lessonCount } = await supabase
      .from("lesson_completions")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);

    const achievements = [];
    if (lessonCount === 1) achievements.push("first_steps");

    // Check if stage 2 completed
    const stage2Lessons = STAGES[2].lessons.map((l) => l.number);
    const { count: stage2Count } = await supabase
      .from("lesson_completions")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .in("lesson_id", stage2Lessons);
    if (stage2Count === stage2Lessons.length) achievements.push("first_solve");

    // Check if all 43 lessons completed
    if (lessonCount === 43) achievements.push("scholar");

    // Insert achievements (ignore duplicates)
    if (achievements.length > 0) {
      await supabase.from("user_achievements").upsert(
        achievements.map((id) => ({ user_id: user.id, achievement_id: id })),
        { onConflict: "user_id,achievement_id" }
      );
    }
  }

  // Navigate to next lesson or back to stage
  const stage = STAGES[stageNum];
  const lessonIndex = stage.lessons.findIndex((l) => l.number === lessonId);
  const nextLesson = stage.lessons[lessonIndex + 1];

  revalidatePath("/dashboard");
  revalidatePath("/learn");

  if (nextLesson) {
    redirect(`/learn/${stageNum}/${lessonIndex + 2}`);
  } else {
    redirect(`/learn/${stageNum}`);
  }
}
