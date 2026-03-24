const FACES = ["U", "D", "R", "L", "F", "B"] as const;
const MODIFIERS = ["", "'", "2"] as const;

// Opposite face pairs — avoid same-axis moves back-to-back
const OPPOSITE: Record<string, string> = {
  U: "D", D: "U",
  R: "L", L: "R",
  F: "B", B: "F",
};

export function generateScramble(length = 20): string {
  const moves: string[] = [];
  let lastFace = "";
  let secondLastFace = "";

  for (let i = 0; i < length; i++) {
    const available = FACES.filter((f) => {
      if (f === lastFace) return false;
      // Avoid R L R / L R L style sequences (same axis, 3 in a row)
      if (OPPOSITE[f] === lastFace && OPPOSITE[f] === secondLastFace) return false;
      if (f === secondLastFace && OPPOSITE[f] === lastFace) return false;
      return true;
    });

    const face = available[Math.floor(Math.random() * available.length)];
    const mod = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    moves.push(face + mod);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves.join(" ");
}
