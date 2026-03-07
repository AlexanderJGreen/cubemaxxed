import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES } from "../../data";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ stage: string; lesson: string }>;
}) {
  const { stage: stageParam, lesson: lessonParam } = await params;
  const stageNum  = parseInt(stageParam, 10);
  const lessonIdx = parseInt(lessonParam, 10); // 1-based index

  const stage  = STAGES[stageNum];
  const lesson = stage?.lessons[lessonIdx - 1];

  if (!stage || !lesson) notFound();

  const isFirst = lessonIdx === 1;
  const isLast  = lessonIdx === stage.lessons.length;
  const prevHref = isFirst  ? null : `/learn/${stageNum}/${lessonIdx - 1}`;
  const nextHref = isLast   ? null : `/learn/${stageNum}/${lessonIdx + 1}`;

  return (
    <div className="mx-auto max-w-2xl w-full px-6 py-14 flex flex-col gap-10">

      {/* Back link */}
      <Link
        href={`/learn/${stageNum}`}
        className="inline-flex items-center gap-2 font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
      >
        ← STAGE {stageNum}: {stage.title.toUpperCase()}
      </Link>

      {/* Lesson header */}
      <div className="flex flex-col gap-4">
        {/* Stage tag + lesson position */}
        <div className="flex items-center gap-3">
          <span
            className="font-heading text-[9px] leading-none px-2 py-1.5"
            style={{ color: stage.color, border: `1px solid ${stage.color}40` }}
          >
            STAGE {stageNum}
          </span>
          <span className="font-heading text-[9px] text-zinc-600 leading-none">
            LESSON {lessonIdx} OF {stage.lessons.length}
          </span>
        </div>

        {/* Lesson number + title */}
        <div className="flex flex-col gap-2">
          <span
            className="font-heading leading-none"
            style={{ fontSize: "11px", color: stage.color }}
          >
            {lesson.number}
          </span>
          <h1
            className="font-heading text-white leading-snug"
            style={{ fontSize: "clamp(14px, 2.5vw, 22px)" }}
          >
            {lesson.title}
          </h1>
        </div>

        {/* XP reward */}
        <span
          className="self-start font-heading text-[9px] leading-none px-2 py-1.5"
          style={{ color: "#FFD500", border: "1px solid rgba(255,213,0,0.3)" }}
        >
          +{stage.xpPerLesson} XP ON COMPLETION
        </span>
      </div>

      {/* Lesson content placeholder */}
      <div
        className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center"
        style={{
          border: "1px dashed rgba(255,255,255,0.08)",
          backgroundColor: "#0a0a12",
          minHeight: 320,
        }}
      >
        <div
          className="flex items-center justify-center font-heading text-sm leading-none"
          style={{
            width: 56,
            height: 56,
            backgroundColor: `${stage.color}12`,
            border: `2px solid ${stage.color}30`,
            color: `${stage.color}60`,
          }}
        >
          ?
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-heading text-[10px] text-zinc-700">
            LESSON CONTENT
          </span>
          <p className="font-sans text-sm text-zinc-700 max-w-xs leading-relaxed">
            Explanation, visuals, and practice exercises will appear here.
          </p>
        </div>
      </div>

      {/* Complete Lesson button + prev/next nav */}
      <div className="flex flex-col gap-6">
        {/* Complete button */}
        <button
          className="w-full font-heading text-[11px] leading-none text-[#0d0d14] bg-[#FFD500] py-4 transition-all duration-75 hover:brightness-110 active:translate-y-[2px]"
          style={{
            boxShadow: "0 4px 0px #a38a00",
          }}
        >
          COMPLETE LESSON — +{stage.xpPerLesson} XP
        </button>

        {/* Prev / Next nav */}
        <div className="flex items-center justify-between gap-4">
          {prevHref ? (
            <Link
              href={prevHref}
              className="font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
            >
              ← PREV LESSON
            </Link>
          ) : (
            <span /> /* spacer */
          )}
          {nextHref ? (
            <Link
              href={nextHref}
              className="font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
            >
              NEXT LESSON →
            </Link>
          ) : (
            <span className="font-heading text-[9px] text-zinc-800">
              LAST LESSON IN STAGE
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
