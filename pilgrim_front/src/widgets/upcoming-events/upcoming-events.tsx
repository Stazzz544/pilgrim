"use client";

import { EventCard, EventCardSkeleton } from "@/entities/event/ui/event-card";
import { filterEvents, getEventStatus } from "@/shared/api/events";
import { useToday } from "@/shared/lib/use-today";

import type { Event } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./upcoming-events.module.css";

type UpcomingEventsProps = {
  events: Event[];
  limit: number;
};

export function UpcomingEvents({ events, limit }: UpcomingEventsProps): JSX.Element {
  const today = useToday();

  if (!today) {
    return (
      <div className={styles["list"]}>
        {Array.from({ length: limit }, (_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const upcoming = filterEvents(events, { scope: "upcoming", today }).slice(0, limit);

  return (
    <ul className={styles["list"]}>
      {upcoming.map((event, index) => (
        <li key={event.slug}>
          <EventCard event={event} status={getEventStatus(event, today)} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}
