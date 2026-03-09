"use client";

import { useEffect, useRef } from "react";

// TwistyPlayer is a web component (custom element backed by THREE.js).
// Must be dynamically imported inside useEffect — never during SSR.
function CubeViewer({
  setupAlg = "",
  alg = "",
  size = 200,
}: {
  setupAlg?: string;
  alg?: string;
  size?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let player: HTMLElement | null = null;

    async function init() {
      const { TwistyPlayer } = await import("cubing/twisty");
      player = new TwistyPlayer({
        puzzle: "3x3x3",
        alg,
        experimentalSetupAlg: setupAlg,
        hintFacelets: "none",
        background: "none",
        controlPanel: "none",
        backView: "none",
      });
      player.style.width  = `${size}px`;
      player.style.height = `${size}px`;
      container.appendChild(player);
    }

    init();

    return () => {
      if (player && container.contains(player)) {
        container.removeChild(player);
      }
    };
  }, [setupAlg, alg, size]);

  return <div ref={containerRef} style={{ width: size, height: size }} />;
}

// ── Test cases ────────────────────────────────────────────────────────────────

const TESTS = [
  {
    label: "Solved cube",
    sub: "no setup alg, no moves",
    setupAlg: "",
    alg: "",
  },
  {
    label: "Sune (OLL 27)",
    sub: "setup: R U2' R' U' R U' R'",
    setupAlg: "R U2' R' U' R U' R'",
    alg: "",
  },
  {
    label: "T-Perm (PLL)",
    sub: "setup: F R' U' R U R U R' F' R U R' U' R' F R F'",
    setupAlg: "F R' U' R U R U R' F' R U R' U' R' F R F'",
    alg: "",
  },
];

export default function TestPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <span className="font-heading text-[9px] text-zinc-600 tracking-widest">
          DEV / TEST
        </span>
        <h1
          className="font-heading text-white leading-snug"
          style={{ fontSize: "clamp(12px, 2vw, 16px)" }}
        >
          cubing.js TEST PAGE
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          Verifying TwistyPlayer renders correctly before integrating across the site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TESTS.map(({ label, sub, setupAlg, alg }) => (
          <div
            key={label}
            className="flex flex-col gap-4 p-6"
            style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#0f0f1a" }}
          >
            {/* Cube viewer */}
            <div className="flex justify-center">
              <CubeViewer setupAlg={setupAlg} alg={alg} size={180} />
            </div>

            {/* Labels */}
            <div className="flex flex-col gap-1.5">
              <span className="font-heading text-[9px] text-white leading-relaxed">
                {label}
              </span>
              <span className="font-sans text-xs text-zinc-600 leading-relaxed">
                {sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="font-sans text-xs text-zinc-700">
        If you can see three interactive 3D cubes above, cubing.js is working correctly.
      </p>

    </div>
  );
}
