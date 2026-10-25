import { Suspense } from "react";

import { getAlbums } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { AlbumDetailsFromQuery } from "@/widgets/album-details/album-details";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Альбом",
  robots: { index: false },
};

export default async function AlbumViewPage() {
  const [{ results: albums }, { results: events }] = await Promise.all([getAlbums(), getEvents()]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={520} radius="var(--radius-lg)" />}>
        <AlbumDetailsFromQuery albums={albums} events={events} />
      </Suspense>
    </div>
  );
}
