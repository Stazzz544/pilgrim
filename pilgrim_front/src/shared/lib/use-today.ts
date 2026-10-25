"use client";

import { useSyncExternalStore } from "react";

import { toDateKey } from "./date";

const subscribe = (): (() => void) => () => {};

// null при пререндере: статическая сборка не знает, какой день будет у посетителя.
export function useToday(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => toDateKey(new Date()),
    () => null,
  );
}
