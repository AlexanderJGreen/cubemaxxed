type Pixel = "P" | "L" | "_";

const RANK_PATTERNS: Record<
  string,
  { highlight: string; cellSize: number; pattern: Pixel[][] }
> = {
  // Hollow outline square — empty vessel, nothing earned yet
  UNRANKED: {
    highlight: "#7a7a8f",
    cellSize: 3,
    pattern: [
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "P", "_", "_", "_", "P", "_", "_"],
      ["_", "_", "P", "_", "_", "_", "P", "_", "_"],
      ["_", "_", "P", "_", "_", "_", "P", "_", "_"],
      ["_", "_", "P", "_", "_", "_", "P", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Upward triangle — first step forward
  BRONZE: {
    highlight: "#e8a96a",
    cellSize: 3,
    pattern: [
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "P", "_", "_", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "P", "P", "P", "P", "P", "P", "P", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Rhombus — clean geometric form
  SILVER: {
    highlight: "#e8e8ff",
    cellSize: 4,
    pattern: [
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "P", "_", "_", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "P", "P", "P", "L", "P", "P", "P", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "_", "_", "P", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Circle/coin — solid round medal
  GOLD: {
    highlight: "#fffaaa",
    cellSize: 4,
    pattern: [
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "P", "P", "P", "L", "P", "P", "P", "_"],
      ["P", "P", "P", "L", "L", "L", "P", "P", "P"],
      ["P", "P", "L", "L", "L", "L", "L", "P", "P"],
      ["P", "P", "P", "L", "L", "L", "P", "P", "P"],
      ["_", "P", "P", "P", "L", "P", "P", "P", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
    ],
  },
  // Flat hexagon — cold, geometric, metallic
  PLATINUM: {
    highlight: "#b8f8ff",
    cellSize: 5,
    pattern: [
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "P", "P", "P", "P", "P", "P", "P", "_"],
      ["P", "P", "P", "P", "L", "P", "P", "P", "P"],
      ["P", "P", "P", "L", "L", "L", "P", "P", "P"],
      ["P", "P", "P", "L", "L", "L", "P", "P", "P"],
      ["P", "P", "P", "P", "L", "P", "P", "P", "P"],
      ["_", "P", "P", "P", "P", "P", "P", "P", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Classic cut gem — flat top, pointed bottom
  DIAMOND: {
    highlight: "#d0f4ff",
    cellSize: 5,
    pattern: [
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "P", "P", "L", "L", "L", "P", "P", "_"],
      ["P", "P", "L", "L", "L", "L", "L", "P", "P"],
      ["_", "P", "P", "P", "P", "P", "P", "P", "_"],
      ["_", "_", "P", "P", "P", "P", "P", "_", "_"],
      ["_", "_", "_", "P", "P", "P", "_", "_", "_"],
      ["_", "_", "_", "_", "P", "_", "_", "_", "_"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Crown — five peaks, broad base
  MASTER: {
    highlight: "#efbfff",
    cellSize: 5,
    pattern: [
      ["P", "_", "P", "_", "P", "_", "P", "_", "P"],
      ["P", "_", "P", "_", "P", "_", "P", "_", "P"],
      ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
      ["P", "P", "L", "L", "L", "L", "L", "P", "P"],
      ["P", "P", "L", "L", "L", "L", "L", "P", "P"],
      ["P", "P", "_", "_", "_", "_", "_", "P", "P"],
      ["P", "P", "_", "_", "_", "_", "_", "P", "P"],
      ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
  // Sun crown — radiating top + crown base
  GRANDMASTER: {
    highlight: "#ffd700",
    cellSize: 7,
    pattern: [
      ["P", "_", "_", "P", "P", "P", "_", "_", "P"],
      ["_", "P", "_", "P", "L", "P", "_", "P", "_"],
      ["_", "_", "P", "P", "L", "P", "P", "_", "_"],
      ["P", "P", "P", "L", "L", "L", "P", "P", "P"],
      ["P", "P", "L", "L", "L", "L", "L", "P", "P"],
      ["P", "P", "P", "_", "_", "_", "P", "P", "P"],
      ["P", "P", "_", "_", "_", "_", "_", "P", "P"],
      ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
      ["_", "_", "_", "_", "_", "_", "_", "_", "_"],
    ],
  },
};

export function RankBadge({
  name,
  color,
  glow,
}: {
  name: string;
  color: string;
  glow?: string;
}) {
  const data = RANK_PATTERNS[name];
  if (!data) return null;
  const { cellSize, pattern, highlight } = data;
  const cols = pattern[0].length;
  const glowFilter = glow ? `drop-shadow(0 0 3px ${glow})` : undefined;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gap: "1px",
        imageRendering: "pixelated",
        filter: glowFilter,
      }}
    >
      {pattern.flat().map((px, i) => (
        <div
          key={i}
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor:
              px === "P" ? color : px === "L" ? highlight : "transparent",
          }}
        />
      ))}
    </div>
  );
}
