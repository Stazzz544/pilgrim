import Image from "next/image";
import Link from "next/link";

import { albumHref } from "@/shared/api/routes";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";

import type { Album } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./album-tile.module.css";

type AlbumTileProps = {
  album: Album;
  className?: string;
};

export function AlbumTile({ album, className }: AlbumTileProps): JSX.Element {
  return (
    <Link href={albumHref(album.slug)} className={cn(styles["tile"], className)}>
      <Image
        src={asset(album.cover.thumbSrc)}
        alt={album.cover.alt}
        fill
        sizes="(max-width: 640px) 50vw, 180px"
        className={styles["image"]}
      />
      <span className={styles["caption"]}>{album.title}</span>
    </Link>
  );
}
