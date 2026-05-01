"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidTheme } from "@/lib/themes";
import type { ThemeId } from "@/lib/themes";

export async function saveTheme(themeId: ThemeId): Promise<void> {
  if (!isValidTheme(themeId)) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ theme: themeId }).eq("id", user.id);
}
