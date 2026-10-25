import { notFound } from "next/navigation";

import { getPost, getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";
import { PostDetails } from "@/widgets/post-details/post-details";

import type { Metadata } from "next";

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

  const [{ results: posts }, { results: events }] = await Promise.all([getPosts(), getEvents()]);

  return (
    <div className="container page">
      <PostDetails slug={slug} posts={posts} events={events} />
    </div>
  );
}
