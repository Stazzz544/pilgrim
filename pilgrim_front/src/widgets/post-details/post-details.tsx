"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { PostPreviewCard } from "@/entities/post/ui/post-preview-card";
import { useDemoContent, useMergedEvents, useMergedPosts } from "@/features/editor/model/content";
import { useSession } from "@/features/editor/model/session";
import { ItemToolbar } from "@/features/editor/ui/editor-buttons";
import { eventHref } from "@/shared/api/routes";
import { formatDate, formatDateRange } from "@/shared/lib/date";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { PhotoGallery } from "@/shared/ui/photo-gallery/photo-gallery";
import { SectionHeader } from "@/shared/ui/section-header/section-header";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { TagList } from "@/shared/ui/tag/tag";

import type { Event, Post } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./post-details.module.css";

type PostDetailsProps = {
  slug: string;
  posts: Post[];
  events: Event[];
};

export function PostDetails({ slug, posts, events }: PostDetailsProps): JSX.Element {
  const user = useSession();
  const { ready } = useDemoContent();
  const mergedPosts = useMergedPosts(posts, Boolean(user));
  const mergedEvents = useMergedEvents(events);
  const post = mergedPosts.find((item) => item.slug === slug);

  if (!post) {
    if (!ready && !posts.some((item) => item.slug === slug)) {
      return <Skeleton height={520} radius="var(--radius-lg)" />;
    }

    return (
      <div className={styles["missing"]}>
        <p className={styles["missing-title"]}>Запись не найдена</p>
        <p>Возможно, её удалили.</p>
        <ButtonLink href="/blog">Все записи</ButtonLink>
      </div>
    );
  }

  const event = post.eventSlug ? mergedEvents.find((item) => item.slug === post.eventSlug) : undefined;
  const isLeadRepeated = post.body[0]?.startsWith(post.excerpt.replace(/…$/, "")) ?? false;
  const others = mergedPosts.filter((item) => item.slug !== post.slug && item.publication !== "draft").slice(0, 3);

  return (
    <>
      <article className={styles["article"]}>
        <Link href="/blog" className={styles["back"]}>
          <Icon name="arrow-left" size={16} />
          Все записи
        </Link>
        <ItemToolbar kind="posts" item={post} />
        <time dateTime={post.publishedAt} className={styles["date"]}>
          {formatDate(post.publishedAt)}
        </time>
        <h1 className={styles["title"]}>{post.title}</h1>
        {!isLeadRepeated && <p className={styles["lead"]}>{post.excerpt}</p>}
        {post.images.length > 0 && <PhotoGallery photos={post.images} variant="post" />}
        <div className={styles["body"]}>
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <TagList tags={post.tags} />
        {event && (
          <LinkCard
            href={eventHref(event.slug)}
            icon={<Icon name="calendar" size={26} />}
            title={event.title}
            text={`Мероприятие · ${formatDateRange(event.startDate, event.endDate)}`}
          />
        )}
      </article>

      {others.length > 0 && (
        <section aria-labelledby="more-posts" className={styles["more"]}>
          <SectionHeader id="more-posts" title="Другие записи" href="/blog" linkLabel="Все записи" />
          <div className={styles["grid"]}>
            {others.map((item) => (
              <PostPreviewCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

type PostDetailsFromQueryProps = Omit<PostDetailsProps, "slug">;

export function PostDetailsFromQuery(props: PostDetailsFromQueryProps): JSX.Element {
  const slug = useSearchParams().get("slug") ?? "";
  return <PostDetails slug={slug} {...props} />;
}
