"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { renameCube, deleteCube, addCube, type Cube } from "@/app/cubes/actions";

export default function CubeManager({ initialCubes }: { initialCubes: Cube[] }) {
  const [cubes, setCubes] = useState<Cube[]>(initialCubes);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [addingCube, setAddingCube] = useState(false);
  const [newCubeName, setNewCubeName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleRename(id: string) {
    if (!renameValue.trim()) return;
    await renameCube(id, renameValue.trim());
    setCubes((prev) => prev.map((c) => c.id === id ? { ...c, name: renameValue.trim() } : c));
    setRenaming(null);
    setRenameValue("");
  }

  async function handleDelete(id: string) {
    await deleteCube(id);
    setCubes((prev) => prev.filter((c) => c.id !== id));
    setConfirming(null);
    // If currently filtering by this cube, go back to all cubes
    router.push("/profile");
  }

  async function handleAdd() {
    if (!newCubeName.trim()) return;
    const created = await addCube(newCubeName.trim());
    if (created) setCubes((prev) => [...prev, created]);
    setNewCubeName("");
    setAddingCube(false);
  }

  return (
    <div className="flex flex-col gap-3 p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">MY CUBES</span>
          <span className="font-heading text-[8px] text-zinc-700">{cubes.length} cube{cubes.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-3">
          {!addingCube && (
            <button
              onClick={() => setAddingCube(true)}
              className="font-heading text-[8px] tracking-widest transition-colors cursor-pointer"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              + ADD
            </button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="font-heading text-[8px] tracking-widest transition-colors cursor-pointer"
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
          >
            {open ? "COLLAPSE" : "MANAGE"}
          </button>
        </div>
      </div>

      {/* Collapsed: show cube name pills */}
      {!open && cubes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cubes.map((c) => (
            <span
              key={c.id}
              className="font-heading text-[8px] tracking-widest px-2 py-1"
              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#0a0a12" }}
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {!open && cubes.length === 0 && (
        <span className="font-sans text-xs text-zinc-700">No cubes added yet. Add cubes from the timer page.</span>
      )}

      {/* Expanded: manage list */}
      {open && (
        <div className="flex flex-col gap-2">
          {cubes.length === 0 && (
            <span className="font-sans text-xs text-zinc-700">No cubes yet. Add one below or from the timer page.</span>
          )}
          {cubes.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
              style={{ backgroundColor: "#0a0a12", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {renaming === c.id ? (
                <>
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(c.id);
                      if (e.key === "Escape") { setRenaming(null); setRenameValue(""); }
                    }}
                    className="flex-1 font-heading text-[10px] tracking-widest px-2 py-1 bg-transparent outline-none"
                    style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff", minWidth: 0 }}
                  />
                  <button
                    onClick={() => handleRename(c.id)}
                    className="font-heading text-[8px] tracking-widest px-2 py-1 shrink-0 cursor-pointer"
                    style={{ backgroundColor: "#FFD500", color: "#000" }}
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => { setRenaming(null); setRenameValue(""); }}
                    className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <>
                  <span className="font-heading text-[10px] tracking-widest flex-1 text-white">{c.name}</span>
                  <button
                    onClick={() => { setRenaming(c.id); setRenameValue(c.name); setConfirming(null); }}
                    className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFD500")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                  >
                    RENAME
                  </button>
                  {confirming === c.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer"
                        style={{ color: "#C41E3A" }}
                      >
                        CONFIRM DELETE
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer transition-colors"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        CANCEL
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setConfirming(c.id); setRenaming(null); }}
                      className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer transition-colors"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#C41E3A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                    >
                      DELETE
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Add cube inline */}
          {addingCube && (
            <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "#0a0a12", border: "1px solid rgba(255,255,255,0.08)" }}>
              <input
                autoFocus
                value={newCubeName}
                onChange={(e) => setNewCubeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") { setAddingCube(false); setNewCubeName(""); }
                }}
                placeholder="e.g. GAN 16"
                className="flex-1 font-heading text-[10px] tracking-widest px-2 py-1 bg-transparent outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff", minWidth: 0 }}
              />
              <button
                onClick={handleAdd}
                className="font-heading text-[8px] tracking-widest px-2 py-1 shrink-0 cursor-pointer"
                style={{ backgroundColor: "#009B48", color: "#000" }}
              >
                ADD
              </button>
              <button
                onClick={() => { setAddingCube(false); setNewCubeName(""); }}
                className="font-heading text-[8px] tracking-widest shrink-0 cursor-pointer"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
