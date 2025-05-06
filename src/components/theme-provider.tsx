
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  largeText: boolean;
  setLargeText: (value: boolean) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  highContrast: false,
  setHighContrast: () => null,
  largeText: false,
  setLargeText: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem("high-contrast");
    return saved === "true";
  });

  const [largeText, setLargeText] = useState(() => {
    const saved = localStorage.getItem("large-text");
    return saved === "true";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("high-contrast", highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
    localStorage.setItem("large-text", largeText.toString());
  }, [largeText]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
