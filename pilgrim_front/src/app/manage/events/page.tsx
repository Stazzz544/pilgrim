import { Suspense } from "react";

import { EditorHeading } from "@/features/editor/ui/editor-heading";
import { EventEditor } from "@/features/editor/ui/event-form";
import { EditorGate } from "@/features/editor/ui/login-panel";
import { getCategories } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мероприятие — редактор",
  robots: { index: false },
};

export default async function ManageEventPage() {
  const [{ results: events }, categories] = await Promise.all([getEvents(), getCategories()]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={480} radius="var(--radius-md)" />}>
        <EditorHeading kind="events" />
        <EditorGate>
          <EventEditor baseEvents={events} categories={categories} />
        </EditorGate>
      </Suspense>
    </div>
  );
}
