import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/date";
import { MoreLink } from "@/shared/ui/section-header/section-header";
import { TagList } from "@/shared/ui/tag/tag";

import type { Post } from "@/shared/api/types";
import type { JSX, ReactNode } from "react";

import styles from "./post-card.module.css";

type PostCardProps = {
  post: Post;
  media?: ReactNode;
  className?: string;
};

export function PostCard({ post, media, className }: PostCardProps): JSX.Element {
  const [lead, ...rest] = post.body;

  return (
    <article className={cn(styles["card"], className)} id={post.slug}>
      <header className={styles["header"]}>
        <time dateTime={post.publishedAt} className={styles["date"]}>
          {formatDate(post.publishedAt)}
        </time>
        <h2 className={styles["title"]}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
      </header>
      <p className={styles["text"]}>{lead}</p>
      {media}
      <footer className={styles["footer"]}>
        <TagList tags={post.tags} />
        {rest.length > 0 && <MoreLink href={`/blog/${post.slug}`}>Читать полностью</MoreLink>}
      </footer>
    </article>
  );
}
