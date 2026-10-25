"use client";

import { AlbumTile } from "@/entities/album/ui/album-tile";
import { PostPreviewCard } from "@/entities/post/ui/post-preview-card";
import { useMergedAlbums, useMergedPosts } from "@/features/editor/model/content";

import type { Album, Post } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./home-previews.module.css";

const NOTES_LIMIT = 3;
const TILES_LIMIT = 4;

type NotesPreviewProps = {
  posts: Post[];
};

export function NotesPreview({ posts: basePosts }: NotesPreviewProps): JSX.Element {
  const posts = useMergedPosts(basePosts).slice(0, NOTES_LIMIT);

  return (
    <div className={styles["notes"]}>
      {posts.map((post) => (
        <PostPreviewCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

type GalleryPreviewProps = {
  albums: Album[];
  featured: string[];
};

export function GalleryPreview({ albums: baseAlbums, featured }: GalleryPreviewProps): JSX.Element {
  const albums = useMergedAlbums(baseAlbums);
  const baseSlugs = new Set(baseAlbums.map((album) => album.slug));
  const fresh = albums.filter((album) => !baseSlugs.has(album.slug));
  const picked = featured.flatMap((slug) => albums.filter((album) => album.slug === slug));
  const tiles = [...fresh, ...picked].slice(0, TILES_LIMIT);

  return (
    <div className={styles["gallery"]}>
      {tiles.map((album) => (
        <AlbumTile key={album.slug} album={album} />
      ))}
    </div>
  );
}
