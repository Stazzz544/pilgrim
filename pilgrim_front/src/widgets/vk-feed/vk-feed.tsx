import Image from "next/image";

import { SITE } from "@/shared/config/site";
import { asset } from "@/shared/lib/asset";
import { formatDayMonth } from "@/shared/lib/date";
import { ButtonLink } from "@/shared/ui/button/button";
import { Card } from "@/shared/ui/card/card";
import { Icon } from "@/shared/ui/icon/icon";

import type { VkPost } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./vk-feed.module.css";

type VkFeedProps = {
  posts: VkPost[];
};

export function VkFeed({ posts }: VkFeedProps): JSX.Element {
  return (
    <Card as="section" className={styles["feed"]} aria-labelledby="vk-feed-title">
      <div className={styles["header"]}>
        <span className={styles["badge"]}>
          <Icon name="vk" size={20} />
        </span>
        <h2 id="vk-feed-title" className={styles["title"]}>
          Свежее ВКонтакте
        </h2>
      </div>
      <ul className={styles["list"]}>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.url} target="_blank" rel="noopener noreferrer" className={styles["post"]}>
              <span className={styles["meta"]}>
                {SITE.name} · {formatDayMonth(post.publishedAt)}
              </span>
              <span className={styles["text"]}>{post.text}</span>
              {post.image && (
                <span className={styles["media"]}>
                  <Image src={asset(post.image.thumbSrc)} alt={post.image.alt} fill sizes="300px" className={styles["image"]} />
                </span>
              )}
              <span className={styles["likes"]}>
                <Icon name="heart" size={14} />
                {post.likes}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <ButtonLink href={SITE.vk.community} variant="vk" fullWidth>
        Перейти в сообщество
        <Icon name="external" size={16} />
      </ButtonLink>
    </Card>
  );
}
