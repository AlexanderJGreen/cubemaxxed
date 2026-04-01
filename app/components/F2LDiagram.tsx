"use client";

import { useEffect, useRef } from "react";
import { SVG, Type } from "sr-puzzlegen";

// Sticker index layout for each face (viewed from outside):
//   0 1 2
//   3 4 5   (4 = center)
//   6 7 8
//
// U face (viewed from top, front face at bottom):
//   UBL(0) UB(1)  UBR(2)
//   UL(3)  U(4)   UR(5)
//   UFL(6) UF(7)  UFR(8)
//
// F face (viewed from front):
//   UFL(0) UF(1)  UFR(2)
//   FL(3)  F(4)   FR(5)
//   DFL(6) DF(7)  DFR(8)
//
// R face (viewed from right, front face at left):
//   UFR(0) UR(1)  UBR(2)
//   FR(3)  R(4)   BR(5)
//   DFR(6) DR(7)  DBR(8)

const GREY = { value: "#2a2a2a" };

// Convert (string | null)[] → { value: string }[], filling nulls with grey
function toIColors(colors: (string | null)[]): { value: string }[] {
  return colors.map((c) => (c ? { value: c } : GREY));
}

interface F2LDiagramProps {
  label?: string;
  /**
   * Per-face sticker colors. Each face takes 9 entries (see index layout above).
   * Use a hex string for a colored sticker, null for grey (unimportant).
   * Only faces with non-null stickers need to be specified — all others default to grey.
   * Face keys: U, D, F, B, L, R
   */
  stickerColors: { [face: string]: (string | null)[] };
  size?: number;
}

export default function F2LDiagram({
  label,
  stickerColors,
  size = 200,
}: F2LDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    const allFaces = ["U", "D", "F", "B", "L", "R"];
    const converted: { [face: string]: { value: string }[] } = {};

    for (const face of allFaces) {
      const provided = stickerColors[face];
      converted[face] = provided
        ? toIColors(provided)
        : Array(9).fill(GREY);
    }

    SVG(container, Type.CUBE, {
      width: size,
      height: size,
      puzzle: {
        stickerColors: converted,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, JSON.stringify(stickerColors)]);

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="font-heading text-[8px] text-zinc-500 tracking-wide whitespace-nowrap">
          {label.toUpperCase()}
        </span>
      )}
      <div ref={containerRef} style={{ width: size, height: size }} />
    </div>
  );
}
