"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "buttons" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (variant === "buttons") {
    return (
      <div className={cn("flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1", className)}>
        {(["light", "dark", "system"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
              theme === t
                ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            {t === "light" && <Sun className="w-4 h-4" />}
            {t === "dark" && <Moon className="w-4 h-4" />}
            {t === "system" && <Monitor className="w-4 h-4" />}
            {t}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "dropdown") {
    return (
      <div className={cn("relative group", className)}>
        <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {resolvedTheme === "dark" ? (
            <Moon className="w-5 h-5 text-text-secondary" />
          ) : (
            <Sun className="w-5 h-5 text-text-secondary" />
          )}
        </button>
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-elevated border border-gray-200 dark:border-gray-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium capitalize transition-colors",
                theme === t
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary"
                  : "text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              {t === "light" && <Sun className="w-4 h-4" />}
              {t === "dark" && <Moon className="w-4 h-4" />}
              {t === "system" && <Monitor className="w-4 h-4" />}
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default: icon toggle
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5 text-text-secondary" />
      ) : (
        <Moon className="w-5 h-5 text-text-secondary" />
      )}
    </button>
  );
}
