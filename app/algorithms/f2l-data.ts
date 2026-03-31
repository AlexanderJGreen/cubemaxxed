export interface F2LCase {
  id: string;
  name: string;
  group: string;
  alg: string;
  stickerColors: { [face: string]: (string | null)[] };
}

// ── F2L Cases ─────────────────────────────────────────────────────────────────
// stickerColors: 9 stickers per face, index layout:
//   0 1 2
//   3 4 5
//   6 7 8
// Use a hex color string for a visible sticker, null for grey (unimportant).
// Face keys: U, D, F, B, L, R

export const F2L_CASES: F2LCase[] = [
  // ── Basic ────────────────────────────────────────────────────────────────────
  // Pair is already formed in the top layer, just needs inserting.
  {
    id: "f2l-b1",
    name: "Basic 1",
    group: "Basic",
    alg: "U R U' R'",
    stickerColors: {
      // Corner at UFR: white on top, green facing front, red facing right
      // Edge at UR: red on U side (index 5), green on R side (index 1)
      U: [
        null,
        null,
        null,
        null,
        null,
        "#C41E3A", // [5] UR edge, faces right center
        null,
        null,
        "#ffffff", // [8] UFR corner, top sticker
      ],
      F: [
        null,
        null,
        "#009B48", // [2] UFR corner, front sticker
        null,
        null,
        null,
        null,
        null,
        null,
      ],
      R: [
        "#C41E3A",
        "#009B48",
        null, // [0] UFR corner, [1] UR edge
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    },
  },
  {
    id: "f2l-b2",
    name: "Basic 2",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b3",
    name: "Basic 3",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b4",
    name: "Basic 4",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b5",
    name: "Basic 5",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b6",
    name: "Basic 6",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b7",
    name: "Basic 7",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
  {
    id: "f2l-b8",
    name: "Basic 8",
    group: "Basic",
    alg: "// TODO",
    stickerColors: {},
  },
];
