// Cube-themed pixel art rank badges, drawn as inline SVG.
// Visual story: ghost outline → solid cube → gleam → shine → crystal → gem → crowned → divine radiance

const SVG_PROPS = {
  width: "100%",
  height: "100%",
  viewBox: "0 0 32 32",
  overflow: "visible" as const,
  style: {
    imageRendering: "pixelated" as const,
    shapeRendering: "crispEdges" as const,
    display: "block",
    overflow: "visible" as const,
  },
  xmlns: "http://www.w3.org/2000/svg",
};

// Shared isometric cube face vertices (all 8 ranks use the same base geometry)
// Top face:   (16,5)  → (27,11) → (16,17) → (5,11)
// Left face:  (5,11)  → (16,17) → (16,27) → (5,21)
// Right face: (27,11) → (16,17) → (16,27) → (27,21)

export function RankBadge({
  name,
  color,
  glow,
}: {
  name: string;
  color: string;
  glow?: string;
}) {
  switch (name) {
    // ─────────────────────────────────────────────
    // UNRANKED — hollow dashed circle, nothing earned yet
    // ─────────────────────────────────────────────
    case "UNRANKED":
      return (
        <svg {...SVG_PROPS}>
          <circle
            cx="16" cy="16" r="11"
            fill="none"
            stroke="#44445a"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        </svg>
      );

    // ─────────────────────────────────────────────
    // BRONZE — simple flat 2D pixel square, one color
    // ─────────────────────────────────────────────
    case "BRONZE":
      return (
        <svg {...SVG_PROPS}>
          <rect x="6" y="6" width="20" height="20" fill="#cd7f32" />
        </svg>
      );

    // ─────────────────────────────────────────────
    // SILVER — solid circle, silver tones
    // ─────────────────────────────────────────────
    case "SILVER":
      return (
        <svg {...SVG_PROPS}>
          <circle cx="16" cy="16" r="11" fill="#a8a8c0" />
          {/* Highlight */}
          <circle cx="16" cy="16" r="11" fill="none" stroke="#d8d8f0" strokeWidth="1.5" />
          <ellipse cx="13" cy="12" rx="4" ry="3" fill="#ffffff" opacity="0.2" />
        </svg>
      );

    // ─────────────────────────────────────────────
    // GOLD — 4-pointed star
    // outer radius 13, inner radius 6, center (16,16)
    // ─────────────────────────────────────────────
    case "GOLD":
      return (
        <svg {...SVG_PROPS}>
          <polygon
            points="16,3 21,11 29,16 21,21 16,29 11,21 3,16 11,11"
            fill="#ffd84d"
          />
          {/* Inner highlight star */}
          <polygon
            points="16,8 19,13 24,16 19,19 16,24 13,19 8,16 13,13"
            fill="#ffe880"
            opacity="0.5"
          />
          {/* Centre glint */}
          <rect x="15" y="15" width="2" height="2" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    // ─────────────────────────────────────────────
    // PLATINUM — pointy-top hexagon, icy tones, subtle glow
    // vertices: radius 11, center (16,16)
    // ─────────────────────────────────────────────
    case "PLATINUM":
      return (
        <svg {...SVG_PROPS}>
          <defs>
            <filter id="platinum-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#platinum-glow)">
            {/* Outer hexagon */}
            <polygon points="16,5 25.5,10.5 25.5,21.5 16,27 6.5,21.5 6.5,10.5" fill="#7ab8cc" />
            {/* Inner hexagon — lighter, gives depth */}
            <polygon points="16,9 22,12.5 22,19.5 16,23 10,19.5 10,12.5" fill="#c8ecf8" />
            {/* Bright edge on top-right face */}
            <line x1="16" y1="5" x2="25.5" y2="10.5" stroke="#e8f8ff" strokeWidth="1.5" />
            <line x1="16" y1="5" x2="6.5" y2="10.5" stroke="#d0f0ff" strokeWidth="1.5" />
            {/* Glint */}
            <rect x="15" y="7" width="2" height="2" fill="#ffffff" opacity="0.9" />
          </g>
        </svg>
      );

    // ─────────────────────────────────────────────
    // DIAMOND — cut gemstone shape, facets, strong blue glow
    // pentagon: flat top, wide middle, pointed bottom
    // ─────────────────────────────────────────────
    case "DIAMOND":
      return (
        <svg {...SVG_PROPS}>
          <defs>
            <filter id="diamond-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0.4 1 0 0  0 0.6 1 0 0  0 0.8 1 0 0  0 0 0 1.2 0"
                result="tinted"
              />
              <feMerge>
                <feMergeNode in="tinted" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#diamond-glow)">
            {/* Main gem body */}
            <polygon points="10,7 22,7 29,16 16,29 3,16" fill="#1a8fd1" />
            {/* Upper facet — lighter crown */}
            <polygon points="10,7 22,7 26,13 6,13" fill="#70d0f8" />
            {/* Left facet line */}
            <line x1="10" y1="7"  x2="6"  y2="13" stroke="#90e0ff" strokeWidth="1" opacity="0.8" />
            <line x1="6"  y1="13" x2="16" y2="29" stroke="#0a5fa8" strokeWidth="1" opacity="0.6" />
            {/* Right facet line */}
            <line x1="22" y1="7"  x2="26" y2="13" stroke="#90e0ff" strokeWidth="1" opacity="0.8" />
            <line x1="26" y1="13" x2="16" y2="29" stroke="#0a5fa8" strokeWidth="1" opacity="0.6" />
            {/* Centre facet line */}
            <line x1="16" y1="7"  x2="16" y2="13" stroke="#c0f0ff" strokeWidth="1" opacity="0.7" />
            <line x1="16" y1="13" x2="16" y2="29" stroke="#0870c0" strokeWidth="1" opacity="0.5" />
            {/* Top edge highlight */}
            <line x1="10" y1="7"  x2="22" y2="7"  stroke="#e0f8ff" strokeWidth="1.5" />
            {/* Glints */}
            <rect x="13" y="5" width="2" height="2" fill="#ffffff" />
            <rect x="21" y="8" width="2" height="1" fill="#ffffff" opacity="0.8" />
          </g>
        </svg>
      );

    // ─────────────────────────────────────────────
    // MASTER — crown, purple, prominent glow halo
    // polygon traces: base → left spike → mid band → center spike → mid band → right spike → base
    // ─────────────────────────────────────────────
    case "MASTER":
      return (
        <svg {...SVG_PROPS}>
          <defs>
            <filter id="master-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0.8 0 1 0 0  0.2 0 0.8 0 0  0.8 0 1 0 0  0 0 0 1.4 0"
                result="tinted"
              />
              <feMerge>
                <feMergeNode in="tinted" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#master-glow)">
            {/* Crown body */}
            <polygon
              points="4,27 4,19 9,10 13,19 16,7 19,19 23,10 27,19 27,27"
              fill="#9933dd"
            />
            {/* Inner band highlight */}
            <polygon
              points="4,27 4,22 27,22 27,27"
              fill="#7722bb"
            />
            {/* Spike highlights — left edge of each spike */}
            <line x1="4"  y1="19" x2="9"  y2="10" stroke="#dd99ff" strokeWidth="1.5" />
            <line x1="13" y1="19" x2="16" y2="7"  stroke="#ffffff" strokeWidth="1.5" />
            <line x1="19" y1="19" x2="23" y2="10" stroke="#dd99ff" strokeWidth="1.5" />
            {/* Spike tips glint */}
            <rect x="8"  y="8"  width="2" height="2" fill="#ffffff" opacity="0.8" />
            <rect x="15" y="5"  width="2" height="2" fill="#ffffff" />
            <rect x="22" y="8"  width="2" height="2" fill="#ffffff" opacity="0.8" />
            {/* Base bottom edge */}
            <line x1="4" y1="27" x2="27" y2="27" stroke="#cc77ff" strokeWidth="1" />
          </g>
        </svg>
      );

    // ─────────────────────────────────────────────
    // GRANDMASTER — solved Rubik's cube face colors, 3×3 sticker grid,
    //               intense multi-color glow, legendary
    //
    // Grid maths (each face is a parallelogram subdivided into 3×3):
    //   Top  face: u=(3.67,2), v=(-3.67,2), origin A=(16,5)
    //   Left face: u=(3.67,2), v=(0,3.33),  origin D=(5,11)
    //   Right face: u=(-3.67,2), v=(0,3.33), origin B=(27,11)
    // ─────────────────────────────────────────────
    case "GRANDMASTER":
      return (
        <svg {...SVG_PROPS} viewBox="3 3 26 26">
          <defs>
            {/* Saturate the blur so each face color bleeds its own halo */}
            <filter id="gm-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feColorMatrix in="blur" type="saturate" values="3" result="vivid" />
              <feMerge>
                <feMergeNode in="vivid" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#gm-glow)" transform="translate(16,16) scale(0.82,1) translate(-16,-16)">

            {/* ── CUBE FACES (Rubik's solved colors) ── */}
            {/* Top: yellow */}
            <polygon points="16,5 27,11 16,17 5,11" fill="#FFD700" />
            {/* Left: blue */}
            <polygon points="5,11 16,17 16,27 5,21" fill="#0051A2" />
            {/* Right: red */}
            <polygon points="27,11 16,17 16,27 27,21" fill="#C41E3A" />

            {/* ── TOP FACE 3×3 STICKER GRID ── */}
            {/* Column dividers (run diagonally left) */}
            <line x1="19.7" y1="7"  x2="8.7"  y2="13" stroke="#111" strokeWidth="0.8" />
            <line x1="23.3" y1="9"  x2="12.3" y2="15" stroke="#111" strokeWidth="0.8" />
            {/* Row dividers (run diagonally right) */}
            <line x1="12.3" y1="7"  x2="23.3" y2="13" stroke="#111" strokeWidth="0.8" />
            <line x1="8.7"  y1="9"  x2="19.7" y2="15" stroke="#111" strokeWidth="0.8" />

            {/* ── LEFT FACE 3×3 STICKER GRID ── */}
            {/* Column dividers (vertical) */}
            <line x1="8.7"  y1="13" x2="8.7"  y2="23" stroke="#111" strokeWidth="0.8" />
            <line x1="12.3" y1="15" x2="12.3" y2="25" stroke="#111" strokeWidth="0.8" />
            {/* Row dividers (run diagonally right) */}
            <line x1="5"    y1="14.3" x2="16" y2="20.3" stroke="#111" strokeWidth="0.8" />
            <line x1="5"    y1="17.7" x2="16" y2="23.7" stroke="#111" strokeWidth="0.8" />

            {/* ── RIGHT FACE 3×3 STICKER GRID ── */}
            {/* Column dividers (vertical) */}
            <line x1="23.3" y1="13" x2="23.3" y2="23" stroke="#111" strokeWidth="0.8" />
            <line x1="19.7" y1="15" x2="19.7" y2="25" stroke="#111" strokeWidth="0.8" />
            {/* Row dividers (run diagonally left) */}
            <line x1="27"   y1="14.3" x2="16" y2="20.3" stroke="#111" strokeWidth="0.8" />
            <line x1="27"   y1="17.7" x2="16" y2="23.7" stroke="#111" strokeWidth="0.8" />

          </g>
        </svg>
      );

    default:
      return null;
  }
}
