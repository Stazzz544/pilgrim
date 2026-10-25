import { EVENTS } from "@/mocks/events";

import { toPage } from "./paginate";

import type { Event, EventsQuery, EventStatus, Paginated } from "./types";

export function getEventStatus(event: Pick<Event, "startDate" | "endDate">, today: string): EventStatus {
  if (event.endDate < today) {
    return "past";
  }

  return event.startDate > today ? "upcoming" : "ongoing";
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replaceAll("ё", "е");
}

function matchesSearch(event: Event, search: string): boolean {
  const haystack = normalizeSearch(
    [event.title, event.summary, event.location, event.region, event.category.name, ...event.tags].join(" "),
  );
  return normalizeSearch(search)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export function filterEvents(events: readonly Event[], query: EventsQuery): Event[] {
  const { scope, today, search, categories, difficulty } = query;
  const ordering = query.ordering ?? (scope === "archive" ? "-start_date" : "start_date");

  const filtered = events.filter((event) => {
    if (scope && today) {
      const isPast = getEventStatus(event, today) === "past";

      if (isPast !== (scope === "archive")) {
        return false;
      }
    }

    if (categories?.length && !categories.includes(event.category.slug)) {
      return false;
    }

    if (difficulty && event.difficulty !== difficulty) {
      return false;
    }

    return !search?.trim() || matchesSearch(event, search);
  });

  const direction = ordering === "start_date" ? 1 : -1;
  return filtered.sort((first, second) => first.startDate.localeCompare(second.startDate) * direction);
}

export async function getEvents(query: EventsQuery = {}): Promise<Paginated<Event>> {
  return toPage(filterEvents(EVENTS, query));
}

export async function getEvent(slug: string): Promise<Event | null> {
  return EVENTS.find((event) => event.slug === slug) ?? null;
}
