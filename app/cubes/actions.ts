"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
