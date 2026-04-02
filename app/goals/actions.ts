"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { calcAo } from "@/lib/rank";

export type GoalType = "single" | "ao5" | "ao12";

export type Goal = {
  id: string;
  cube_id: string | null;
  cube_name: string | null;
  goal_type: GoalType;
  target_ms: number;
  current_ms: number | null;
  achieved: boolean;
};

export async function getGoals(): Promise<Goal[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: goalsData } = await supabase
    .from("goals")
    .select("id, cube_id, goal_type, target_ms")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (!goalsData || goalsData.length === 0) return [];

  const { data: cubesData } = await supabase
    .from("cubes")
    .select("id, name")
    .eq("user_id", user.id);

  const cubeMap = new Map((cubesData ?? []).map((c) => [c.id, c.name]));

  const goals: Goal[] = [];

  for (const g of goalsData) {
    let current_ms: number | null = null;

    if (g.goal_type === "single") {
      let q = supabase
        .from("solve_times")
        .select("time_ms")
        .eq("user_id", user.id)
        .order("time_ms", { ascending: true })
        .limit(1);
      if (g.cube_id) q = q.eq("cube_id", g.cube_id);
      const { data } = await q;
      current_ms = data?.[0]?.time_ms ?? null;
    } else {
      const limit = g.goal_type === "ao5" ? 5 : 12;
      let q = supabase
        .from("solve_times")
        .select("time_ms")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (g.cube_id) q = q.eq("cube_id", g.cube_id);
      const { data } = await q;
      const times = (data ?? []).map((s) => s.time_ms);
      current_ms = calcAo(times);
    }

    goals.push({
      id: g.id,
      cube_id: g.cube_id,
      cube_name: g.cube_id ? (cubeMap.get(g.cube_id) ?? "Unknown") : null,
      goal_type: g.goal_type as GoalType,
      target_ms: g.target_ms,
      current_ms,
      achieved: current_ms !== null && current_ms <= g.target_ms,
    });
  }

  return goals;
}

export async function addGoal(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const cube_id = formData.get("cube_id") as string;
  const goal_type = formData.get("goal_type") as string;
  const target_input = formData.get("target") as string;

  if (!goal_type || !target_input) return;

  const target_ms = parseTimeToMs(target_input.trim());
  if (!target_ms || target_ms <= 0) return;

  await supabase.from("goals").insert({
    user_id: user.id,
    cube_id: cube_id === "all" || !cube_id ? null : cube_id,
    goal_type,
    target_ms,
  });

  revalidatePath("/profile");
}

export async function deleteGoal(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/profile");
}

// Parses "30", "30.5", "1:23", "1:23.45" → milliseconds
function parseTimeToMs(input: string): number | null {
  const colonIdx = input.indexOf(":");
  if (colonIdx !== -1) {
    const mins = parseInt(input.slice(0, colonIdx), 10);
    const secs = parseFloat(input.slice(colonIdx + 1));
    if (isNaN(mins) || isNaN(secs)) return null;
    return Math.round((mins * 60 + secs) * 1000);
  }
  const secs = parseFloat(input);
  if (isNaN(secs)) return null;
  return Math.round(secs * 1000);
}
