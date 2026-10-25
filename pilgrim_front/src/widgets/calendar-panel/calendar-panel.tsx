"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { eventsInRange, groupEventsByDay } from "@/entities/event/lib/events-by-day";
import { useMergedEvents } from "@/features/editor/model/content";
import { getEventStatus } from "@/shared/api/events";
import { eventHref } from "@/shared/api/routes";
import { formatDayMonth, getWeekBounds, monthKey, monthOf } from "@/shared/lib/date";
import { useToday } from "@/shared/lib/use-today";
import { Card } from "@/shared/ui/card/card";
import { MonthCalendar } from "@/shared/ui/month-calendar/month-calendar";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Event } from "@/shared/api/types";
import type { MonthRef } from "@/shared/lib/date";
import type { JSX } from "react";

import styles from "./calendar-panel.module.css";

const AGENDA_LIMIT = 3;

type CalendarPanelProps = {
  events: Event[];
};

export function CalendarPanel({ events: baseEvents }: CalendarPanelProps): JSX.Element {
  const today = useToday();
  const events = useMergedEvents(baseEvents);
  const router = useRouter();
  const [pickedMonth, setPickedMonth] = useState<MonthRef | null>(null);
  const byDay = groupEventsByDay(events);

  if (!today) {
    return (
      <Card className={styles["panel"]} aria-hidden="true">
        <Skeleton height={300} />
        <Skeleton height={140} />
      </Card>
    );
  }

  const month = pickedMonth ?? monthOf(today);
  const week = getWeekBounds(today);
  const weekEvents = eventsInRange(events, week.start, week.end);
  const agenda = weekEvents.length
    ? weekEvents
    : events.filter((event) => getEventStatus(event, today) !== "past").slice(0, AGENDA_LIMIT);

  return (
    <Card as="section" className={styles["panel"]} aria-label="Календарь мероприятий">
      <MonthCalendar
        month={month}
        today={today}
        onMonthChange={setPickedMonth}
        headingLevel="h3"
        getDayMark={(day) => {
          if (!byDay.has(day)) {
            return null;
          }

          return day < today ? "past-event" : "event";
        }}
        getDayLabel={(day) => (byDay.get(day) ?? []).map((event) => event.title).join(", ")}
        onSelectDay={(day) => router.push(`/calendar?month=${monthKey(monthOf(day))}&day=${day}`)}
      />

      <ul className={styles["legend"]}>
        <li>
          <span className={styles["dot-event"]} />
          Мероприятия
        </li>
        <li>
          <span className={styles["dot-today"]} />
          Сегодня
        </li>
        <li>
          <span className={styles["dot-past"]} />
          Прошедшие
        </li>
      </ul>

      <div className={styles["agenda"]}>
        <h3 className={styles["agenda-title"]}>{weekEvents.length ? "На этой неделе" : "Скоро"}</h3>
        <ul className={styles["agenda-list"]}>
          {agenda.slice(0, AGENDA_LIMIT).map((event) => (
            <li key={event.slug}>
              <Link href={eventHref(event.slug)} className={styles["agenda-item"]}>
                <span className={styles["agenda-date"]}>{formatDayMonth(event.startDate)}</span>
                <span className={styles["agenda-text"]}>
                  <span className={styles["agenda-name"]}>{event.title}</span>
                  <span className={styles["agenda-place"]}>{event.region}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
