"use client";

import { THEMES } from "@/lib/themes";
import type { ThemeId } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import { useIsPro } from "./ProProvider";

export function ThemeSwitcher() {
  const { theme: current, setTheme } = useTheme();
  const isPro = useIsPro();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-[9px] tracking-widest" style={{ color: "var(--text-dim)" }}>
          THEME
        </span>
        <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
          {isPro ? "Pro account" : "Free account — 3 themes available"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {THEMES.map((t) => {
          const locked = t.tier === "pro" && !isPro;
          const active = current === t.id;

          return (
            <button
              key={t.id}
              onClick={() => !locked && setTheme(t.id as ThemeId)}
              disabled={locked}
              className="relative flex flex-col gap-2 p-3 transition-all"
              style={{
                border: active
                  ? `2px solid ${t.preview.accent}`
                  : `1px solid rgba(128,128,128,0.2)`,
                backgroundColor: t.preview.bg,
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.55 : 1,
                boxShadow: active ? `0 0 12px ${t.preview.accent}40` : "none",
              }}
              title={locked ? `${t.label} — Pro only` : t.label}
            >
              {/* Mini surface preview */}
              <div
                className="w-full"
                style={{
                  height: 36,
                  backgroundColor: t.preview.surface,
                  border: `1px solid ${t.preview.accent}25`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Fake header bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 8,
                    right: 8,
                    height: 3,
                    backgroundColor: t.preview.accent,
                    opacity: 0.9,
                  }}
                />
                {/* Fake text lines */}
                <div
                  style={{
                    position: "absolute",
                    top: 15,
                    left: 8,
                    width: "65%",
                    height: 2,
                    backgroundColor: t.preview.text,
                    opacity: 0.25,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 21,
                    left: 8,
                    width: "45%",
                    height: 2,
                    backgroundColor: t.preview.text,
                    opacity: 0.15,
                  }}
                />
              </div>

              {/* Theme name */}
              <span
                className="font-heading text-[7px] leading-none tracking-widest text-left"
                style={{ color: t.preview.accent }}
              >
                {t.label.toUpperCase()}
              </span>

              {/* Active dot */}
              {active && (
                <div
                  className="absolute bottom-2 right-2"
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: t.preview.accent,
                    boxShadow: `0 0 4px ${t.preview.accent}`,
                  }}
                />
              )}

              {/* Pro badge */}
              {t.tier === "pro" && (
                <span
                  className="absolute top-1.5 right-1.5 font-heading text-[6px] tracking-widest px-1.5 py-0.5 leading-none"
                  style={{
                    backgroundColor: locked ? "rgba(128,128,128,0.4)" : t.preview.accent,
                    color: locked ? "#999" : t.preview.bg,
                  }}
                >
                  {locked ? "🔒 PRO" : "PRO"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!isPro && (
        <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Vaporwave and GAN themes are available with a Pro subscription.
        </p>
      )}
    </div>
  );
}
