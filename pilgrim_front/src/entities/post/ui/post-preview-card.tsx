import Image from "next/image";
import Link from "next/link";

import { postHref } from "@/shared/api/routes";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";
import { formatDayMonth, parseDateKey } from "@/shared/lib/date";

import type { Post } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./post-preview-card.module.css";

type PostPreviewCardProps = {
  post: Post;
  className?: string;
};

export function PostPreviewCard({ post, className }: PostPreviewCardProps): JSX.Element {
  const [cover] = post.images;

  return (
    <article className={cn(styles["card"], className)}>
      {cover && (
        <div className={styles["media"]}>
          <Image
            src={asset(cover.thumbSrc)}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className={styles["image"]}
          />
        </div>
      )}
      <time dateTime={post.publishedAt} className={styles["date"]}>
        {formatDayMonth(post.publishedAt)} {parseDateKey(post.publishedAt).year}
      </time>
      <h3 className={styles["title"]}>
        <Link href={postHref(post.slug)} className={styles["link"]}>
          {post.title}
        </Link>
      </h3>
      <p className={styles["excerpt"]}>{post.excerpt}</p>
    </article>
  );
}
