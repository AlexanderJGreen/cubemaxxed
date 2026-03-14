import { login } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1
          className="font-heading mb-2 text-center text-xl text-[#FFD500]"
          style={{ textShadow: "2px 2px 0 #C41E3A" }}
        >
          SIGN IN
        </h1>
        <p className="font-sans mb-8 text-center text-sm text-zinc-500">
          Welcome back. Continue your journey.
        </p>

        <form className="space-y-4">
          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="font-sans w-full rounded border border-zinc-700 bg-[#12121f] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="font-sans w-full rounded border border-zinc-700 bg-[#12121f] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-sans rounded border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            formAction={login}
            className="font-heading mt-2 w-full rounded bg-[#FFD500] px-4 py-3 text-xs text-black transition hover:bg-yellow-400 active:scale-95"
          >
            SIGN IN
          </button>
        </form>

        <p className="font-sans mt-6 text-center text-xs text-zinc-500">
          No account?{" "}
          <a href="/auth/signup" className="text-[#FFD500] hover:underline">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}
