import Link from "next/link";

type Status = "completed" | "active" | "locked";

interface Stage {
  number: number;
  title: string;
  goal: string;
  lessons: number;
  xpPerLesson: number;
  color: string;
  status: Status;
  progress: number; // lessons completed
}

const STAGES: Stage[] = [
  {
    number: 1,
    title: "The Basics",
    goal: "Understand the cube, read notation, and do your first moves.",
    lessons: 5,
    xpPerLesson: 50,
    color: "#a1a1aa",
    status: "completed",
    progress: 5,
  },
  {
    number: 2,
    title: "Your First Solve",
    goal: "Solve the entire cube using the beginner layer-by-layer method.",
    lessons: 9,
    xpPerLesson: 75,
    color: "#009B48",
    status: "active",
    progress: 3,
  },
  {
    number: 3,
    title: "Getting Comfortable",
    goal: "Finger tricks, efficiency, reduce pauses. Target: sub-2:00.",
    lessons: 6,
    xpPerLesson: 100,
    color: "#0051A2",
    status: "locked",
    progress: 0,
  },
  {
    number: 4,
    title: "Intro to CFOP & The Cross",
    goal: "Understand CFOP and master the cross at a higher level.",
    lessons: 5,
    xpPerLesson: 100,
    color: "#FF5800",
    status: "locked",
    progress: 0,
  },
  {
    number: 5,
    title: "F2L (First Two Layers)",
    goal: "Learn intuitive F2L — the hardest and most rewarding stage.",
    lessons: 7,
    xpPerLesson: 125,
    color: "#C41E3A",
    status: "locked",
    progress: 0,
  },
  {
    number: 6,
    title: "2-Look OLL",
    goal: "Orient the last layer in two steps using ~9 algorithms.",
    lessons: 5,
    xpPerLesson: 150,
    color: "#FFD500",
    status: "locked",
    progress: 0,
  },
  {
    number: 7,
    title: "2-Look PLL",
    goal: "Permute the last layer and complete your full CFOP solve.",
    lessons: 6,
    xpPerLesson: 175,
    color: "#c47aff",
    status: "locked",
    progress: 0,
  },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "completed")
    return (
      <span className="font-heading text-[8px] leading-none text-[#009B48] px-2 py-1" style={{ border: "1px solid #009B48" }}>
        COMPLETE
      </span>
    );
  if (status === "active")
    return (
      <span className="font-heading text-[8px] leading-none text-[#FFD500] px-2 py-1" style={{ border: "1px solid rgba(255,213,0,0.5)" }}>
        IN PROGRESS
      </span>
    );
  return (
    <span className="font-heading text-[8px] leading-none text-zinc-600 px-2 py-1" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      LOCKED
    </span>
  );
}

export default function Learn() {
  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14">

      {/* Page header */}
      <div className="flex flex-col gap-3 mb-14">
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
          CURRICULUM
        </span>
        <h1
          className="font-heading text-white leading-snug"
          style={{ fontSize: "clamp(14px, 2.5vw, 22px)" }}
        >
          CHOOSE YOUR STAGE
        </h1>
        <p className="font-sans text-sm text-zinc-500 leading-relaxed mt-1">
          43 lessons across 7 stages. Complete each stage to unlock the next.
        </p>
      </div>

      {/* Stage path */}
      <div className="flex flex-col">
        {STAGES.map((stage, i) => {
          const isLast = i === STAGES.length - 1;
          const totalXP = stage.lessons * stage.xpPerLesson;
          const progressPct = Math.round((stage.progress / stage.lessons) * 100);
          const dimmed = stage.status === "locked";

          return (
            <div key={stage.number} className="flex gap-0">

              {/* ── Left column: node + connector line ── */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 56 }}>

                {/* Top connector */}
                {i > 0 && (
                  <div
                    className="w-px flex-shrink-0"
                    style={{
                      height: 28,
                      backgroundColor:
                        stage.status === "locked"
                          ? "rgba(255,255,255,0.04)"
                          : `${stage.color}30`,
                    }}
                  />
                )}

                {/* Node */}
                <Link href={`/learn/${stage.number}`} className="flex-shrink-0 block">
                  <div
                    className="flex items-center justify-center font-heading text-[10px] leading-none transition-opacity hover:opacity-80"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor:
                        stage.status === "completed"
                          ? stage.color
                          : stage.status === "active"
                          ? `${stage.color}18`
                          : "#13131e",
                      border: `2px solid ${dimmed ? "rgba(255,255,255,0.08)" : stage.color}`,
                      color:
                        stage.status === "completed"
                          ? "#0d0d14"
                          : dimmed
                          ? "#3a3a4a"
                          : stage.color,
                      // active node pulses via CSS variable + keyframe
                      ...(stage.status === "active" && {
                        ["--node-color" as string]: `${stage.color}80`,
                        animation: "nodeGlow 2.5s ease-in-out infinite",
                      }),
                    }}
                  >
                    {stage.status === "completed" ? "✓" : stage.number}
                  </div>
                </Link>

                {/* Bottom connector */}
                {!isLast && (
                  <div
                    className="w-px flex-1"
                    style={{
                      minHeight: 28,
                      backgroundColor:
                        stage.status === "completed"
                          ? `${stage.color}30`
                          : "rgba(255,255,255,0.04)",
                    }}
                  />
                )}
              </div>

              {/* ── Right column: stage card ── */}
              <div className={`flex-1 pb-5 pl-5 ${i === 0 ? "" : "pt-0"}`} style={{ paddingTop: i === 0 ? 0 : 0 }}>
                <Link href={`/learn/${stage.number}`} className="block group">
                  <div
                    className="flex flex-col gap-4 p-5 transition-colors duration-200"
                    style={{
                      backgroundColor:
                        stage.status === "active" ? `${stage.color}08` : "#0f0f1a",
                      border:
                        stage.status === "active"
                          ? `1px solid ${stage.color}40`
                          : stage.status === "completed"
                          ? `1px solid ${stage.color}20`
                          : "1px solid rgba(255,255,255,0.04)",
                      opacity: dimmed ? 0.55 : 1,
                    }}
                  >
                    {/* Card top row: title + status badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className="font-sans text-[10px] font-semibold tracking-widest uppercase"
                          style={{ color: dimmed ? "#3a3a4a" : stage.color }}
                        >
                          Stage {stage.number}
                        </span>
                        <h2
                          className="font-heading leading-snug"
                          style={{
                            fontSize: "11px",
                            color: dimmed ? "#3a3a4a" : "#ededed",
                          }}
                        >
                          {stage.title}
                        </h2>
                      </div>
                      <StatusBadge status={stage.status} />
                    </div>

                    {/* Goal */}
                    <p
                      className="font-sans text-sm leading-relaxed"
                      style={{ color: dimmed ? "#2a2a3a" : "#71717a" }}
                    >
                      {stage.goal}
                    </p>

                    {/* Progress bar — active stage only */}
                    {stage.status === "active" && (
                      <div className="flex flex-col gap-1.5">
                        <div
                          className="relative h-2 w-full bg-[#1a1a26]"
                          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="absolute inset-y-0 left-0"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: stage.color,
                              boxShadow: `0 0 8px ${stage.color}80`,
                            }}
                          />
                        </div>
                        <span className="font-heading text-[8px] text-zinc-600">
                          {stage.progress} / {stage.lessons} LESSONS
                        </span>
                      </div>
                    )}

                    {/* Bottom row: lesson count + XP */}
                    <div className="flex items-center gap-4">
                      <span
                        className="font-heading text-[8px] leading-none"
                        style={{ color: dimmed ? "#2a2a3a" : "#52525b" }}
                      >
                        {stage.lessons} LESSONS
                      </span>
                      <span
                        className="font-heading text-[8px] leading-none"
                        style={{ color: dimmed ? "#2a2a3a" : "#52525b" }}
                      >
                        {totalXP.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer total */}
      <div
        className="mt-6 ml-14 flex items-center gap-6 py-4 px-5"
        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-heading text-[8px] text-zinc-700">TOTAL LESSONS</span>
          <span className="font-heading text-sm text-zinc-400">43</span>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="flex flex-col gap-1">
          <span className="font-heading text-[8px] text-zinc-700">TOTAL XP AVAILABLE</span>
          <span className="font-heading text-sm text-zinc-400">4,700</span>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="flex flex-col gap-1">
          <span className="font-heading text-[8px] text-zinc-700">YOUR PROGRESS</span>
          <span className="font-heading text-sm text-zinc-400">8 / 43</span>
        </div>
      </div>

    </div>
  );
}
