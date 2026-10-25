import { Tag } from "@/shared/ui/tag/tag";

import type { EventStatus } from "@/shared/api/types";
import type { JSX } from "react";

type EventStatusTagProps = {
  status: EventStatus | null;
  className?: string;
};

export function EventStatusTag({ status, className }: EventStatusTagProps): JSX.Element | null {
  if (status === "ongoing") {
    return (
      <Tag tone="success" className={className}>
        Идёт сейчас
      </Tag>
    );
  }

  if (status === "past") {
    return (
      <Tag tone="warning" className={className}>
        Завершено
      </Tag>
    );
  }

  return null;
}
