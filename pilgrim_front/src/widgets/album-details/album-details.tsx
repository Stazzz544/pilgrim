"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { AlbumCard, formatAlbumDate } from "@/entities/album/ui/album-card";
import { useDemoContent, useMergedAlbums, useMergedEvents } from "@/features/editor/model/content";
import { useSession } from "@/features/editor/model/session";
import { ItemToolbar } from "@/features/editor/ui/editor-buttons";
import { eventHref } from "@/shared/api/routes";
import { formatDateRange } from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { PhotoGallery } from "@/shared/ui/photo-gallery/photo-gallery";
import { SectionHeader } from "@/shared/ui/section-header/section-header";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import type { Album, Event } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./album-details.module.css";

type AlbumDetailsProps = {
  slug: string;
  albums: Album[];
  events: Event[];
};

export function AlbumDetails({ slug, albums, events }: AlbumDetailsProps): JSX.Element {
  const user = useSession();
  const { ready } = useDemoContent();
  const mergedAlbums = useMergedAlbums(albums, Boolean(user));
  const mergedEvents = useMergedEvents(events);
  const album = mergedAlbums.find((item) => item.slug === slug);

  if (!album) {
    if (!ready && !albums.some((item) => item.slug === slug)) {
      return <Skeleton height={520} radius="var(--radius-lg)" />;
    }

    return (
      <div className={styles["missing"]}>
        <p className={styles["missing-title"]}>Альбом не найден</p>
        <p>Возможно, его удалили.</p>
        <ButtonLink href="/gallery">Вся галерея</ButtonLink>
      </div>
    );
  }

  const event = album.eventSlug ? mergedEvents.find((item) => item.slug === album.eventSlug) : undefined;
  const others = mergedAlbums.filter((item) => item.slug !== album.slug && item.publication !== "draft").slice(0, 3);

  return (
    <>
      <Link href="/gallery" className={styles["back"]}>
        <Icon name="arrow-left" size={16} />
        Все альбомы
      </Link>

      <ItemToolbar kind="albums" item={album} />

      <header className={styles["header"]}>
        <div>
          <p className={styles["meta"]}>
            {album.category.name} · {formatAlbumDate(album.date)} · {album.photos.length}{" "}
            {plural(album.photos.length, ["фото", "фото", "фото"])}
          </p>
          <h1 className="page-title">{album.title}</h1>
          {album.description && <p className="page-lead">{album.description}</p>}
        </div>
        {event && (
          <LinkCard
            href={eventHref(event.slug)}
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
    </>
  );
}

type AlbumDetailsFromQueryProps = Omit<AlbumDetailsProps, "slug">;

export function AlbumDetailsFromQuery(props: AlbumDetailsFromQueryProps): JSX.Element {
  const slug = useSearchParams().get("slug") ?? "";
  return <AlbumDetails slug={slug} {...props} />;
}
