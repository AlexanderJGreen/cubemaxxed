import { login } from "@/app/auth/actions";

const FLOATERS = [
  { color: "var(--accent-danger)", size: 6, left: "8%", delay: "0s", duration: "10s" },
  { color: "var(--accent)", size: 10, left: "22%", delay: "2s", duration: "13s" },
  { color: "var(--accent-success)", size: 5, left: "60%", delay: "3.5s", duration: "11s" },
  { color: "#0051A2", size: 8, left: "78%", delay: "1s", duration: "14s" },
  { color: "var(--accent-streak)", size: 6, left: "90%", delay: "5s", duration: "10s" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 55%, transparent 100%)",
        }}
      />

      {/* Yellow glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,213,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating pixels */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            backgroundColor: f.color,
            opacity: 0.5,
            animation: `floatUp ${f.duration} ${f.delay} linear infinite`,
          }}
        />
      ))}

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 sm:p-10"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Pixel cube accent */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-[2px] p-[3px] bg-[var(--bg-inset)]">
            {["#C41E3A","#FFD500","#0051A2","#FF5800","#009B48","#ffffff","#FFD500","#C41E3A","#0051A2"].map(
              (color, i) => (
                <div key={i} style={{ width: 8, height: 8, backgroundColor: color }} />
              )
            )}
          </div>
        </div>

        <h1
          className="font-heading mb-2 text-center text-xl text-[var(--accent)]"
          style={{ textShadow: "2px 2px 0 var(--accent-danger)" }}
        >
          SIGN IN
        </h1>
        <p className="font-sans mb-8 text-center text-sm text-zinc-500">
          Welcome back. Continue your journey.
        </p>

        <form className="space-y-5">
          <div>
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="font-sans w-full border border-white/10 bg-[var(--bg-base)] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="font-sans w-full border border-white/10 bg-[var(--bg-base)] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-sans border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            formAction={login}
            className="font-heading mt-2 w-full bg-[var(--accent)] px-4 py-3.5 text-xs text-[var(--bg-base)] transition-all hover:brightness-110 active:translate-y-[1px] cursor-pointer"
            style={{ boxShadow: "3px 3px 0px var(--accent-shadow)" }}
          >
            SIGN IN
          </button>
        </form>

        <p className="font-sans mt-6 text-center text-xs text-zinc-500">
          No account?{" "}
          <a href="/auth/signup" className="text-[var(--accent)] hover:underline">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}
