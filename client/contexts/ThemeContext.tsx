"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("duo-theme") as Theme | null;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  // Resolve system preference and apply theme
  useEffect(() => {
    const root = document.documentElement;

    let resolved: "dark" | "light";

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolved = prefersDark ? "dark" : "light";
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);

    // Apply data attribute to <html> for CSS variable switching
    root.setAttribute("data-theme", resolved);
    root.classList.remove("dark", "light");
    root.classList.add(resolved);
  }, [theme]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(resolved);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("duo-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
