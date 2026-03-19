import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STAGES } from "../../data";
import { LESSON_CONTENT, type Block } from "../../content";
import { completeLesson } from "../../actions";
import F2LDiagram from "@/app/components/F2LDiagram";

function renderBlock(block: Block, stageColor: string) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={block.text}
          className="font-heading text-white mt-8 mb-3"
          style={{ fontSize: "clamp(11px, 1.8vw, 14px)", lineHeight: 1.5 }}
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p
          key={block.text.slice(0, 40)}
          className="font-sans text-zinc-300 leading-relaxed text-[15px]"
        >
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={block.items[0]} className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="font-sans text-zinc-300 text-[14px] leading-relaxed flex gap-3"
            >
              <span style={{ color: stageColor, flexShrink: 0 }}>▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div
          key={block.text.slice(0, 40)}
          className="flex gap-3 p-4 rounded"
          style={{
            backgroundColor: "rgba(255,213,0,0.06)",
            border: "1px solid rgba(255,213,0,0.2)",
          }}
        >
          <span className="font-heading text-[9px] text-[#FFD500] mt-0.5 flex-shrink-0">
            TIP
          </span>
          <p className="font-sans text-zinc-300 text-[14px] leading-relaxed">
            {block.text}
          </p>
        </div>
      );
    case "warn":
      return (
        <div
          key={block.text.slice(0, 40)}
          className="flex gap-3 p-4 rounded"
          style={{
            backgroundColor: "rgba(196,30,58,0.06)",
            border: "1px solid rgba(196,30,58,0.25)",
          }}
        >
          <span className="font-heading text-[9px] text-[#C41E3A] mt-0.5 flex-shrink-0">
            NOTE
          </span>
          <p className="font-sans text-zinc-300 text-[14px] leading-relaxed">
            {block.text}
          </p>
        </div>
      );
    case "algo":
      return (
        <div
          key={block.name}
          className="flex flex-col gap-3 p-5"
          style={{
            backgroundColor: "#0a0a14",
            border: `1px solid ${stageColor}30`,
          }}
        >
          <span
            className="font-heading text-[9px] tracking-widest"
            style={{ color: stageColor }}
          >
            {block.name.toUpperCase()}
          </span>
          <span className="font-heading text-xl text-white tracking-widest">
            {block.moves}
          </span>
          {block.note && (
            <p className="font-sans text-zinc-500 text-xs leading-relaxed">
              {block.note}
            </p>
          )}
        </div>
      );
    case "table":
      return (
        <div key={block.headers[0]} className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="font-heading text-left text-[9px] tracking-widest text-zinc-600 pb-3 pr-6"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="font-sans text-sm text-zinc-300 py-2.5 pr-6"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      {j === 0 ? (
                        <span
                          className="font-heading text-xs"
                          style={{ color: stageColor }}
                        >
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "f2l-diagram":
      return (
        <div
          key={block.label ?? "f2l"}
          className="flex justify-center py-4 rounded"
          style={{
            backgroundColor: "#080810",
            border: `1px solid ${stageColor}18`,
          }}
        >
          <F2LDiagram
            label={block.label}
            stickerColors={block.stickerColors}
            size={block.size}
          />
        </div>
      );
    case "f2l-diagram-row":
      return (
        <div
          key={block.diagrams.map((d) => d.label).join("-")}
          className={`flex justify-center items-center py-4 px-6 rounded ${block.diagrams.length > 2 ? "gap-4" : "gap-14"}`}
          style={{
            backgroundColor: "#080810",
            border: `1px solid ${stageColor}18`,
          }}
        >
          {block.diagrams.map((d, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg
                  width={block.diagrams.length > 2 ? "36" : "56"}
                  height={block.diagrams.length > 2 ? "24" : "36"}
                  viewBox="0 0 10 7"
                  style={{ imageRendering: "pixelated", flexShrink: 0 }}
                >
                  {(() => {
                    const h = (hex: string) => ({
                      r: parseInt(hex.slice(1, 3), 16),
                      g: parseInt(hex.slice(3, 5), 16),
                      b: parseInt(hex.slice(5, 7), 16),
                    });
                    const from = h("#ffffff");
                    const to = h(stageColor);
                    const col = (x: number, bright: number) => {
                      const t = x / 9;
                      const r = Math.round(
                        (from.r * (1 - t) + to.r * t) * bright,
                      );
                      const g = Math.round(
                        (from.g * (1 - t) + to.g * t) * bright,
                      );
                      const b = Math.round(
                        (from.b * (1 - t) + to.b * t) * bright,
                      );
                      return `rgb(${r},${g},${b})`;
                    };
                    // [x, y, brightness]  — 1.0 = full, center row brightest, wings darkest
                    const pixels: [number, number, number][] = [
                      [6, 0, 0.45],
                      [6, 1, 0.6],
                      [7, 1, 0.6],
                      [0, 2, 0.75],
                      [1, 2, 0.75],
                      [2, 2, 0.75],
                      [3, 2, 0.75],
                      [4, 2, 0.75],
                      [5, 2, 0.75],
                      [6, 2, 0.75],
                      [7, 2, 0.75],
                      [8, 2, 0.75],
                      [0, 3, 1],
                      [1, 3, 1],
                      [2, 3, 1],
                      [3, 3, 1],
                      [4, 3, 1],
                      [5, 3, 1],
                      [6, 3, 1],
                      [7, 3, 1],
                      [8, 3, 1],
                      [9, 3, 1],
                      [0, 4, 0.75],
                      [1, 4, 0.75],
                      [2, 4, 0.75],
                      [3, 4, 0.75],
                      [4, 4, 0.75],
                      [5, 4, 0.75],
                      [6, 4, 0.75],
                      [7, 4, 0.75],
                      [8, 4, 0.75],
                      [6, 5, 0.6],
                      [7, 5, 0.6],
                      [6, 6, 0.45],
                    ];
                    return pixels.map(([x, y, bright]) => (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill={col(x, bright)}
                      />
                    ));
                  })()}
                </svg>
              )}
              <F2LDiagram
                label={d.label}
                stickerColors={d.stickerColors}
                size={d.size}
              />
            </React.Fragment>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ stage: string; lesson: string }>;
}) {
  const { stage: stageParam, lesson: lessonParam } = await params;
  const stageNum = parseInt(stageParam, 10);
  const lessonIdx = parseInt(lessonParam, 10);

  const stage = STAGES[stageNum];
  const lesson = stage?.lessons[lessonIdx - 1];
  if (!stage || !lesson) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyCompleted = false;
  if (user) {
    const { data } = await supabase
      .from("lesson_completions")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.number)
      .single();
    alreadyCompleted = !!data;
  }

  const content = LESSON_CONTENT[lesson.number];
  const isFirst = lessonIdx === 1;
  const isLast = lessonIdx === stage.lessons.length;
  const prevHref = isFirst ? null : `/learn/${stageNum}/${lessonIdx - 1}`;
  const nextHref = isLast ? null : `/learn/${stageNum}/${lessonIdx + 1}`;

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
          {alreadyCompleted && (
            <span
              className="font-heading text-[9px] leading-none px-2 py-1.5"
              style={{
                color: "#009B48",
                border: "1px solid rgba(0,155,72,0.3)",
              }}
            >
              COMPLETED
            </span>
          )}
        </div>

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

        <span
          className="self-start font-heading text-[9px] leading-none px-2 py-1.5"
          style={{ color: "#FFD500", border: "1px solid rgba(255,213,0,0.3)" }}
        >
          +{stage.xpPerLesson} XP ON COMPLETION
        </span>
      </div>

      {/* Lesson content */}
      {content ? (
        <div className="flex flex-col gap-5">
          {content.map((block, i) => (
            <div key={i}>{renderBlock(block, stage.color)}</div>
          ))}
        </div>
      ) : (
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
              COMING SOON
            </span>
            <p className="font-sans text-sm text-zinc-700 max-w-xs leading-relaxed">
              Content for this lesson is being written. Check back soon.
            </p>
          </div>
        </div>
      )}

      {/* Complete button + nav */}
      <div className="flex flex-col gap-6">
        {user ? (
          <form>
            <button
              formAction={async () => {
                "use server";
                await completeLesson(
                  lesson.number,
                  stageNum,
                  stage.xpPerLesson,
                );
              }}
              disabled={alreadyCompleted}
              className={`btn-shine w-full font-heading text-[11px] leading-none py-4 transition-all duration-75 ${alreadyCompleted ? "cursor-default" : "cursor-pointer active:translate-y-[2px]"}`}
              style={
                alreadyCompleted
                  ? {
                      backgroundColor: "rgba(0,155,72,0.1)",
                      color: "#009B48",
                      border: "1px solid rgba(0,155,72,0.3)",
                    }
                  : {
                      backgroundColor: "#FFD500",
                      color: "#0d0d14",
                      boxShadow: "0 4px 0px #a38a00",
                    }
              }
            >
              {alreadyCompleted
                ? "✓ LESSON COMPLETED"
                : `COMPLETE LESSON — +${stage.xpPerLesson} XP`}
            </button>
          </form>
        ) : (
          <Link
            href="/auth/signup"
            className="w-full font-heading text-[11px] leading-none py-4 text-center transition-all hover:brightness-110"
            style={{
              backgroundColor: "#FFD500",
              color: "#0d0d14",
              boxShadow: "0 4px 0px #a38a00",
            }}
          >
            SIGN UP TO TRACK PROGRESS
          </Link>
        )}

        <div className="flex items-center justify-between gap-4">
          {prevHref ? (
            <Link
              href={prevHref}
              className="font-heading text-[9px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest"
            >
              ← PREV LESSON
            </Link>
          ) : (
            <span />
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
