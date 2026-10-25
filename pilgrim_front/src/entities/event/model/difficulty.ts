import type { Difficulty } from "@/shared/api/types";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
};

export const DIFFICULTY_LEVEL: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const DIFFICULTY_OPTIONS = (Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((value) => ({
  value,
  label: DIFFICULTY_LABELS[value],
}));
