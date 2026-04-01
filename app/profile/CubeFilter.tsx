"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Cube } from "@/app/cubes/actions";

export default function CubeFilter({
  cubes,
  selectedId,
}: {
  cubes: Cube[];
  selectedId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selectedCube = cubes.find((c) => c.id === selectedId);
  const label = selectedCube ? selectedCube.name : "ALL CUBES";

  function select(cubeId: string | null) {
    setOpen(false);
    if (cubeId) router.push(`/profile?cube=${cubeId}`);
    else router.push("/profile");
  }

  if (cubes.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-heading text-[10px] tracking-widest px-4 py-2 flex items-center gap-3 transition-colors cursor-pointer"
        style={{
          backgroundColor: "#0d0d14",
          border: selectedId ? "1px solid rgba(0,155,72,0.4)" : "1px solid rgba(255,255,255,0.1)",
          color: selectedId ? "#009B48" : "rgba(255,255,255,0.45)",
          minWidth: 200,
        }}
      >
        <span style={{ fontSize: 8, opacity: 0.5 }}>&#9647;</span>
        <span className="flex-1 text-left truncate">{label.toUpperCase()}</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, lineHeight: 1, display: "flex", alignItems: "center", position: "relative", top: 2 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          className="absolute z-50 w-full"
          style={{ border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", backgroundColor: "#0d0d14" }}
        >
          <button
            onClick={() => select(null)}
            className="w-full text-left font-heading text-[10px] tracking-widest px-4 py-2 transition-colors"
            style={{
              color: !selectedId ? "#FFD500" : "rgba(255,255,255,0.45)",
              backgroundColor: !selectedId ? "rgba(255,213,0,0.05)" : "transparent",
            }}
          >
            ALL CUBES
          </button>
          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.05)", margin: "2px 0" }} />
          {cubes.map((c) => (
            <button
              key={c.id}
              onClick={() => select(c.id)}
              className="w-full text-left font-heading text-[10px] tracking-widest px-4 py-2 transition-colors"
              style={{
                color: c.id === selectedId ? "#009B48" : "rgba(255,255,255,0.45)",
                backgroundColor: c.id === selectedId ? "rgba(0,155,72,0.06)" : "transparent",
              }}
            >
              {c.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
