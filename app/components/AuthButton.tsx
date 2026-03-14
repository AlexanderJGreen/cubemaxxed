import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/auth/actions";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <form>
        <button
          formAction={signout}
          className="font-sans rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
        >
          Sign out
        </button>
      </form>
    );
  }

  return (
    <a
      href="/auth/login"
      className="font-heading rounded bg-[#FFD500] px-3 py-1.5 text-[10px] text-black transition hover:bg-yellow-400"
    >
      SIGN IN
    </a>
  );
}
