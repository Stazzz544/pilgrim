import { PostCard } from "@/entities/post/ui/post-card";
import { getPosts, getVkPosts } from "@/shared/api/content";
import { PhotoGallery } from "@/widgets/photo-gallery/photo-gallery";
import { VkFeed } from "@/widgets/vk-feed/vk-feed";

import type { Metadata } from "next";

import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Микроблог",
  description: "Заметки из походов, советы по снаряжению и истории участников сообщества PILGRIM.",
};

export default async function BlogPage() {
  const [{ results: posts }, vkPosts] = await Promise.all([getPosts(), getVkPosts()]);

  return (
    <div className="container page">
      <h1 className="page-title">Из походных заметок</h1>
      <p className="page-lead">Короткие истории с маршрутов, советы по снаряжению и впечатления участников.</p>

      <div className={`page-body ${styles["layout"]}`}>
        <div className={styles["feed"]}>
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              media={post.images.length > 0 && <PhotoGallery photos={post.images} variant="post" />}
            />
          ))}
        </div>
        <aside className={styles["aside"]}>
          <VkFeed posts={vkPosts} />
        </aside>
      </div>
    </div>
  );
}
