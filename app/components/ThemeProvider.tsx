"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
import type { ThemeId } from "@/lib/themes";
import { saveTheme } from "@/app/profile/theme-actions";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  initialTheme,
  isLoggedIn,
}: {
  children: React.ReactNode;
  initialTheme: ThemeId;
  isLoggedIn: boolean;
}) {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function setTheme(id: ThemeId) {
    setThemeState(id);
    try {
      localStorage.setItem("cm-theme", id);
    } catch {}
    if (isLoggedIn) {
      saveTheme(id).catch(() => {});
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeScript({ theme }: { theme: ThemeId }) {
  // Runs before React hydration to prevent flash of wrong theme
  const script = `(function(){var t=localStorage.getItem('cm-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function resolveThemeFromStorage(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem("cm-theme");
    if (stored && isValidTheme(stored)) return stored;
  } catch {}
  return DEFAULT_THEME;
}
