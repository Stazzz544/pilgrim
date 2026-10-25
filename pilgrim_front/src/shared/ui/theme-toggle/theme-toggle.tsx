"use client";

import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "@/shared/lib/theme";
import { Icon } from "@/shared/ui/icon/icon";

import type { Theme } from "@/shared/lib/theme";
import type { JSX } from "react";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={className}
      aria-label={nextTheme === "dark" ? "Включить тёмную тему" : "Включить светлую тему"}
      onClick={() => {
        document.documentElement.dataset.theme = nextTheme;

        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
          // В приватном режиме хранилище недоступно — тема просто не запомнится.
        }
      }}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
    </button>
  );
}
