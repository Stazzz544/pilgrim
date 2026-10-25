import Image from "next/image";
import Link from "next/link";

import { eventHref } from "@/shared/api/routes";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";
import { DateBadge } from "@/shared/ui/date-badge/date-badge";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { TagList } from "@/shared/ui/tag/tag";

import { EventMeta } from "./event-meta";
import { EventStatusTag } from "./event-status-tag";

import type { Event, EventStatus } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./event-card.module.css";

type EventCardProps = {
  event: Event;
  status?: EventStatus | null;
  showCategory?: boolean;
  layout?: "horizontal" | "vertical";
  headingLevel?: "h2" | "h3";
  priority?: boolean;
  className?: string;
};

export function EventCard({
  event,
  status = null,
  showCategory,
  layout = "horizontal",
  headingLevel: Heading = "h3",
  priority,
  className,
}: EventCardProps): JSX.Element {
  return (
    <article className={cn(styles["card"], styles[layout], className)}>
      <div className={styles["media"]}>
        <Image
          src={asset(event.cover.thumbSrc)}
          alt={event.cover.alt}
          fill
          sizes={layout === "vertical" ? "(max-width: 640px) 100vw, 360px" : "(max-width: 640px) 40vw, 300px"}
          className={styles["image"]}
          priority={priority}
        />
        <DateBadge date={event.startDate} className={styles["badge"]} />
      </div>
      <div className={styles["body"]}>
        {(showCategory || status === "ongoing" || status === "past") && (
          <div className={styles["eyebrow"]}>
            <EventStatusTag status={status} />
            {showCategory && <span className={styles["category"]}>{event.category.name}</span>}
          </div>
        )}
        <Heading className={styles["title"]}>
          <Link href={eventHref(event.slug)} className={styles["link"]}>
            {event.title}
          </Link>
        </Heading>
        <EventMeta event={event} className={styles["meta"]} />
        <TagList tags={event.tags} className={styles["tags"]} />
      </div>
    </article>
  );
}

export function EventCardSkeleton(): JSX.Element {
  return (
    <div className={styles["card"]} aria-hidden="true">
      <Skeleton className={styles["media"]} height="auto" radius="var(--radius-md)" />
      <div className={styles["body"]}>
        <Skeleton width="80%" height={24} />
        <Skeleton width="55%" height={14} />
        <Skeleton width="65%" height={14} />
        <Skeleton width="30%" height={14} />
      </div>
    </div>
  );
}
