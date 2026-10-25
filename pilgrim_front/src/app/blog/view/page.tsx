import { Suspense } from "react";

import { getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { PostDetailsFromQuery } from "@/widgets/post-details/post-details";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Запись",
  robots: { index: false },
};

export default async function PostViewPage() {
  const [{ results: posts }, { results: events }] = await Promise.all([getPosts(), getEvents()]);

  return (
    <div className="container page">
      <Suspense fallback={<Skeleton height={520} radius="var(--radius-lg)" />}>
        <PostDetailsFromQuery posts={posts} events={events} />
      </Suspense>
    </div>
  );
}
