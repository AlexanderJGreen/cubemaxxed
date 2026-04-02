"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calcAo } from "@/lib/rank";

export type Cube = {
  id: string;
  name: string;
  created_at: string;
};

export async function getCubes(): Promise<Cube[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("cubes")
    .select("id, name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function renameCube(id: string, name: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const trimmed = name.trim();
  if (!trimmed) return;

  await supabase
    .from("cubes")
    .update({ name: trimmed })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/profile");
}

export async function deleteCube(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("cubes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/profile");
}

export type CubeStats = {
  totalSolves: number;
  bestSingle: number | null;
  ao5: number | null;
  ao12: number | null;
};

export async function getCubeStats(cubeId: string): Promise<CubeStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalSolves: 0, bestSingle: null, ao5: null, ao12: null };

  const { data } = await supabase
    .from("solve_times")
    .select("time_ms")
    .eq("user_id", user.id)
    .eq("cube_id", cubeId)
    .order("created_at", { ascending: false })
    .limit(100);

  const times = (data ?? []).map((s) => s.time_ms);
  return {
    totalSolves: times.length,
    bestSingle: times.length > 0 ? Math.min(...times) : null,
    ao5:  calcAo(times.slice(0, 5)),
    ao12: calcAo(times.slice(0, 12)),
  };
}

export async function addCube(name: string): Promise<Cube | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  const { data } = await supabase
    .from("cubes")
    .insert({ user_id: user.id, name: trimmed })
    .select("id, name, created_at")
    .single();

  revalidatePath("/profile");
  return data;
}
