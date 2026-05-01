export const THEME_IDS = [
  "retro-dark",
  "midnight",
  "paper-light",
  "vaporwave",
  "gan",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type Theme = {
  id: ThemeId;
  label: string;
  tier: "free" | "pro";
  preview: {
    bg: string;
    surface: string;
    accent: string;
    text: string;
  };
};

export const THEMES: Theme[] = [
  {
    id: "retro-dark",
    label: "Dark Retro",
    tier: "free",
    preview: { bg: "#0d0d14", surface: "#0f0f1a", accent: "#FFD500", text: "#ededed" },
  },
  {
    id: "midnight",
    label: "Midnight",
    tier: "free",
    preview: { bg: "#080812", surface: "#0c0c1a", accent: "#60a5fa", text: "#e0e0f0" },
  },
  {
    id: "paper-light",
    label: "Paper Light",
    tier: "free",
    preview: { bg: "#f4f1eb", surface: "#ede9e0", accent: "#C41E3A", text: "#1a1a1a" },
  },
  {
    id: "vaporwave",
    label: "Vaporwave",
    tier: "pro",
    preview: { bg: "#1a0a2e", surface: "#22103a", accent: "#ff6ec7", text: "#f0d0ff" },
  },
  {
    id: "gan",
    label: "GAN",
    tier: "pro",
    preview: { bg: "#0a0a0a", surface: "#111111", accent: "#e0e0e0", text: "#f0f0f0" },
  },
];

export const DEFAULT_THEME: ThemeId = "retro-dark";

export function isValidTheme(id: string): id is ThemeId {
  return (THEME_IDS as readonly string[]).includes(id);
}
