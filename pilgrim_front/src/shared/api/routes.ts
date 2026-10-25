import { ALBUMS } from "@/mocks/albums";
import { EVENTS } from "@/mocks/events";
import { POSTS } from "@/mocks/posts";

// Статический экспорт знает только адреса из моков; записи, созданные в демо-редакторе, открываются через ?slug=.
const BUILT = {
  events: new Set(EVENTS.map((event) => event.slug)),
  posts: new Set(POSTS.map((post) => post.slug)),
  albums: new Set(ALBUMS.map((album) => album.slug)),
};

function href(section: string, built: Set<string>, slug: string): string {
  return built.has(slug) ? `/${section}/${slug}` : `/${section}/view?slug=${encodeURIComponent(slug)}`;
}

export function eventHref(slug: string): string {
  return href("events", BUILT.events, slug);
}

export function postHref(slug: string): string {
  return href("blog", BUILT.posts, slug);
}

export function albumHref(slug: string): string {
  return href("gallery", BUILT.albums, slug);
}
