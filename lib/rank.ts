export type RankTier = {
  rank: string;
  tier: string;
  color: string;
  bg: string;
  glow: string;
  start: number;
  end: number;
};

export const RANK_TIERS: RankTier[] = [
  { rank: "UNRANKED",    tier: "I",   start: 0,      end: 500,    color: "#55556a", bg: "#0d0d14", glow: "rgba(85,85,106,0.4)"    },
  { rank: "BRONZE",      tier: "I",   start: 500,    end: 833,    color: "#cd7f32", bg: "#1e1408", glow: "rgba(205,127,50,0.4)"   },
  { rank: "BRONZE",      tier: "II",  start: 833,    end: 1166,   color: "#cd7f32", bg: "#1e1408", glow: "rgba(205,127,50,0.4)"   },
  { rank: "BRONZE",      tier: "III", start: 1166,   end: 1500,   color: "#cd7f32", bg: "#1e1408", glow: "rgba(205,127,50,0.4)"   },
  { rank: "SILVER",      tier: "I",   start: 1500,   end: 2333,   color: "#a8a9ad", bg: "#151519", glow: "rgba(168,169,173,0.4)"  },
  { rank: "SILVER",      tier: "II",  start: 2333,   end: 3166,   color: "#a8a9ad", bg: "#151519", glow: "rgba(168,169,173,0.4)"  },
  { rank: "SILVER",      tier: "III", start: 3166,   end: 4000,   color: "#a8a9ad", bg: "#151519", glow: "rgba(168,169,173,0.4)"  },
  { rank: "GOLD",        tier: "I",   start: 4000,   end: 5333,   color: "#FFD500", bg: "#1a1500", glow: "rgba(255,213,0,0.4)"    },
  { rank: "GOLD",        tier: "II",  start: 5333,   end: 6666,   color: "#FFD500", bg: "#1a1500", glow: "rgba(255,213,0,0.4)"    },
  { rank: "GOLD",        tier: "III", start: 6666,   end: 8000,   color: "#FFD500", bg: "#1a1500", glow: "rgba(255,213,0,0.4)"    },
  { rank: "PLATINUM",    tier: "I",   start: 8000,   end: 10333,  color: "#4fc3f7", bg: "#061018", glow: "rgba(79,195,247,0.4)"   },
  { rank: "PLATINUM",    tier: "II",  start: 10333,  end: 12666,  color: "#4fc3f7", bg: "#061018", glow: "rgba(79,195,247,0.4)"   },
  { rank: "PLATINUM",    tier: "III", start: 12666,  end: 15000,  color: "#4fc3f7", bg: "#061018", glow: "rgba(79,195,247,0.4)"   },
  { rank: "DIAMOND",     tier: "I",   start: 15000,  end: 18333,  color: "#b9f2ff", bg: "#071215", glow: "rgba(185,242,255,0.4)"  },
  { rank: "DIAMOND",     tier: "II",  start: 18333,  end: 21666,  color: "#b9f2ff", bg: "#071215", glow: "rgba(185,242,255,0.4)"  },
  { rank: "DIAMOND",     tier: "III", start: 21666,  end: 25000,  color: "#b9f2ff", bg: "#071215", glow: "rgba(185,242,255,0.4)"  },
  { rank: "MASTER",      tier: "I",   start: 25000,  end: 30000,  color: "#C41E3A", bg: "#150408", glow: "rgba(196,30,58,0.4)"    },
  { rank: "MASTER",      tier: "II",  start: 30000,  end: 35000,  color: "#C41E3A", bg: "#150408", glow: "rgba(196,30,58,0.4)"    },
  { rank: "MASTER",      tier: "III", start: 35000,  end: 40000,  color: "#C41E3A", bg: "#150408", glow: "rgba(196,30,58,0.4)"    },
  { rank: "GRANDMASTER", tier: "I",   start: 40000,  end: 50000,  color: "#ff9100", bg: "#170900", glow: "rgba(255,145,0,0.4)"    },
  { rank: "GRANDMASTER", tier: "II",  start: 50000,  end: 60000,  color: "#ff9100", bg: "#170900", glow: "rgba(255,145,0,0.4)"    },
  { rank: "GRANDMASTER", tier: "III", start: 60000,  end: 999999, color: "#ff9100", bg: "#170900", glow: "rgba(255,145,0,0.4)"    },
];

export function getRankInfo(xp: number): RankTier & { nextLabel: string } {
  const current = [...RANK_TIERS].reverse().find((t) => xp >= t.start) ?? RANK_TIERS[0];
  const idx = RANK_TIERS.indexOf(current);
  const next = RANK_TIERS[idx + 1];
  const nextLabel = next ? `${next.rank} ${next.tier}` : "MAX RANK";
  return { ...current, nextLabel };
}

export function formatTime(ms: number): string {
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const mins = Math.floor(ms / 60000);
  const secs = ((ms % 60000) / 1000).toFixed(2);
  return `${mins}:${secs.padStart(5, "0")}`;
}

export function calcAo(times: number[]): number | null {
  if (times.length < 3) return null;
  const sorted = [...times].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  return Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);
}
