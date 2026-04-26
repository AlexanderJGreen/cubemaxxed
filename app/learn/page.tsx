import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STAGES } from "./data";

type Status = "completed" | "active" | "locked" | "coming_soon";

function LockPixels() {
  const rows = [
    [0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],
    [1,1,1,1,1],[1,1,0,1,1],[1,1,1,1,1],[1,1,1,1,1],
  ];
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(5, 3px)", gap: "1px" }}>
      {rows.flat().map((on, i) => (
        <div key={i} style={{ width: 3, height: 3, backgroundColor: on ? "rgba(255,255,255,0.14)" : "transparent" }} />
      ))}
    </div>
  );
}

function LessonPips({ total, done, color }: { total: number; done: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 7, height: 7,
            backgroundColor: i < done ? color : "transparent",
            border: `1px solid ${i < done ? color : "rgba(255,255,255,0.1)"}`,
            boxShadow: i < done ? `0 0 5px ${color}80` : "none",
          }}
        />
      ))}
    </div>
  );
}

function StageConnector({ color, lit }: { color: string; lit: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingLeft: 22, paddingTop: 6, paddingBottom: 6, gap: 5 }}>
      {[0,1,2,3,4].map((i) => (
        <div key={i} style={{ width: 3, height: 3, backgroundColor: lit ? color : "rgba(255,255,255,0.07)", opacity: lit ? 1 - i * 0.14 : 1, boxShadow: lit ? `0 0 5px ${color}70` : "none" }} />
      ))}
    </div>
  );
}

export default async function Learn() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch completed lessons for this user
  const completedLessonIds = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("lesson_completions")
      .select("lesson_id")
      .eq("user_id", user.id);
    (data ?? []).forEach((row) => completedLessonIds.add(row.lesson_id));
  }

  // Calculate progress and status per stage
  const stageList = Object.values(STAGES).map((stage, i) => {
    const totalLessons = stage.lessons.length;
    const doneLessons = stage.lessons.filter((l) => completedLessonIds.has(l.number)).length;
    const prevStage = i > 0 ? Object.values(STAGES)[i - 1] : null;
    const prevComplete = prevStage
      ? prevStage.lessons.every((l) => completedLessonIds.has(l.number))
      : true; // Stage 1 always unlocked

    const isCfop = stage.number >= 5;

    let status: Status;
    if (isCfop) status = "coming_soon";
    else if (doneLessons === totalLessons && totalLessons > 0) status = "completed";
    else if (prevComplete) status = "active";
    else status = "locked";

    return { ...stage, totalLessons, doneLessons, status };
  });

  const totalLessons = stageList.reduce((s, st) => s + st.totalLessons, 0);
  const completedLessons = stageList.reduce((s, st) => s + st.doneLessons, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      <style>{`
        @keyframes activeCardGlow {
          0%, 100% { box-shadow: 0 0 0 1px var(--ac), 0 0 10px var(--ag), inset 0 0 12px var(--ai); }
          50%       { box-shadow: 0 0 0 1px var(--ac), 0 0 22px var(--ag), inset 0 0 22px var(--ai); }
        }
        @keyframes blinkCursor { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes pixelFlash { 0%, 80%, 100% { filter: brightness(1); } 88% { filter: brightness(2.8); } }
        .stage-active-card { animation: activeCardGlow 3s ease-in-out infinite; }
        .blink-cursor { animation: blinkCursor 1s step-end infinite; }
        .learn-card:not(.locked-card):hover { filter: brightness(1.06); }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 96px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: "#555570", letterSpacing: "0.35em", marginBottom: 14 }}>
            CURRICULUM MAP
          </div>
          <h1 style={{ fontFamily: "var(--font-heading), monospace", fontSize: "clamp(13px, 2.2vw, 20px)", color: "#ededed", marginBottom: 16, lineHeight: 1.4 }}>
            CHOOSE YOUR STAGE
          </h1>
          <p style={{ fontFamily: "var(--font-sans), Arial, sans-serif", fontSize: 13, color: "#7a7a96", lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            43 lessons across 7 stages. Complete each stage to unlock the next.
          </p>

          {/* Overall progress meter */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-heading), monospace", fontSize: 7, color: "#555570", letterSpacing: "0.2em" }}>OVERALL PROGRESS</span>
              <span style={{ fontFamily: "var(--font-heading), monospace", fontSize: 7, color: "#888899" }}>{completedLessons} / {totalLessons} · {overallPct}%</span>
            </div>
            <div style={{ height: 4, backgroundColor: "#0c0c16", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${overallPct}%`, background: "linear-gradient(90deg, #009B48 0%, #FFD500 100%)", boxShadow: "0 0 10px rgba(0,155,72,0.5)" }} />
            </div>
          </div>
        </div>

        {/* Stage list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {stageList.map((stage, i) => {
            const isLast = i === stageList.length - 1;
            const totalXP = stage.totalLessons * stage.xpPerLesson;
            const locked = stage.status === "locked";
            const active = stage.status === "active";
            const completed = stage.status === "completed";
            const comingSoon = stage.status === "coming_soon";
            const dimmed = locked || comingSoon;

            // Status-driven card color: green = done, yellow = in progress
            const cardColor = completed ? "#009B48" : active ? "#FFD500" : stage.color;

            const activeVars = active ? ({
              ["--ac" as string]: `${cardColor}90`,
              ["--ag" as string]: `${cardColor}22`,
              ["--ai" as string]: `${cardColor}06`,
            } as React.CSSProperties) : {};

            // Find next incomplete lesson for "continue" link
            const nextLesson = stage.lessons.findIndex((l) => !completedLessonIds.has(l.number));
            const lessonHref = nextLesson === -1
              ? `/learn/${stage.number}/1`
              : `/learn/${stage.number}/${nextLesson + 1}`;

            return (
              <div key={stage.number}>
                <Link
                  href={dimmed ? "#" : lessonHref}
                  style={{ display: "block", textDecoration: "none", pointerEvents: dimmed ? "none" : "auto" }}
                >
                  <div
                    className={`learn-card ${active ? "stage-active-card" : ""} ${dimmed ? "locked-card" : ""}`}
                    style={{
                      position: "relative", overflow: "hidden",
                      backgroundColor: active ? `${cardColor}08` : completed ? `${cardColor}04` : "#080810",
                      border: `1px solid ${dimmed ? "rgba(255,255,255,0.04)" : completed ? `${cardColor}22` : `${cardColor}55`}`,
                      borderLeft: `6px solid ${dimmed ? "rgba(255,255,255,0.07)" : cardColor}`,
                      opacity: comingSoon ? 0.65 : locked ? 0.44 : 1,
                      padding: "22px 26px 22px 20px",
                      transition: "filter 0.2s",
                      ...activeVars,
                    }}
                  >
                    {dimmed && (
                      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(255,255,255,0.013) 9px, rgba(255,255,255,0.013) 10px)", pointerEvents: "none" }} />
                    )}
                    {comingSoon && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <LockPixels />
                      </div>
                    )}

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Row 1: Stage label + status */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-heading), monospace", fontSize: 9, color: dimmed ? "#1e1e2a" : cardColor, letterSpacing: "0.2em" }}>
                          STAGE {String(stage.number).padStart(2, "0")}
                        </span>
                        {completed && (
                          <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: "#009B48", border: "1px solid rgba(0,155,72,0.35)", backgroundColor: "rgba(0,155,72,0.08)", padding: "3px 8px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                            COMPLETED
                          </div>
                        )}
                        {active && (
                          <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: cardColor, border: `1px solid ${cardColor}55`, backgroundColor: `${cardColor}12`, padding: "3px 8px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                            IN PROGRESS
                          </div>
                        )}
                        {locked && <LockPixels />}
                        {comingSoon && (
                          <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: "#aaaabc", border: "1px solid rgba(255,255,255,0.25)", padding: "3px 8px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                            COMING SOON
                          </div>
                        )}
                      </div>

                      {/* Row 2: Title */}
                      <h2 style={{ fontFamily: "var(--font-heading), monospace", fontSize: 13, color: dimmed ? "#1a1a26" : active ? "#f2f2f2" : "#909099", margin: "0 0 10px 0", lineHeight: 1.55, display: "flex", alignItems: "center", gap: 8 }}>
                        {stage.title}
                        {active && <span className="blink-cursor" style={{ color: cardColor }}>_</span>}
                      </h2>

                      {/* Row 3: Goal */}
                      <p style={{ fontFamily: "var(--font-sans), Arial, sans-serif", fontSize: 14, color: dimmed ? "#161620" : "#424258", lineHeight: 1.75, margin: "0 0 16px 0", maxWidth: "82%" }}>
                        {stage.goal}
                      </p>

                      {/* Progress bar for active stage */}
                      {active && stage.doneLessons > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ height: 3, backgroundColor: "#0d0d1a", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${Math.round((stage.doneLessons / stage.totalLessons) * 100)}%`, backgroundColor: cardColor, boxShadow: `0 0 8px ${cardColor}` }} />
                          </div>
                          <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: "#555570", marginTop: 7, letterSpacing: "0.1em" }}>
                            {stage.doneLessons} / {stage.totalLessons} LESSONS COMPLETE
                          </div>
                        </div>
                      )}

                      {/* Row 4: Pips + XP */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <LessonPips total={stage.totalLessons} done={stage.doneLessons} color={cardColor} />
                        <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 8, color: dimmed ? "#161620" : "#555570", flexShrink: 0 }}>
                          <span style={{ color: dimmed ? "#161620" : `${cardColor}cc` }}>+{totalXP.toLocaleString()}</span> XP
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                {!isLast && <StageConnector color={cardColor} lit={completed} />}
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#07070f" }}>
          {[
            { label: "TOTAL LESSONS",      value: "43" },
            { label: "TOTAL XP AVAILABLE", value: "4,700" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "18px 22px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 7, color: "#555570", marginBottom: 10, letterSpacing: "0.18em" }}>{stat.label}</div>
              <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 14, color: "#c0c0d4" }}>{stat.value}</div>
            </div>
          ))}
          <div style={{ padding: "18px 22px" }}>
            <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 7, color: "#555570", marginBottom: 10, letterSpacing: "0.18em" }}>YOUR PROGRESS</div>
            {user ? (
              <div style={{ fontFamily: "var(--font-heading), monospace", fontSize: 14, color: "#c0c0d4" }}>{completedLessons} / {totalLessons}</div>
            ) : (
              <Link
                href="/auth/login"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-heading), monospace",
                  fontSize: 8,
                  color: "#FFD500",
                  border: "1px solid rgba(255,213,0,0.35)",
                  backgroundColor: "rgba(255,213,0,0.07)",
                  padding: "5px 10px",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  transition: "background-color 0.15s",
                }}
              >
                SIGN IN TO TRACK
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
