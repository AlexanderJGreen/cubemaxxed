import type { CSSProperties, ReactNode } from "react";

export type PixelIconName =
  | "arrow"       // ▸  right-pointing — First Steps, play
  | "diamond"     // ◆  solid diamond   — First Solve, bullet
  | "star"        // ★  5-point star    — Method Master
  | "bullseye"    // ◉  target circle   — Perfect Student
  | "book"        // ▤  grid/table      — Scholar, Sequence mode
  | "clock"       // ◷  clock face      — Speed achievements, Timer, Flash mode
  | "mountain"    // ▲  triangle        — Practice milestones, Gamification
  | "fourstar"    // ✦  4-point star    — Thousand Club
  | "algdiamond"  // ◈  diamond ring    — Algorithm achievements, Trainer, Recognition mode
  | "flame"       //    fire            — Streak achievements
  | "lightning";  // ⚡  bolt            — Speed Recognition

// All icons share a 16×16 viewBox.
// Each logical "pixel" is a 2×2 SVG unit rect.
// fill="currentColor" inherits colour from parent CSS.
const ICONS: Record<PixelIconName, ReactNode> = {

  // Right-pointing chevron arrow
  arrow: (
    <g>
      <rect x={0}  y={0}  width={2}  height={2} />
      <rect x={0}  y={2}  width={6}  height={2} />
      <rect x={0}  y={4}  width={12} height={2} />
      <rect x={0}  y={6}  width={16} height={2} />
      <rect x={0}  y={8}  width={12} height={2} />
      <rect x={0}  y={10} width={6}  height={2} />
      <rect x={0}  y={12} width={2}  height={2} />
    </g>
  ),

  // Solid diamond
  diamond: (
    <g>
      <rect x={6}  y={0}  width={4}  height={2} />
      <rect x={4}  y={2}  width={8}  height={2} />
      <rect x={2}  y={4}  width={12} height={2} />
      <rect x={0}  y={6}  width={16} height={2} />
      <rect x={2}  y={8}  width={12} height={2} />
      <rect x={4}  y={10} width={8}  height={2} />
      <rect x={6}  y={12} width={4}  height={2} />
    </g>
  ),

  // 5-point star: top spike + wide horizontal bar + two bottom prongs
  star: (
    <g>
      <rect x={6}  y={0}  width={4}  height={4} />
      <rect x={0}  y={4}  width={16} height={2} />
      <rect x={2}  y={6}  width={12} height={2} />
      <rect x={0}  y={8}  width={4}  height={4} />
      <rect x={12} y={8}  width={4}  height={4} />
    </g>
  ),

  // Bullseye: circle outline with filled center dot
  bullseye: (
    <g>
      <rect x={4}  y={0}  width={8}  height={2} />
      <rect x={2}  y={2}  width={2}  height={2} />
      <rect x={12} y={2}  width={2}  height={2} />
      <rect x={0}  y={4}  width={2}  height={6} />
      <rect x={14} y={4}  width={2}  height={6} />
      <rect x={6}  y={4}  width={4}  height={6} />
      <rect x={2}  y={10} width={2}  height={2} />
      <rect x={12} y={10} width={2}  height={2} />
      <rect x={4}  y={12} width={8}  height={2} />
    </g>
  ),

  // 2×2 grid with border lines
  book: (
    <g>
      <rect x={0}  y={0}  width={16} height={2} />
      <rect x={0}  y={2}  width={2}  height={10} />
      <rect x={14} y={2}  width={2}  height={10} />
      <rect x={6}  y={2}  width={2}  height={4} />
      <rect x={6}  y={8}  width={2}  height={4} />
      <rect x={2}  y={6}  width={12} height={2} />
      <rect x={0}  y={12} width={16} height={2} />
    </g>
  ),

  // Clock face with hand pointing to 3 o'clock
  clock: (
    <g>
      <rect x={4}  y={0}  width={8}  height={2} />
      <rect x={2}  y={2}  width={2}  height={2} />
      <rect x={12} y={2}  width={2}  height={2} />
      <rect x={0}  y={4}  width={2}  height={6} />
      <rect x={14} y={4}  width={2}  height={6} />
      <rect x={8}  y={4}  width={2}  height={4} />
      <rect x={8}  y={8}  width={4}  height={2} />
      <rect x={2}  y={10} width={2}  height={2} />
      <rect x={12} y={10} width={2}  height={2} />
      <rect x={4}  y={12} width={8}  height={2} />
    </g>
  ),

  // Upward triangle / mountain
  mountain: (
    <g>
      <rect x={6}  y={2}  width={4}  height={2} />
      <rect x={4}  y={4}  width={8}  height={2} />
      <rect x={2}  y={6}  width={12} height={2} />
      <rect x={0}  y={8}  width={16} height={4} />
    </g>
  ),

  // 4-pointed star: cross with tapered arms
  fourstar: (
    <g>
      <rect x={6}  y={0}  width={4}  height={2} />
      <rect x={4}  y={2}  width={8}  height={2} />
      <rect x={0}  y={4}  width={16} height={4} />
      <rect x={4}  y={8}  width={8}  height={2} />
      <rect x={6}  y={10} width={4}  height={2} />
    </g>
  ),

  // Diamond outline with filled inner diamond
  algdiamond: (
    <g>
      {/* Outer diamond outline */}
      <rect x={6}  y={0}  width={4}  height={2} />
      <rect x={4}  y={2}  width={2}  height={2} />
      <rect x={10} y={2}  width={2}  height={2} />
      <rect x={2}  y={4}  width={2}  height={2} />
      <rect x={12} y={4}  width={2}  height={2} />
      <rect x={0}  y={6}  width={2}  height={2} />
      <rect x={14} y={6}  width={2}  height={2} />
      <rect x={2}  y={8}  width={2}  height={2} />
      <rect x={12} y={8}  width={2}  height={2} />
      <rect x={4}  y={10} width={2}  height={2} />
      <rect x={10} y={10} width={2}  height={2} />
      <rect x={6}  y={12} width={4}  height={2} />
      {/* Inner filled diamond */}
      <rect x={6}  y={4}  width={4}  height={2} />
      <rect x={4}  y={6}  width={8}  height={2} />
      <rect x={6}  y={8}  width={4}  height={2} />
    </g>
  ),

  // Flame: tapered tip, wide body, narrow base
  flame: (
    <g>
      <rect x={8}  y={0}  width={4}  height={2} />
      <rect x={6}  y={2}  width={6}  height={2} />
      <rect x={4}  y={4}  width={8}  height={2} />
      <rect x={2}  y={6}  width={10} height={2} />
      <rect x={2}  y={8}  width={12} height={2} />
      <rect x={0}  y={10} width={14} height={2} />
      <rect x={2}  y={12} width={10} height={2} />
    </g>
  ),

  // Lightning bolt: top-right block, diagonal crossbar, bottom-right tip
  lightning: (
    <g>
      <rect x={6}  y={0}  width={10} height={2} />
      <rect x={4}  y={2}  width={8}  height={2} />
      <rect x={2}  y={4}  width={6}  height={2} />
      <rect x={0}  y={6}  width={16} height={2} />
      <rect x={8}  y={8}  width={6}  height={2} />
      <rect x={6}  y={10} width={6}  height={2} />
      <rect x={4}  y={12} width={6}  height={2} />
    </g>
  ),
};

export function PixelIcon({
  name,
  size = 16,
  style,
  className,
}: {
  name: PixelIconName;
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{
        imageRendering: "pixelated",
        shapeRendering: "crispEdges",
        display: "block",
        flexShrink: 0,
        ...style,
      }}
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
