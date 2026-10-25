import { cn } from "@/shared/lib/cn";
import { formatDateRange } from "@/shared/lib/date";
import { Icon } from "@/shared/ui/icon/icon";

import { DIFFICULTY_LABELS, DIFFICULTY_LEVEL } from "../model/difficulty";

import type { Difficulty, Event } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./event-meta.module.css";

type DifficultyMeterProps = {
  difficulty: Difficulty;
  className?: string;
};

export function DifficultyMeter({ difficulty, className }: DifficultyMeterProps): JSX.Element {
  const level = DIFFICULTY_LEVEL[difficulty];

  return (
    <span className={cn(styles["difficulty"], className)}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        {[0, 1, 2].map((index) => (
          <rect
            key={index}
            x={1 + index * 5}
            y={10 - index * 4}
            width="4"
            height={5 + index * 4}
            rx="1"
            className={index < level ? styles["bar-active"] : styles["bar"]}
          />
        ))}
      </svg>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

type EventMetaProps = {
  event: Pick<Event, "startDate" | "endDate" | "location" | "difficulty">;
  size?: "sm" | "md";
  className?: string;
};

export function EventMeta({ event, size = "md", className }: EventMetaProps): JSX.Element {
  return (
    <ul className={cn(styles["meta"], styles[size], className)}>
      <li>
        <Icon name="calendar" size={16} />
        {formatDateRange(event.startDate, event.endDate)}
      </li>
      <li>
        <Icon name="pin" size={16} />
        {event.location}
      </li>
      <li>
        <DifficultyMeter difficulty={event.difficulty} />
      </li>
    </ul>
  );
}
