"use client";

import { PostCard } from "@/entities/post/ui/post-card";
import { useMergedPosts } from "@/features/editor/model/content";
import { PhotoGallery } from "@/shared/ui/photo-gallery/photo-gallery";

import type { Post } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./blog-feed.module.css";

type BlogFeedProps = {
  posts: Post[];
};

export function BlogFeed({ posts: basePosts }: BlogFeedProps): JSX.Element {
  const posts = useMergedPosts(basePosts);

  return (
    <div className={styles["feed"]}>
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          post={post}
          media={post.images.length > 0 && <PhotoGallery photos={post.images} variant="post" />}
        />
      ))}
    </div>
  );
}
