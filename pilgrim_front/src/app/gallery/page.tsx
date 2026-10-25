import { Suspense } from "react";

import { AlbumCard } from "@/entities/album/ui/album-card";
import { getAlbums, getCategories } from "@/shared/api/content";
import { AlbumsBrowser } from "@/widgets/albums-browser/albums-browser";

import type { Metadata } from "next";

import styles from "./gallery.module.css";

export const metadata: Metadata = {
  title: "Фотогалерея",
  description: "Фотоотчёты с походов, поездок и встреч сообщества PILGRIM.",
};

export default async function GalleryPage() {
  const [{ results: albums }, categories] = await Promise.all([getAlbums(), getCategories()]);

  return (
    <div className="container page">
      <h1 className="page-title">Галерея моментов</h1>
      <p className="page-lead">Фотоотчёты с прошедших мероприятий по направлениям нашей активности.</p>
      <div className="page-body">
        <Suspense
          fallback={
            <ul className={styles["fallback"]}>
              {albums.map((album) => (
                <li key={album.slug}>
                  <AlbumCard album={album} />
                </li>
              ))}
            </ul>
          }
        >
          <AlbumsBrowser albums={albums} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
