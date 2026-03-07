import Link from "next/link";

// Scrambled cube face — all 6 colors present, deliberately mixed
const STICKERS = [
  "#FF5800", "#ffffff", "#0051A2",
  "#FFD500", "#C41E3A", "#FFD500",
  "#C41E3A", "#009B48", "#FF5800",
];

// Floating pixel squares — positioned around the hero
const FLOATERS = [
  { color: "#C41E3A", size: 7,  left: "6%",  delay: "0s",   duration: "9s"  },
  { color: "#FFD500", size: 11, left: "18%", delay: "2.5s", duration: "12s" },
  { color: "#009B48", size: 5,  left: "33%", delay: "4s",   duration: "10s" },
  { color: "#0051A2", size: 9,  left: "52%", delay: "1.2s", duration: "14s" },
  { color: "#FF5800", size: 7,  left: "67%", delay: "3.5s", duration: "11s" },
  { color: "#FFD500", size: 13, left: "80%", delay: "5.5s", duration: "13s" },
  { color: "#C41E3A", size: 5,  left: "92%", delay: "7s",   duration: "9s"  },
  { color: "#009B48", size: 8,  left: "44%", delay: "6s",   duration: "15s" },
];

const STATS = [
  { value: "43", label: "Lessons" },
  { value: "7",  label: "Stages"  },
  { value: "24", label: "Ranks"   },
];

export default function Home() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.045) 0px, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Floating pixel squares */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            backgroundColor: f.color,
            animation: `floatUp ${f.duration} ${f.delay} linear infinite`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 mx-auto max-w-6xl w-full px-6 py-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Left column — text */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Eyebrow badge */}
          <span
            className="self-start font-heading text-[9px] leading-none text-[#FFD500] px-3 py-2 tracking-widest"
            style={{ border: "1px solid rgba(255,213,0,0.35)" }}
          >
            FREE TO START
          </span>

          {/* Headline */}
          <div className="flex flex-col gap-2">
            <h1
              className="font-heading leading-snug text-zinc-300"
              style={{ fontSize: "clamp(13px, 2.2vw, 20px)" }}
            >
              LEARN TO SPEEDCUBE
            </h1>
            <span
              className="font-heading leading-none"
              style={{
                fontSize: "clamp(26px, 5.5vw, 60px)",
                color: "#FFD500",
                textShadow:
                  "0 0 40px rgba(255,213,0,0.45), 0 0 80px rgba(255,213,0,0.15)",
              }}
            >
              THE FUN WAY.
            </span>
          </div>

          {/* Subtitle */}
          <p className="font-sans text-lg text-zinc-400 max-w-md leading-relaxed">
            Structured lessons, real XP, daily streaks, and ranks that
            actually mean something. Built for total beginners. Addicting
            enough to keep you going.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
            <Link
              href="/learn"
              className="font-heading text-[11px] leading-none text-[#0d0d14] bg-[#FFD500] px-6 py-4 transition-all duration-75 hover:brightness-110 active:translate-x-[3px] active:translate-y-[3px]"
              style={{
                boxShadow: "4px 4px 0px #a38a00, 7px 7px 0px rgba(163,138,0,0.25)",
              }}
            >
              GET STARTED
            </Link>
            <span className="font-sans text-sm text-zinc-600">
              No account needed to explore
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-2 border-t border-white/5">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="font-heading text-sm text-white">{value}</span>
                <span className="font-sans text-xs text-zinc-600 uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — pixel cube */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div
            className="grid grid-cols-3 gap-[3px] p-[6px] bg-[#1a1a26]"
            style={{ animation: "cubeGlow 3.5s ease-in-out infinite" }}
          >
            {STICKERS.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 76,
                  height: 76,
                  backgroundColor: color,
                  boxShadow:
                    "inset -3px -3px 0px rgba(0,0,0,0.3), inset 2px 2px 0px rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
          <span className="font-heading text-[8px] text-zinc-700 tracking-widest">
            SCRAMBLED
          </span>
        </div>

      </div>
    </section>
  );
}
