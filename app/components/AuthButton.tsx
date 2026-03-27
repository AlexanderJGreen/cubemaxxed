import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/auth/actions";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <form className="flex items-center">
        <button
          formAction={signout}
          className="font-sans text-[15px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-300 cursor-pointer pb-1"
        >
          Sign out
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href="/auth/login"
        className="font-sans text-[15px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-300"
      >
        Sign in
      </a>
      <a
        href="/auth/signup"
        className="font-heading bg-[#FFD500] px-3 py-1.5 text-[10px] text-black transition hover:brightness-110"
      >
        SIGN UP
      </a>
    </div>
  );
}
