import type { Paginated } from "./types";

export function toPage<T>(results: T[]): Paginated<T> {
  return { count: results.length, next: null, previous: null, results };
}
