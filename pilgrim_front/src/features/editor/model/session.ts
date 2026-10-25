import { useSyncExternalStore } from "react";

import { readStorage, writeStorage } from "@/shared/lib/storage";

import type { Authored } from "@/shared/api/types";

export type DemoRole = "organizer" | "activist";

export type DemoUser = {
  id: string;
  name: string;
  role: DemoRole;
  roleLabel: string;
  description: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "organizer",
    name: "Алексей Малахов",
    role: "organizer",
    roleLabel: "Организатор",
    description: "Добавляет и правит любые посты, мероприятия и альбомы",
  },
  {
    id: "activist",
    name: "Ирина",
    role: "activist",
    roleLabel: "Активист",
    description: "Ведёт свои мероприятия, посты и фотоотчёты",
  },
];

const STORAGE_KEY = "pilgrim-demo-session";
const PENDING = "__pending__";
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function login(userId: string): void {
  writeStorage(STORAGE_KEY, userId);
  notify();
}

export function logout(): void {
  writeStorage(STORAGE_KEY, null);
  notify();
}

// undefined — сессия ещё не прочитана (пререндер), null — не вошли.
export function useSession(): DemoUser | null | undefined {
  const id = useSyncExternalStore(
    subscribe,
    () => readStorage(STORAGE_KEY),
    () => PENDING,
  );

  if (id === PENDING) {
    return undefined;
  }

  return DEMO_USERS.find((user) => user.id === id) ?? null;
}

export function canEdit(user: DemoUser | null | undefined, item: Authored | null | undefined): boolean {
  if (!user || !item) {
    return false;
  }

  return user.role === "organizer" || item.authorId === user.id;
}
