import Link from "next/link";
import { notFound } from "next/navigation";

import { AlbumCard, formatAlbumDate } from "@/entities/album/ui/album-card";
import { getAlbum, getAlbums } from "@/shared/api/content";
import { getEvent } from "@/shared/api/events";
import { absoluteUrl } from "@/shared/config/site";
import { formatDateRange } from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { SectionHeader } from "@/shared/ui/section-header/section-header";
import { PhotoGallery } from "@/widgets/photo-gallery/photo-gallery";

import type { Metadata } from "next";

import styles from "./album.module.css";

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

  const [event, { results: albums }] = await Promise.all([
    album.eventSlug ? getEvent(album.eventSlug) : null,
    getAlbums(),
  ]);
  const others = albums.filter((item) => item.slug !== album.slug).slice(0, 3);

  return (
    <div className="container page">
      <Link href="/gallery" className={styles["back"]}>
        <Icon name="arrow-left" size={16} />
        Все альбомы
      </Link>

      <header className={styles["header"]}>
        <div>
          <p className={styles["meta"]}>
            {album.category.name} · {formatAlbumDate(album.date)} · {album.photos.length}{" "}
            {plural(album.photos.length, ["фото", "фото", "фото"])}
          </p>
          <h1 className="page-title">{album.title}</h1>
          <p className="page-lead">{album.description}</p>
        </div>
        {event && (
          <LinkCard
            href={`/events/${event.slug}`}
            icon={<Icon name="calendar" size={26} />}
            title="О мероприятии"
            text={`${event.title} · ${formatDateRange(event.startDate, event.endDate)}`}
            className={styles["event"]}
          />
        )}
      </header>

      <PhotoGallery photos={album.photos} />

      {others.length > 0 && (
        <section aria-labelledby="more-albums" className={styles["more"]}>
          <SectionHeader id="more-albums" title="Другие альбомы" href="/gallery" linkLabel="Вся галерея" />
          <ul className={styles["grid"]}>
            {others.map((item) => (
              <li key={item.slug}>
                <AlbumCard album={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
