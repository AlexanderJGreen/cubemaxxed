"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SolveDataPoint } from "@/lib/analytics";
import { formatTime } from "@/lib/rank";

function msToSeconds(ms: number) {
  return ms / 1000;
}

function formatYAxis(seconds: number) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(0).padStart(2, "0");
    return `${m}:${s}`;
  }
  return `${seconds.toFixed(0)}s`;
}

type TooltipPayloadEntry = {
  name: string;
  value: number;
  color: string;
  dataKey: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const solve = payload.find((p) => p.dataKey === "time_seconds");
  const ao5 = payload.find((p) => p.dataKey === "ao5_seconds");
  const ao12 = payload.find((p) => p.dataKey === "ao12_seconds");

  return (
    <div
      className="flex flex-col gap-2 p-3"
      style={{
        backgroundColor: "#0f0f1a",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 140,
      }}
    >
      <span className="font-heading text-[8px] text-zinc-500 tracking-widest">
        SOLVE #{label}
      </span>
      {solve && (
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-[8px]" style={{ color: "#FFD500" }}>TIME</span>
          <span className="font-sans text-xs text-white">{formatTime(solve.value * 1000)}</span>
        </div>
      )}
      {ao5 && (
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-[8px]" style={{ color: "#C41E3A" }}>AO5</span>
          <span className="font-sans text-xs text-white">{formatTime(ao5.value * 1000)}</span>
        </div>
      )}
      {ao12 && (
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-[8px]" style={{ color: "#0051A2" }}>AO12</span>
          <span className="font-sans text-xs text-white">{formatTime(ao12.value * 1000)}</span>
        </div>
      )}
    </div>
  );
}

export default function SolveChart({ data }: { data: SolveDataPoint[] }) {
  if (data.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <span className="font-heading text-[10px] text-zinc-500 tracking-widest">NOT ENOUGH DATA</span>
        <span className="font-sans text-sm text-zinc-600 text-center max-w-xs">
          Log at least 5 solves in the playground to see your progress graph.
        </span>
        <span className="font-heading text-[9px] text-zinc-700">
          {data.length} / 5 solves logged
        </span>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    solveNumber: d.solveNumber,
    time_seconds: msToSeconds(d.time_ms),
    ao5_seconds: d.ao5 !== null ? msToSeconds(d.ao5) : null,
    ao12_seconds: d.ao12 !== null ? msToSeconds(d.ao12) : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="solveNumber"
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "var(--font-heading)" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "SOLVE #",
            position: "insideBottomRight",
            offset: -4,
            fill: "rgba(255,255,255,0.15)",
            fontSize: 8,
            fontFamily: "var(--font-heading)",
          }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "var(--font-heading)" }}
          tickLine={false}
          axisLine={false}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
        <Legend
          wrapperStyle={{ paddingTop: 12 }}
          formatter={(value) => (
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, fontFamily: "var(--font-heading)" }}>
              {value === "time_seconds" ? "SINGLE" : value === "ao5_seconds" ? "AO5" : "AO12"}
            </span>
          )}
        />
        <Line
          type="monotone"
          dataKey="time_seconds"
          stroke="#FFD500"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "#FFD500", strokeWidth: 0 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="ao5_seconds"
          stroke="#C41E3A"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: "#C41E3A", strokeWidth: 0 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="ao12_seconds"
          stroke="#0051A2"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: "#0051A2", strokeWidth: 0 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
