import { Suspense } from "react";

import { EditorAddButton } from "@/features/editor/ui/editor-buttons";
import { getCategories } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { SegmentedNav } from "@/shared/ui/segmented-nav/segmented-nav";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { EventsCatalog } from "@/widgets/events-catalog/events-catalog";

import type { EventsScope } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./events.module.css";

const TABS = [
  { href: "/events", label: "Предстоящие" },
  { href: "/events/archive", label: "Архив" },
];

type EventsPageProps = {
  scope: EventsScope;
  title: string;
  lead: string;
};

export async function EventsPage({ scope, title, lead }: EventsPageProps): Promise<JSX.Element> {
  const [{ results: events }, categories] = await Promise.all([getEvents(), getCategories()]);

  return (
    <div className="container page">
      <header className={styles["header"]}>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-lead">{lead}</p>
        </div>
        <div className={styles["tools"]}>
          <EditorAddButton kind="events" />
          <SegmentedNav
            label="Мероприятия"
            items={TABS}
            current={scope === "archive" ? "/events/archive" : "/events"}
          />
        </div>
      </header>
      <Suspense fallback={<Skeleton height={560} radius="var(--radius-md)" />}>
        <EventsCatalog events={events} categories={categories} scope={scope} />
      </Suspense>
    </div>
  );
}
