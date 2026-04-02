"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { addGoal, deleteGoal, type Goal, type GoalType } from "@/app/goals/actions";
import { type Cube } from "@/app/cubes/actions";
import { formatTime } from "@/lib/rank";

function Dropdown<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full font-heading text-[10px] tracking-widest px-3 py-2 flex items-center justify-between gap-2 cursor-pointer"
        style={{
          backgroundColor: "#0d0d14",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <span>{selected?.label ?? "—"}</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, position: "relative", top: 1 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div
          className="absolute z-50 w-full"
          style={{ backgroundColor: "#0d0d14", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none" }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full text-left font-heading text-[10px] tracking-widest px-3 py-2 transition-colors cursor-pointer"
              style={{
                color: o.value === value ? "#FFD500" : "rgba(255,255,255,0.5)",
                backgroundColor: o.value === value ? "rgba(255,213,0,0.05)" : "transparent",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  single: "SINGLE",
  ao5:    "AO5",
  ao12:   "AO12",
};

const GOAL_TYPE_COLORS: Record<GoalType, string> = {
  single: "#C41E3A",
  ao5:    "#4FC3F7",
  ao12:   "#FFD500",
};

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  const color = GOAL_TYPE_COLORS[goal.goal_type];
  const progress = goal.current_ms !== null
    ? Math.min(100, Math.round((goal.target_ms / goal.current_ms) * 100))
    : 0;

  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{
        backgroundColor: goal.achieved ? "rgba(0,155,72,0.06)" : "#0a0a12",
        border: goal.achieved
          ? "1px solid rgba(0,155,72,0.25)"
          : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="font-heading text-[8px] tracking-widest px-1.5 py-0.5"
              style={{
                color,
                border: `1px solid ${color}40`,
                backgroundColor: `${color}10`,
              }}
            >
              {GOAL_TYPE_LABELS[goal.goal_type]}
            </span>
            {goal.cube_name ? (
              <span className="font-heading text-[8px] tracking-widest text-zinc-500">
                {goal.cube_name.toUpperCase()}
              </span>
            ) : (
              <span className="font-heading text-[8px] tracking-widest text-zinc-600">
                ALL CUBES
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {goal.achieved && (
            <span
              className="font-heading text-[7px] tracking-widest px-1.5 py-0.5"
              style={{ color: "#009B48", border: "1px solid rgba(0,155,72,0.35)", backgroundColor: "rgba(0,155,72,0.08)" }}
            >
              ACHIEVED
            </span>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="font-heading text-[8px] tracking-widest text-zinc-700 hover:text-red-500 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-[7px] text-zinc-600 tracking-widest">TARGET</span>
          <span className="font-heading text-xl leading-none" style={{ color }}>
            {formatTime(goal.target_ms)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="font-heading text-[7px] text-zinc-600 tracking-widest">CURRENT</span>
          <span className="font-heading text-xl leading-none text-white">
            {goal.current_ms !== null ? formatTime(goal.current_ms) : "—"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1">
        <div className="relative h-2 w-full bg-[#1a1a26]" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="absolute inset-y-0 left-0 transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: goal.achieved ? "#009B48" : color,
              boxShadow: goal.achieved ? "0 0 8px rgba(0,155,72,0.5)" : `0 0 8px ${color}60`,
            }}
          />
        </div>
        <span className="font-heading text-[7px] text-zinc-700 tracking-widest">
          {goal.current_ms !== null
            ? goal.achieved
              ? `${formatTime(goal.current_ms)} — ${Math.abs(goal.target_ms - goal.current_ms) / 1000 < 0.1 ? "exact!" : `${((goal.current_ms - goal.target_ms) / 1000).toFixed(2)}s under target`}`
              : `${((goal.current_ms - goal.target_ms) / 1000).toFixed(2)}s away`
            : "no solves yet"}
        </span>
      </div>
    </div>
  );
}

function AddGoalForm({ cubes, onClose }: { cubes: Cube[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [cubeId, setCubeId] = useState("all");
  const [goalType, setGoalType] = useState<"single" | "ao5" | "ao12">("ao12");

  const cubeOptions = [
    { value: "all", label: "All cubes" },
    ...cubes.map((c) => ({ value: c.id, label: c.name })),
  ];

  const typeOptions = [
    { value: "single" as const, label: "Best Single" },
    { value: "ao5"    as const, label: "AO5" },
    { value: "ao12"   as const, label: "AO12" },
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addGoal(formData);
      onClose();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4"
      style={{ border: "1px solid rgba(255,213,0,0.15)", backgroundColor: "rgba(255,213,0,0.03)" }}
    >
      <span className="font-heading text-[8px] text-zinc-500 tracking-widest">NEW GOAL</span>

      <input type="hidden" name="cube_id" value={cubeId} />
      <input type="hidden" name="goal_type" value={goalType} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[7px] text-zinc-600 tracking-widest">CUBE</label>
          <Dropdown value={cubeId} onChange={setCubeId} options={cubeOptions} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[7px] text-zinc-600 tracking-widest">TYPE</label>
          <Dropdown value={goalType} onChange={setGoalType} options={typeOptions} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-heading text-[7px] text-zinc-600 tracking-widest">TARGET</label>
          <input
            name="target"
            type="text"
            required
            placeholder="e.g. 30 or 1:23.4"
            className="font-heading text-[10px] tracking-widest text-zinc-200 bg-[#0d0d14] px-3 py-2 outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="font-heading text-[8px] tracking-widest px-4 py-2 transition-all disabled:opacity-40 cursor-pointer"
          style={{ backgroundColor: "#FFD500", color: "#0d0d14", boxShadow: "2px 2px 0 #a38a00" }}
        >
          {isPending ? "SAVING..." : "SAVE GOAL"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-heading text-[8px] tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}

export function GoalsSection({ goals, cubes }: { goals: Goal[]; cubes: Cube[] }) {
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteGoal(id);
    });
  }

  return (
    <div
      className="flex flex-col gap-5 p-6"
      style={{ border: "1px solid rgba(255,255,255,0.05)", backgroundColor: "#0f0f1a" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-[9px] text-zinc-600 tracking-widest">GOALS</span>
          <span className="font-sans text-xs text-zinc-600">
            {goals.length === 0
              ? "Set a target time to track your progress"
              : `${goals.filter(g => g.achieved).length} of ${goals.length} achieved`}
          </span>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="font-heading text-[8px] tracking-widest px-3 py-1.5 transition-colors cursor-pointer"
            style={{
              color: "#FFD500",
              border: "1px solid rgba(255,213,0,0.25)",
              backgroundColor: "rgba(255,213,0,0.05)",
            }}
          >
            + ADD GOAL
          </button>
        )}
      </div>

      {adding && <AddGoalForm cubes={cubes} onClose={() => setAdding(false)} />}

      {goals.length === 0 && !adding ? (
        <span className="font-sans text-sm text-zinc-700">No goals set yet.</span>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
