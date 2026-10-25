import { Suspense } from "react";

import { EditorHeading } from "@/features/editor/ui/editor-heading";
import { EditorGate } from "@/features/editor/ui/login-panel";
import { PostEditor } from "@/features/editor/ui/post-form";
import { getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пост — редактор",
  robots: { index: false },
};

export default async function ManagePostPage() {
  const [{ results: posts }, { results: events }] = await Promise.all([getPosts(), getEvents()]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={480} radius="var(--radius-md)" />}>
        <EditorHeading kind="posts" />
        <EditorGate>
          <PostEditor basePosts={posts} baseEvents={events} />
        </EditorGate>
      </Suspense>
    </div>
  );
}
