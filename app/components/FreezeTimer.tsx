"use client";

import { useEffect, useState } from "react";

function getMsUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

export function FreezeTimer() {
  const [ms, setMs] = useState(getMsUntilMidnightUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getMsUntilMidnightUTC();
      setMs(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-heading text-[8px] tracking-widest mt-0.5"
      style={{ color: "#4FC3F7" }}
    >
      FREEZE ACTIVE — {formatCountdown(ms)}
    </span>
  );
}
