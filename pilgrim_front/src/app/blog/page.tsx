import { EditorAddButton } from "@/features/editor/ui/editor-buttons";
import { getPosts, getVkPosts } from "@/shared/api/content";
import { BlogFeed } from "@/widgets/blog-feed/blog-feed";
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
      <header className="page-header">
        <div>
          <h1 className="page-title">Из походных заметок</h1>
          <p className="page-lead">Короткие истории с маршрутов, советы по снаряжению и впечатления участников.</p>
        </div>
        <EditorAddButton kind="posts" />
      </header>

      <div className={`page-body ${styles["layout"]}`}>
        <BlogFeed posts={posts} />
        <aside className={styles["aside"]}>
          <VkFeed posts={vkPosts} />
        </aside>
      </div>
    </div>
  );
}
