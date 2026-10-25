import { Suspense } from "react";

import { AlbumEditor } from "@/features/editor/ui/album-form";
import { EditorHeading } from "@/features/editor/ui/editor-heading";
import { EditorGate } from "@/features/editor/ui/login-panel";
import { getAlbums, getCategories } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Альбом — редактор",
  robots: { index: false },
};

export default async function ManageAlbumPage() {
  const [{ results: albums }, { results: events }, categories] = await Promise.all([
    getAlbums(),
    getEvents(),
    getCategories(),
  ]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={480} radius="var(--radius-md)" />}>
        <EditorHeading kind="albums" />
        <EditorGate>
          <AlbumEditor baseAlbums={albums} baseEvents={events} categories={categories} />
        </EditorGate>
      </Suspense>
    </div>
  );
}
