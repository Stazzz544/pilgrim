import { getAlbums, getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/events/", "/events/archive/", "/calendar/", "/blog/", "/gallery/", "/donate/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ results: events }, { results: posts }, { results: albums }] = await Promise.all([
    getEvents(),
    getPosts(),
    getAlbums(),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...events.map((event) => ({ url: absoluteUrl(`/events/${event.slug}/`) })),
    ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}/`), lastModified: post.publishedAt })),
    ...albums.map((album) => ({ url: absoluteUrl(`/gallery/${album.slug}/`) })),
  ];
}
