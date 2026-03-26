import { createClient } from "@/lib/supabase/server";
import { formatTime, calcAo } from "@/lib/rank";

export type SolveDataPoint = {
  solveNumber: number;
  time_ms: number;
  timeFormatted: string;
  ao5: number | null;
  ao12: number | null;
};

export type PersonalBest = {
  milestone: string;
  label: string;
  threshold: number;
  time_ms: number | null;
  timeFormatted: string | null;
  achievedAt: string | null;
};

const MILESTONES = [
  { id: "sub_120", label: "Sub-2:00", threshold: 120000 },
  { id: "sub_60",  label: "Sub-1:00", threshold: 60000  },
  { id: "sub_45",  label: "Sub-45",   threshold: 45000  },
  { id: "sub_30",  label: "Sub-30",   threshold: 30000  },
];

export async function getSolveChartData(userId: string): Promise<SolveDataPoint[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("solve_times")
    .select("time_ms, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return [];

  const times = data.map((s) => s.time_ms);

  return data.map((solve, i) => ({
    solveNumber: i + 1,
    time_ms: solve.time_ms,
    timeFormatted: formatTime(solve.time_ms),
    ao5:  i >= 4  ? calcAo(times.slice(i - 4,  i + 1)) : null,
    ao12: i >= 11 ? calcAo(times.slice(i - 11, i + 1)) : null,
  }));
}

export async function getPersonalBests(userId: string): Promise<PersonalBest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("solve_times")
    .select("time_ms, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return MILESTONES.map((m) => {
    const first = (data ?? []).find((s) => s.time_ms < m.threshold);
    return {
      milestone: m.id,
      label: m.label,
      threshold: m.threshold,
      time_ms: first?.time_ms ?? null,
      timeFormatted: first ? formatTime(first.time_ms) : null,
      achievedAt: first?.created_at ?? null,
    };
  });
}
