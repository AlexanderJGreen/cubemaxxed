"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { SolveDataPoint } from "@/lib/analytics";

const SolveChart = dynamic(() => import("./SolveChart"), { ssr: false });

export default function SolveChartClient({ data }: { data: SolveDataPoint[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <SolveChart data={data} />;
}
