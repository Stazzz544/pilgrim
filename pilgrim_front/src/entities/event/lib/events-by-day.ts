import { addDays } from "@/shared/lib/date";

import type { Event } from "@/shared/api/types";

export function groupEventsByDay(events: readonly Event[]): Map<string, Event[]> {
  const byDay = new Map<string, Event[]>();

  for (const event of events) {
    for (let day = event.startDate; day <= event.endDate; day = addDays(day, 1)) {
      byDay.set(day, [...(byDay.get(day) ?? []), event]);
    }
  }

  return byDay;
}

export function eventsInRange(events: readonly Event[], start: string, end: string): Event[] {
  return events
    .filter((event) => event.startDate <= end && event.endDate >= start)
    .sort((first, second) => first.startDate.localeCompare(second.startDate));
}
