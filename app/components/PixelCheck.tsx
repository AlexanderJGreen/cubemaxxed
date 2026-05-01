// 7×5 pixel art checkmark
const CHECK_PIXELS = [
  [0,    0,    0,    0,    0,    0.75, 1   ],
  [0,    0,    0,    0,    0.85, 1,    0   ],
  [0.8,  0,    0,    0.9,  1,    0,    0   ],
  [0,    0.9,  1,    1,    0,    0,    0   ],
  [0,    0,    0.8,  0,    0,    0,    0   ],
];

// 5×5 pixel art X
const X_PIXELS = [
  [1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 0, 0, 0, 1],
];

type Props = { color?: string; px?: number };

export function PixelCheck({ color = "currentColor", px = 2 }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(7, ${px}px)`,
        gap: "1px",
        flexShrink: 0,
      }}
    >
      {CHECK_PIXELS.flat().map((opacity, i) => (
        <div
          key={i}
          style={{
            width: px,
            height: px,
            backgroundColor: opacity > 0 ? color : "transparent",
            opacity: opacity > 0 ? opacity : 1,
          }}
        />
      ))}
    </div>
  );
}

export function PixelX({ color = "currentColor", px = 2 }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${px}px)`,
        gap: "1px",
        flexShrink: 0,
      }}
    >
      {X_PIXELS.flat().map((opacity, i) => (
        <div
          key={i}
          style={{
            width: px,
            height: px,
            backgroundColor: opacity > 0 ? color : "transparent",
            opacity: opacity > 0 ? opacity : 1,
          }}
        />
      ))}
    </div>
  );
}
