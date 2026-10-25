"use client";

import { getEventStatus } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";
import { buildIcs, downloadFile } from "@/shared/lib/ics";
import { useToday } from "@/shared/lib/use-today";
import { Button } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";

import { EventStatusTag } from "./event-status-tag";

import type { Event } from "@/shared/api/types";
import type { JSX } from "react";

type LiveEventStatusProps = {
  event: Pick<Event, "startDate" | "endDate">;
  className?: string;
};

export function LiveEventStatus({ event, className }: LiveEventStatusProps): JSX.Element | null {
  const today = useToday();
  return today ? <EventStatusTag status={getEventStatus(event, today)} className={className} /> : null;
}

type AddToCalendarButtonProps = {
  event: Event;
  fullWidth?: boolean;
};

export function AddToCalendarButton({ event, fullWidth }: AddToCalendarButtonProps): JSX.Element {
  const handleClick = (): void => {
    const ics = buildIcs({
      uid: `${event.slug}@pilgrim`,
      title: event.title,
      description: event.summary,
      location: `${event.location}, ${event.region}`,
      startDate: event.startDate,
      endDate: event.endDate,
      url: absoluteUrl(`/events/${event.slug}/`),
    });
    downloadFile(ics, `pilgrim-${event.slug}.ics`, "text/calendar;charset=utf-8");
  };

  return (
    <Button variant="outline" fullWidth={fullWidth} onClick={handleClick}>
      <Icon name="calendar-plus" size={18} />
      Добавить в календарь
    </Button>
  );
}
