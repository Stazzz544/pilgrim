import Link from "next/link";
import { notFound } from "next/navigation";

import { PostPreviewCard } from "@/entities/post/ui/post-preview-card";
import { getPost, getPosts } from "@/shared/api/content";
import { getEvent } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";
import { formatDate, formatDateRange } from "@/shared/lib/date";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { SectionHeader } from "@/shared/ui/section-header/section-header";
import { TagList } from "@/shared/ui/tag/tag";
import { PhotoGallery } from "@/widgets/photo-gallery/photo-gallery";

import type { Metadata } from "next";

import styles from "./post.module.css";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { results } = await getPosts();
  return results.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  const [cover] = post.images;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: cover ? [{ url: absoluteUrl(cover.src), width: cover.width, height: cover.height }] : undefined,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const [event, { results: posts }] = await Promise.all([
    post.eventSlug ? getEvent(post.eventSlug) : null,
    getPosts(),
  ]);
  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="container page">
      <article className={styles["article"]}>
        <Link href="/blog" className={styles["back"]}>
          <Icon name="arrow-left" size={16} />
          Все записи
        </Link>
        <time dateTime={post.publishedAt} className={styles["date"]}>
          {formatDate(post.publishedAt)}
        </time>
        <h1 className={styles["title"]}>{post.title}</h1>
        <p className={styles["lead"]}>{post.excerpt}</p>
        {post.images.length > 0 && <PhotoGallery photos={post.images} variant="post" />}
        <div className={styles["body"]}>
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <TagList tags={post.tags} />
        {event && (
          <LinkCard
            href={`/events/${event.slug}`}
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
    </div>
  );
}
