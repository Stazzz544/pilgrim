import { EditorGate } from "@/features/editor/ui/login-panel";
import { getAlbums, getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { EditorDashboard } from "@/widgets/editor-dashboard/editor-dashboard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактор",
  robots: { index: false },
};

export default async function ManagePage() {
  const [{ results: events }, { results: posts }, { results: albums }] = await Promise.all([
    getEvents(),
    getPosts(),
    getAlbums(),
  ]);

  return (
    <div className="container page">
      <EditorGate>
        <EditorDashboard events={events} posts={posts} albums={albums} />
      </EditorGate>
    </div>
  );
}
