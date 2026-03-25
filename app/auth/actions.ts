"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  return data === null;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm_password") as string;
  const username = formData.get("username") as string;

  if (password !== confirm) {
    redirect(`/auth/signup?error=${encodeURIComponent("Passwords do not match")}`);
  }

  const available = await checkUsernameAvailable(username);
  if (!available) {
    redirect(`/auth/signup?error=${encodeURIComponent("That username is already taken")}`);
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await admin.from("profiles").upsert({ id: data.user.id, username });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
