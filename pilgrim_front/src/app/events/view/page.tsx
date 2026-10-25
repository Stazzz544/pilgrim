import { Suspense } from "react";

import { getAlbums } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { EventDetailsFromQuery } from "@/widgets/event-details/event-details";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мероприятие",
  robots: { index: false },
};

export default async function EventViewPage() {
  const [{ results: events }, { results: albums }] = await Promise.all([getEvents(), getAlbums()]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={520} radius="var(--radius-lg)" />}>
        <EventDetailsFromQuery events={events} albums={albums} />
      </Suspense>
    </div>
  );
}
