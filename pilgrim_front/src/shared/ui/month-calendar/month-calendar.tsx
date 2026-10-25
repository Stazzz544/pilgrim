"use client";

import { cn } from "@/shared/lib/cn";
import { formatDate, formatMonthYear, getMonthGrid, parseDateKey, shiftMonth, WEEKDAYS_SHORT } from "@/shared/lib/date";
import { Icon } from "@/shared/ui/icon/icon";

import type { MonthRef } from "@/shared/lib/date";
import type { JSX, ReactNode } from "react";

import styles from "./month-calendar.module.css";

export type DayMark = "event" | "past-event" | null;

type MonthCalendarProps = {
  month: MonthRef;
  today: string | null;
  onMonthChange: (month: MonthRef) => void;
  getDayMark?: (day: string) => DayMark;
  getDayLabel?: (day: string) => string;
  renderDayContent?: (day: string) => ReactNode;
  selectedDay?: string | null;
  onSelectDay?: (day: string) => void;
  size?: "compact" | "full";
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function MonthCalendar({
  month,
  today,
  onMonthChange,
  getDayMark,
  getDayLabel,
  renderDayContent,
  selectedDay,
  onSelectDay,
  size = "compact",
  headingLevel: Heading = "h2",
  className,
}: MonthCalendarProps): JSX.Element {
  const weeks = getMonthGrid(month);

  return (
    <div className={cn(styles["calendar"], styles[size], className)}>
      <div className={styles["header"]}>
        <button
          type="button"
          className={styles["nav"]}
          onClick={() => onMonthChange(shiftMonth(month, -1))}
          aria-label="Предыдущий месяц"
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <Heading className={styles["title"]} aria-live="polite">
          {formatMonthYear(month)}
        </Heading>
        <button
          type="button"
          className={styles["nav"]}
          onClick={() => onMonthChange(shiftMonth(month, 1))}
          aria-label="Следующий месяц"
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>

      <table className={styles["grid"]}>
        <thead>
          <tr>
            {WEEKDAYS_SHORT.map((weekday) => (
              <th key={weekday} scope="col" className={styles["weekday"]}>
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)}>
              {week.map((day, index) => {
                if (!day) {
                  return <td key={`empty-${index}`} className={styles["cell"]} />;
                }

                const mark = getDayMark?.(day) ?? null;
                const dayClassName = cn(
                  styles["day"],
                  mark === "event" && styles["has-event"],
                  mark === "past-event" && styles["has-past-event"],
                  day === today && styles["today"],
                  day === selectedDay && styles["selected"],
                );
                const number = <span className={styles["number"]}>{parseDateKey(day).day}</span>;
                const content = renderDayContent?.(day);

                return (
                  <td key={day} className={styles["cell"]}>
                    {mark && onSelectDay ? (
                      <button
                        type="button"
                        className={dayClassName}
                        aria-pressed={day === selectedDay}
                        aria-label={`${formatDate(day)}${getDayLabel ? `: ${getDayLabel(day)}` : ""}`}
                        aria-current={day === today ? "date" : undefined}
                        onClick={() => onSelectDay(day)}
                      >
                        {number}
                        {content}
                      </button>
                    ) : (
                      <span className={dayClassName} aria-current={day === today ? "date" : undefined}>
                        {number}
                        {content}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
