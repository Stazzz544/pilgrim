import { cn } from "@/shared/lib/cn";
import { MONTHS_SHORT, parseDateKey } from "@/shared/lib/date";

import type { JSX } from "react";

import styles from "./date-badge.module.css";

type DateBadgeProps = {
  date: string;
  size?: "sm" | "md";
  className?: string;
};

export function DateBadge({ date, size = "md", className }: DateBadgeProps): JSX.Element {
  const { day, month } = parseDateKey(date);

  return (
    <span className={cn(styles["badge"], styles[size], className)}>
      <span className={styles["day"]}>{String(day).padStart(2, "0")}</span>
      <span className={styles["month"]}>{MONTHS_SHORT[month]}</span>
    </span>
  );
}
