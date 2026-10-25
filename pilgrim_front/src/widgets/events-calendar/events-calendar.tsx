"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { eventsInRange, groupEventsByDay } from "@/entities/event/lib/events-by-day";
import { EventCard } from "@/entities/event/ui/event-card";
import { getEventStatus } from "@/shared/api/events";
import {
  dateKeyFromParts,
  formatDate,
  formatMonthYear,
  monthKey,
  monthOf,
  parseDateKey,
  parseMonthKey,
} from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { replaceSearchParams } from "@/shared/lib/search-params";
import { useToday } from "@/shared/lib/use-today";
import { Button } from "@/shared/ui/button/button";
import { MonthCalendar } from "@/shared/ui/month-calendar/month-calendar";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Event } from "@/shared/api/types";
import type { MonthRef } from "@/shared/lib/date";
import type { JSX } from "react";

import styles from "./events-calendar.module.css";

const MAX_CHIPS = 2;

function isDateKey(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

type EventsCalendarProps = {
  events: Event[];
};

export function EventsCalendar({ events }: EventsCalendarProps): JSX.Element {
  const today = useToday();
  const searchParams = useSearchParams();
  const byDay = useMemo(() => groupEventsByDay(events), [events]);

  if (!today) {
    return <Skeleton height={640} radius="var(--radius-md)" />;
  }

  const dayParam = searchParams.get("day");
  const selectedDay = isDateKey(dayParam) ? dayParam : null;
  const month: MonthRef =
    parseMonthKey(searchParams.get("month")) ?? (selectedDay ? monthOf(selectedDay) : monthOf(today));

  const setParams = (nextMonth: MonthRef, day: string | null): void => {
    const params = new URLSearchParams({ month: monthKey(nextMonth) });

    if (day) {
      params.set("day", day);
    }

    replaceSearchParams(params);
  };

  const monthStart = dateKeyFromParts(month.year, month.month, 1);
  const monthEnd = dateKeyFromParts(month.year, month.month, new Date(month.year, month.month + 1, 0).getDate());
  const listed = selectedDay ? (byDay.get(selectedDay) ?? []) : eventsInRange(events, monthStart, monthEnd);
  const listTitle = selectedDay ? formatDate(selectedDay) : `${formatMonthYear(month)}`;

  return (
    <div className={styles["layout"]}>
      <MonthCalendar
        size="full"
        month={month}
        today={today}
        selectedDay={selectedDay}
        className={styles["calendar"]}
        onMonthChange={(nextMonth) => setParams(nextMonth, null)}
        onSelectDay={(day) => setParams(monthOf(day), day === selectedDay ? null : day)}
        getDayMark={(day) => {
          if (!byDay.has(day)) {
            return null;
          }

          return day < today ? "past-event" : "event";
        }}
        getDayLabel={(day) => (byDay.get(day) ?? []).map((event) => event.title).join(", ")}
        renderDayContent={(day) => {
          const dayEvents = byDay.get(day);

          if (!dayEvents) {
            return null;
          }

          return (
            <span className={styles["chips"]} aria-hidden="true">
              <span className={day < today ? styles["dot-past"] : styles["dot"]} />
              {dayEvents.slice(0, MAX_CHIPS).map((event) => (
                <span key={event.slug} className={day < today ? styles["chip-past"] : styles["chip"]}>
                  {event.title}
                </span>
              ))}
              {dayEvents.length > MAX_CHIPS && (
                <span className={styles["more"]}>ещё {dayEvents.length - MAX_CHIPS}</span>
              )}
            </span>
          );
        }}
      />

      <section className={styles["list"]} aria-labelledby="calendar-list-title" aria-live="polite">
        <div className={styles["list-header"]}>
          <h2 id="calendar-list-title" className={styles["list-title"]}>
            {listTitle}
          </h2>
          <span className={styles["count"]}>
            {listed.length} {plural(listed.length, ["мероприятие", "мероприятия", "мероприятий"])}
          </span>
          {selectedDay && (
            <Button variant="ghost" size="sm" onClick={() => setParams(month, null)}>
              Весь {formatMonthYear(month).split(" ")[0].toLowerCase()}
            </Button>
          )}
        </div>

        {listed.length ? (
          <ul className={styles["events"]}>
            {listed.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} status={getEventStatus(event, today)} showCategory />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles["empty"]}>
            {selectedDay
              ? `${parseDateKey(selectedDay).day}-го ничего не запланировано.`
              : "В этом месяце мероприятий пока нет. Загляните в соседние месяцы или в чат ВКонтакте — анонсы появляются там первыми."}
          </p>
        )}
      </section>
    </div>
  );
}
