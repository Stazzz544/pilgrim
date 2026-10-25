"use client";

import { useSearchParams } from "next/navigation";

import { AlbumCard } from "@/entities/album/ui/album-card";
import { replaceSearchParams } from "@/shared/lib/search-params";
import { Chips } from "@/shared/ui/chips/chips";

import type { Album, Category, CategorySlug } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./albums-browser.module.css";

type AlbumsBrowserProps = {
  albums: Album[];
  categories: Category[];
};

export function AlbumsBrowser({ albums, categories }: AlbumsBrowserProps): JSX.Element {
  const searchParams = useSearchParams();
  const usedCategories = categories.filter((category) =>
    albums.some((album) => album.category.slug === category.slug),
  );
  const categoryParam = searchParams.get("category");
  const selected = usedCategories.find((category) => category.slug === categoryParam)?.slug ?? null;
  const visible = selected ? albums.filter((album) => album.category.slug === selected) : albums;

  const select = (values: CategorySlug[]): void => {
    const next = values.find((value) => value !== selected) ?? null;
    replaceSearchParams(next ? { category: next } : {});
  };

  return (
    <div className={styles["browser"]}>
      <Chips
        label="Направления"
        allLabel="Все альбомы"
        options={usedCategories.map((category) => ({ value: category.slug, label: category.name }))}
        selected={selected ? [selected] : []}
        onChange={select}
      />
      <ul className={styles["grid"]}>
        {visible.map((album) => (
          <li key={album.slug}>
            <AlbumCard album={album} />
          </li>
        ))}
      </ul>
    </div>
  );
}
