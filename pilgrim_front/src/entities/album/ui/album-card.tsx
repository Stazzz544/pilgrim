import Image from "next/image";
import Link from "next/link";

import { albumHref } from "@/shared/api/routes";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";
import { MONTHS_NOMINATIVE, parseDateKey } from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { Icon } from "@/shared/ui/icon/icon";

import type { Album } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./album-card.module.css";

type AlbumCardProps = {
  album: Album;
  className?: string;
};

export function formatAlbumDate(date: string): string {
  const { year, month } = parseDateKey(date);
  return `${MONTHS_NOMINATIVE[month]} ${year}`;
}

export function AlbumCard({ album, className }: AlbumCardProps): JSX.Element {
  return (
    <article className={cn(styles["card"], className)}>
      <div className={styles["media"]}>
        <Image
          src={asset(album.cover.thumbSrc)}
          alt={album.cover.alt}
          fill
          sizes="(max-width: 640px) 100vw, 380px"
          className={styles["image"]}
        />
        <span className={styles["count"]}>
          <Icon name="image" size={14} />
          {album.photos.length} {plural(album.photos.length, ["фото", "фото", "фото"])}
        </span>
      </div>
      <span className={styles["category"]}>{album.category.name}</span>
      <h2 className={styles["title"]}>
        <Link href={albumHref(album.slug)} className={styles["link"]}>
          {album.title}
        </Link>
      </h2>
      <p className={styles["date"]}>{formatAlbumDate(album.date)}</p>
    </article>
  );
}
