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
  progress: number;
}

const STAGES: Stage[] = [
  {
    number: 1,
    title: "The Basics",
    goal: "Understand the cube, read notation, and do your first moves.",
    lessons: 5,
    xpPerLesson: 50,
    color: "#009B48",
    status: "completed",
    progress: 5,
  },
  {
    number: 2,
    title: "Your First Solve",
    goal: "Solve the entire cube using the beginner layer-by-layer method.",
    lessons: 9,
    xpPerLesson: 75,
    color: "#c9a825",
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

// Pixel art lock icon (5 cols × 7 rows)
function LockPixels() {
  const rows = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ];
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(5, 3px)",
        gap: "1px",
      }}
    >
      {rows.flat().map((on, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 3,
            backgroundColor: on ? "rgba(255,255,255,0.14)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

// Individual lesson pip squares
function LessonPips({
  total,
  done,
  color,
}: {
  total: number;
  done: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 3,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            backgroundColor: i < done ? color : "transparent",
            border: `1px solid ${i < done ? color : "rgba(255,255,255,0.1)"}`,
            boxShadow: i < done ? `0 0 5px ${color}80` : "none",
          }}
        />
      ))}
    </div>
  );
}

// Vertical dot connector between stage cards
function StageConnector({ color, lit }: { color: string; lit: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: 22,
        paddingTop: 6,
        paddingBottom: 6,
        gap: 5,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 3,
            backgroundColor: lit ? color : "rgba(255,255,255,0.07)",
            opacity: lit ? 1 - i * 0.14 : 1,
            boxShadow: lit ? `0 0 5px ${color}70` : "none",
          }}
        />
      ))}
    </div>
  );
}

export default function Learn() {
  const totalLessons = STAGES.reduce((s, st) => s + st.lessons, 0);
  const completedLessons = STAGES.reduce((s, st) => s + st.progress, 0);
  const overallPct = Math.round((completedLessons / totalLessons) * 100);

  return (
    <>
      <style>{`
        @keyframes activeCardGlow {
          0%, 100% {
            box-shadow:
              0 0 0 1px var(--ac),
              0 0 10px var(--ag),
              inset 0 0 12px var(--ai);
          }
          50% {
            box-shadow:
              0 0 0 1px var(--ac),
              0 0 22px var(--ag),
              inset 0 0 22px var(--ai);
          }
        }
        @keyframes blinkCursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .stage-active-card {
          animation: activeCardGlow 3s ease-in-out infinite;
        }
        .blink-cursor {
          animation: blinkCursor 1s step-end infinite;
        }
        .learn-card:not(.locked-card):hover {
          filter: brightness(1.06);
        }
      `}</style>

      <div
        style={{ maxWidth: 800, margin: "0 auto", padding: "52px 24px 96px" }}
      >
        {/* ── Page header ── */}
        <div style={{ marginBottom: 52 }}>
          <div
            style={{
              fontFamily: "var(--font-heading), monospace",
              fontSize: 8,
              color: "#2e2e42",
              letterSpacing: "0.35em",
              marginBottom: 14,
            }}
          >
            CURRICULUM MAP
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading), monospace",
              fontSize: "clamp(13px, 2.2vw, 20px)",
              color: "#ededed",
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            CHOOSE YOUR STAGE
          </h1>

          <p
            style={{
              fontFamily: "var(--font-sans), Arial, sans-serif",
              fontSize: 13,
              color: "#4a4a5e",
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: 32,
            }}
          >
            43 lessons across 7 stages. Complete each stage to unlock the next.
          </p>

          {/* Overall progress meter */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading), monospace",
                  fontSize: 7,
                  color: "#2e2e42",
                  letterSpacing: "0.2em",
                }}
              >
                OVERALL PROGRESS
              </span>
              <span
                style={{
                  fontFamily: "var(--font-heading), monospace",
                  fontSize: 7,
                  color: "#3a3a52",
                }}
              >
                {completedLessons} / {totalLessons} · {overallPct}%
              </span>
            </div>
            <div
              style={{
                height: 4,
                backgroundColor: "#0c0c16",
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: `${overallPct}%`,
                  background:
                    "linear-gradient(90deg, #009B48 0%, #FFD500 100%)",
                  boxShadow: "0 0 10px rgba(0,155,72,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Stage list ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {STAGES.map((stage, i) => {
            const isLast = i === STAGES.length - 1;
            const totalXP = stage.lessons * stage.xpPerLesson;
            const locked = stage.status === "locked";
            const active = stage.status === "active";
            const completed = stage.status === "completed";

            const activeVars = active
              ? ({
                  ["--ac" as string]: `${stage.color}90`,
                  ["--ag" as string]: `${stage.color}22`,
                  ["--ai" as string]: `${stage.color}06`,
                } as React.CSSProperties)
              : {};

            return (
              <div key={stage.number}>
                {/* Stage card */}
                <Link
                  href={locked ? "#" : `/learn/${stage.number}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    pointerEvents: locked ? "none" : "auto",
                  }}
                >
                  <div
                    className={`learn-card ${active ? "stage-active-card" : ""} ${locked ? "locked-card" : ""}`}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: active
                        ? `${stage.color}08`
                        : completed
                          ? `${stage.color}04`
                          : "#080810",
                      border: `1px solid ${
                        locked
                          ? "rgba(255,255,255,0.04)"
                          : completed
                            ? `${stage.color}22`
                            : `${stage.color}55`
                      }`,
                      borderLeft: `6px solid ${
                        locked ? "rgba(255,255,255,0.07)" : stage.color
                      }`,
                      opacity: locked ? 0.44 : 1,
                      padding: "22px 26px 22px 20px",
                      transition: "filter 0.2s",
                      ...activeVars,
                    }}
                  >
                    {/* Locked diagonal stripe overlay */}
                    {locked && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(255,255,255,0.013) 9px, rgba(255,255,255,0.013) 10px)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    {/* Card content */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Row 1: Stage label + status */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                          gap: 12,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-heading), monospace",
                            fontSize: 9,
                            color: locked ? "#1e1e2a" : stage.color,
                            letterSpacing: "0.2em",
                          }}
                        >
                          STAGE {String(stage.number).padStart(2, "0")}
                        </span>

                        {completed && (
                          <div
                            style={{
                              fontFamily: "var(--font-heading), monospace",
                              fontSize: 8,
                              color: "#009B48",
                              border: "1px solid rgba(0,155,72,0.35)",
                              backgroundColor: "rgba(0,155,72,0.08)",
                              padding: "3px 8px",
                              letterSpacing: "0.1em",
                              whiteSpace: "nowrap",
                              fontWeight: 700,
                            }}
                          >
                            COMPLETED
                          </div>
                        )}
                        {active && (
                          <div
                            style={{
                              fontFamily: "var(--font-heading), monospace",
                              fontSize: 8,
                              color: stage.color,
                              border: `1px solid ${stage.color}55`,
                              backgroundColor: `${stage.color}12`,
                              padding: "3px 8px",
                              letterSpacing: "0.1em",
                              whiteSpace: "nowrap",
                              fontWeight: 700,
                            }}
                          >
                            IN PROGRESS
                          </div>
                        )}
                        {locked && <LockPixels />}
                      </div>

                      {/* Row 2: Stage title */}
                      <h2
                        style={{
                          fontFamily: "var(--font-heading), monospace",
                          fontSize: 13,
                          color: locked
                            ? "#1a1a26"
                            : active
                              ? "#f2f2f2"
                              : "#909099",
                          margin: "0 0 10px 0",
                          lineHeight: 1.55,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {stage.title}
                        {active && (
                          <span
                            className="blink-cursor"
                            style={{ color: stage.color }}
                          >
                            _
                          </span>
                        )}
                      </h2>

                      {/* Row 3: Goal */}
                      <p
                        style={{
                          fontFamily: "var(--font-sans), Arial, sans-serif",
                          fontSize: 14,
                          color: locked ? "#161620" : "#424258",
                          lineHeight: 1.75,
                          margin: "0 0 16px 0",
                          maxWidth: "82%",
                        }}
                      >
                        {stage.goal}
                      </p>

                      {/* Active: progress bar */}
                      {active && (
                        <div style={{ marginBottom: 16 }}>
                          <div
                            style={{
                              height: 3,
                              backgroundColor: "#0d0d1a",
                              border: "1px solid rgba(255,255,255,0.05)",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                inset: "0 auto 0 0",
                                width: `${Math.round(
                                  (stage.progress / stage.lessons) * 100,
                                )}%`,
                                backgroundColor: stage.color,
                                boxShadow: `0 0 8px ${stage.color}`,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-heading), monospace",
                              fontSize: 8,
                              color: "#252535",
                              marginTop: 7,
                              letterSpacing: "0.1em",
                            }}
                          >
                            {stage.progress} / {stage.lessons} LESSONS COMPLETE
                          </div>
                        </div>
                      )}

                      {/* Row 4: Lesson pips + XP */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 16,
                        }}
                      >
                        <LessonPips
                          total={stage.lessons}
                          done={stage.progress}
                          color={stage.color}
                        />
                        <div
                          style={{
                            fontFamily: "var(--font-heading), monospace",
                            fontSize: 8,
                            color: locked ? "#161620" : "#2e2e42",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              color: locked ? "#161620" : `${stage.color}bb`,
                            }}
                          >
                            +{totalXP.toLocaleString()}
                          </span>{" "}
                          XP
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Dot connector */}
                {!isLast && (
                  <StageConnector
                    color={stage.color}
                    lit={stage.status === "completed"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer stats ── */}
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid rgba(255,255,255,0.05)",
            backgroundColor: "#07070f",
          }}
        >
          {[
            { label: "TOTAL LESSONS", value: "43" },
            { label: "TOTAL XP AVAILABLE", value: "4,700" },
            {
              label: "YOUR PROGRESS",
              value: `${completedLessons} / ${totalLessons}`,
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "18px 22px",
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading), monospace",
                  fontSize: 7,
                  color: "#1e1e2e",
                  marginBottom: 10,
                  letterSpacing: "0.18em",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading), monospace",
                  fontSize: 14,
                  color: "#3a3a52",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
