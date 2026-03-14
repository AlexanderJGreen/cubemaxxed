import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STAGES } from "../data";

type LessonStatus = "completed" | "available" | "locked";

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageParam } = await params;
  const stageNum = parseInt(stageParam, 10);
  const stage = STAGES[stageNum];
  if (!stage) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const completedIds = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("lesson_completions")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("stage", stageNum);
    (data ?? []).forEach((row) => completedIds.add(row.lesson_id));
  }

  function getStatus(lessonNumber: string, index: number): LessonStatus {
    if (completedIds.has(lessonNumber)) return "completed";
    // Available if it's the first lesson, or the previous lesson is completed
    const prev = stage.lessons[index - 1];
    if (index === 0 || (prev && completedIds.has(prev.number))) return "available";
    return "locked";
  }

  const GREEN = "#009B48";

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
            style={{ width: 40, height: 40, backgroundColor: `${stage.color}18`, border: `2px solid ${stage.color}`, color: stage.color }}
          >
            {stage.number}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-semibold tracking-widest uppercase" style={{ color: stage.color }}>
              Stage {stage.number}
            </span>
            <h1 className="font-heading text-white leading-snug" style={{ fontSize: "clamp(12px, 2vw, 18px)" }}>
              {stage.title}
            </h1>
          </div>
        </div>

        <p className="font-sans text-sm text-zinc-500 leading-relaxed">{stage.goal}</p>

        {/* Stage meta strip */}
        <div className="flex items-center gap-6 py-3 px-4 mt-1" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
          {[
            { label: "LESSONS",      value: stage.lessons.length },
            { label: "XP PER LESSON", value: stage.xpPerLesson },
            { label: "TOTAL XP",     value: (stage.lessons.length * stage.xpPerLesson).toLocaleString() },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-6">
              {i > 0 && <div className="w-px h-7 bg-white/5" />}
              <div className="flex flex-col gap-1">
                <span className="font-heading text-[8px] text-zinc-700">{item.label}</span>
                <span className="font-heading text-sm" style={{ color: stage.color }}>{item.value}</span>
              </div>
            </div>
          ))}
          {user && (
            <>
              <div className="w-px h-7 bg-white/5" />
              <div className="flex flex-col gap-1">
                <span className="font-heading text-[8px] text-zinc-700">COMPLETED</span>
                <span className="font-heading text-sm" style={{ color: GREEN }}>{completedIds.size} / {stage.lessons.length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col">
        {stage.lessons.map((lesson, i) => {
          const status = getStatus(lesson.number, i);
          const isCompleted = status === "completed";
          const isAvailable = status === "available";
          const isLocked = status === "locked";
          const isLast = i === stage.lessons.length - 1;
          const lessonIndex = i + 1;

          const nodeColor = isCompleted ? GREEN : isAvailable ? stage.color : "rgba(255,255,255,0.07)";
          const textColor = isLocked ? "#2a2a3a" : "#d4d4d8";
          const labelColor = isCompleted ? GREEN : isLocked ? "#2a2a3a" : stage.color;

          return (
            <div key={lesson.number} className="flex gap-0">

              {/* Left column: node + connector */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 44 }}>
                {i > 0 && (
                  <div className="w-px flex-shrink-0" style={{ height: 20, backgroundColor: isLocked ? "rgba(255,255,255,0.04)" : `${isCompleted ? GREEN : stage.color}25` }} />
                )}
                <div
                  className="flex items-center justify-center font-heading text-[9px] leading-none flex-shrink-0"
                  style={{
                    width: 32, height: 32,
                    backgroundColor: isCompleted ? GREEN : isAvailable ? `${stage.color}20` : "#0f0f1a",
                    border: `1px solid ${nodeColor}`,
                    color: isCompleted ? "#0d0d14" : isLocked ? "#2a2a3a" : stage.color,
                    boxShadow: isCompleted ? `0 0 10px ${GREEN}60` : isAvailable ? `0 0 8px ${stage.color}30` : "none",
                  }}
                >
                  {isCompleted ? "✓" : lessonIndex}
                </div>
                {!isLast && (
                  <div className="w-px flex-1" style={{ minHeight: 20, backgroundColor: isLocked ? "rgba(255,255,255,0.04)" : `${isCompleted ? GREEN : stage.color}25` }} />
                )}
              </div>

              {/* Lesson row */}
              <div className="flex-1 pb-3 pl-4">
                <div
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150"
                  style={{
                    backgroundColor: isCompleted ? "rgba(0,155,72,0.07)" : isAvailable ? `${stage.color}08` : "#0a0a12",
                    border: `1px solid ${isCompleted ? "rgba(0,155,72,0.25)" : isAvailable ? `${stage.color}35` : "rgba(255,255,255,0.04)"}`,
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="font-heading text-[9px] leading-none flex-shrink-0" style={{ color: labelColor }}>
                      {lesson.number}
                    </span>
                    <span className="font-sans text-sm leading-snug truncate" style={{ color: textColor }}>
                      {lesson.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-heading text-[8px] leading-none" style={{ color: isLocked ? "#1e1e2a" : "#3f3f46" }}>
                      +{stage.xpPerLesson} XP
                    </span>

                    {isCompleted && (
                      <Link
                        href={`/learn/${stage.number}/${lessonIndex}`}
                        className="font-heading text-[8px] leading-none px-2 py-1"
                        style={{ color: GREEN, border: `1px solid rgba(0,155,72,0.4)` }}
                      >
                        DONE ✓
                      </Link>
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
