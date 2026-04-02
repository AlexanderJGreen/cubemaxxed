import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 overflow-hidden">
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

      <div
        className="relative z-10 w-full max-w-md p-8 sm:p-10 text-center"
        style={{
          backgroundColor: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Pixel envelope icon */}
        <div className="flex justify-center mb-6">
          <div className="grid gap-[2px] p-[3px] bg-[#1a1a26]" style={{ display: "inline-grid", gridTemplateColumns: "repeat(7, 8px)" }}>
            {[
              "#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500",
              "#FFD500","#a38a00","#FFD500","#FFD500","#FFD500","#a38a00","#FFD500",
              "#FFD500","#FFD500","#a38a00","#FFD500","#a38a00","#FFD500","#FFD500",
              "#FFD500","#FFD500","#FFD500","#a38a00","#FFD500","#FFD500","#FFD500",
              "#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500",
            ].map((color, i) => (
              <div key={i} style={{ width: 8, height: 8, backgroundColor: color }} />
            ))}
          </div>
        </div>

        <h1
          className="font-heading mb-2 text-xl text-[#FFD500]"
          style={{ textShadow: "2px 2px 0 #C41E3A" }}
        >
          CHECK YOUR EMAIL
        </h1>
        <p className="font-sans mb-6 text-sm text-zinc-400 leading-relaxed">
          We sent a confirmation link to your inbox. Click it to activate your account and start cubing.
        </p>

        <p className="font-sans text-xs text-zinc-600">
          Wrong email?{" "}
          <Link href="/auth/signup" className="text-[#FFD500] hover:underline">
            Sign up again
          </Link>
          {" "}·{" "}
          <Link href="/auth/login" className="text-[#FFD500] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
