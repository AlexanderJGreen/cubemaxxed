import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES } from "../data";

type LessonStatus = "completed" | "available" | "locked";

// Hardcoded status — 1.1 is available, everything else locked
function getLessonStatus(lessonNumber: string): LessonStatus {
  if (lessonNumber === "1.1") return "available";
  return "locked";
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageParam } = await params;
  const stageNum = parseInt(stageParam, 10);
  const stage = STAGES[stageNum];

  if (!stage) notFound();

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14">

      {/* Back link */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors mb-10 tracking-widest"
      >
        ← ALL STAGES
      </Link>

      {/* Stage header */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center font-heading text-[10px] leading-none flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              backgroundColor: `${stage.color}18`,
              border: `2px solid ${stage.color}`,
              color: stage.color,
            }}
          >
            {stage.number}
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="font-sans text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: stage.color }}
            >
              Stage {stage.number}
            </span>
            <h1
              className="font-heading text-white leading-snug"
              style={{ fontSize: "clamp(12px, 2vw, 18px)" }}
            >
              {stage.title}
            </h1>
          </div>
        </div>

        <p className="font-sans text-sm text-zinc-500 leading-relaxed">
          {stage.goal}
        </p>

        {/* Stage meta strip */}
        <div
          className="flex items-center gap-6 py-3 px-4 mt-1"
          style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[8px] text-zinc-700">LESSONS</span>
            <span className="font-heading text-sm" style={{ color: stage.color }}>
              {stage.lessons.length}
            </span>
          </div>
          <div className="w-px h-7 bg-white/5" />
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[8px] text-zinc-700">XP PER LESSON</span>
            <span className="font-heading text-sm" style={{ color: stage.color }}>
              {stage.xpPerLesson}
            </span>
          </div>
          <div className="w-px h-7 bg-white/5" />
          <div className="flex flex-col gap-1">
            <span className="font-heading text-[8px] text-zinc-700">TOTAL XP</span>
            <span className="font-heading text-sm" style={{ color: stage.color }}>
              {(stage.lessons.length * stage.xpPerLesson).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col">
        {stage.lessons.map((lesson, i) => {
          const status = getLessonStatus(lesson.number);
          const isLast = i === stage.lessons.length - 1;
          const isAvailable = status === "available";
          const isCompleted = status === "completed";
          const isLocked = status === "locked";
          const lessonIndex = i + 1;

          return (
            <div key={lesson.number} className="flex gap-0">

              {/* Left column: node + connector */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
                {i > 0 && (
                  <div
                    className="w-px flex-shrink-0"
                    style={{
                      height: 20,
                      backgroundColor: isLocked ? "rgba(255,255,255,0.04)" : `${stage.color}25`,
                    }}
                  />
                )}
                <div
                  className="flex items-center justify-center font-heading text-[9px] leading-none flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: isCompleted ? stage.color : isAvailable ? `${stage.color}20` : "#0f0f1a",
                    border: `1px solid ${isLocked ? "rgba(255,255,255,0.07)" : stage.color}`,
                    color: isCompleted ? "#0d0d14" : isLocked ? "#2a2a3a" : stage.color,
                  }}
                >
                  {isCompleted ? "✓" : lessonIndex}
                </div>
                {!isLast && (
                  <div
                    className="w-px flex-1"
                    style={{
                      minHeight: 20,
                      backgroundColor: isLocked ? "rgba(255,255,255,0.04)" : `${stage.color}25`,
                    }}
                  />
                )}
              </div>

              {/* Lesson row */}
              <div className="flex-1 pb-3 pl-4">
                <div
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150"
                  style={{
                    backgroundColor: isAvailable ? `${stage.color}08` : "#0a0a12",
                    border: `1px solid ${isAvailable ? `${stage.color}35` : "rgba(255,255,255,0.04)"}`,
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className="font-heading text-[9px] leading-none flex-shrink-0"
                      style={{ color: isLocked ? "#2a2a3a" : stage.color }}
                    >
                      {lesson.number}
                    </span>
                    <span
                      className="font-sans text-sm leading-snug truncate"
                      style={{ color: isLocked ? "#2a2a3a" : "#d4d4d8" }}
                    >
                      {lesson.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="font-heading text-[8px] leading-none"
                      style={{ color: isLocked ? "#1e1e2a" : "#3f3f46" }}
                    >
                      +{stage.xpPerLesson} XP
                    </span>

                    {isCompleted && (
                      <span className="font-heading text-[8px] leading-none text-[#009B48]">DONE</span>
                    )}
                    {isAvailable && (
                      <Link
                        href={`/learn/${stage.number}/${lessonIndex}`}
                        className="font-heading text-[9px] leading-none px-2 py-1 transition-colors hover:brightness-110"
                        style={{ color: stage.color, border: `1px solid ${stage.color}` }}
                      >
                        START
                      </Link>
                    )}
                    {isLocked && (
                      <span className="font-heading text-[9px] leading-none text-zinc-800">■</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
