import type { Publication } from "@/shared/api/types";

export const PUBLICATION_OPTIONS: Array<{ value: Publication; label: string }> = [
  { value: "published", label: "Опубликовано" },
  { value: "draft", label: "Черновик" },
];

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function splitTags(text: string): string[] {
  return [...new Set(text.split(",").map((tag) => tag.trim()).filter(Boolean))].slice(0, 8);
}

export function focusFirstError(fieldId: (name: string) => string, errors: Record<string, string | undefined>): boolean {
  const firstInvalid = Object.keys(errors).find((key) => errors[key]);

  if (!firstInvalid) {
    return false;
  }

  document.getElementById(fieldId(firstInvalid))?.focus();
  return true;
}
