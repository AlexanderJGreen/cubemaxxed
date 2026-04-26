export type ChallengeType =
  | "solves_today"
  | "lessons_today"
  | "solves_week"
  | "lessons_week"
  | "streak_days";

export interface Challenge {
  text: string;
  xp: number;
  type: ChallengeType;
  target: number;
}

export const DAILY_CHALLENGES: Challenge[] = [
  { text: "Log 5 solves in the timer",    xp: 30,  type: "solves_today",  target: 5  },
  { text: "Complete a lesson",            xp: 40,  type: "lessons_today", target: 1  },
  { text: "Log 3 solves in the timer",    xp: 20,  type: "solves_today",  target: 3  },
  { text: "Log 10 solves in the timer",   xp: 50,  type: "solves_today",  target: 10 },
  { text: "Complete 2 lessons",           xp: 60,  type: "lessons_today", target: 2  },
  { text: "Get in a practice session",    xp: 25,  type: "solves_today",  target: 1  },
  { text: "Log 7 solves in the timer",    xp: 40,  type: "solves_today",  target: 7  },
];

export const WEEKLY_CHALLENGES: Challenge[] = [
  { text: "Log 30 solves this week",           xp: 150, type: "solves_week",  target: 30 },
  { text: "Complete 3 lessons this week",      xp: 200, type: "lessons_week", target: 3  },
  { text: "Keep your streak going all week",   xp: 100, type: "streak_days",  target: 7  },
  { text: "Log 15 solves this week",           xp: 100, type: "solves_week",  target: 15 },
  { text: "Complete 5 lessons this week",      xp: 300, type: "lessons_week", target: 5  },
  { text: "Log 50 solves this week",           xp: 200, type: "solves_week",  target: 50 },
  { text: "Complete 2 lessons this week",      xp: 150, type: "lessons_week", target: 2  },
];

export function getDailyChallenge(dateStr: string): Challenge {
  const d = new Date(dateStr);
  const daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[daysSinceEpoch % DAILY_CHALLENGES.length];
}

export function getWeeklyChallenge(weekStartStr: string): Challenge {
  const d = new Date(weekStartStr);
  const weeksSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24 * 7));
  return WEEKLY_CHALLENGES[weeksSinceEpoch % WEEKLY_CHALLENGES.length];
}
