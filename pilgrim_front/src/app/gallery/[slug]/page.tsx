import { notFound } from "next/navigation";

import { getAlbum, getAlbums } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";
import { AlbumDetails } from "@/widgets/album-details/album-details";

import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { results } = await getAlbums();
  return results.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata(props: PageProps<"/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const album = await getAlbum(slug);

  if (!album) {
    return {};
  }

  return {
    title: album.title,
    description: album.description,
    openGraph: {
      title: album.title,
      description: album.description,
      images: [{ url: absoluteUrl(album.cover.src), width: album.cover.width, height: album.cover.height }],
    },
  };
}

export default async function AlbumPage(props: PageProps<"/gallery/[slug]">) {
  const { slug } = await props.params;
  const album = await getAlbum(slug);

  if (!album) {
    notFound();
  }

  const [{ results: albums }, { results: events }] = await Promise.all([getAlbums(), getEvents()]);

  return (
    <div className="container page">
      <AlbumDetails slug={slug} albums={albums} events={events} />
    </div>
  );
}
