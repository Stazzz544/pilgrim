import { cn } from "@/shared/lib/cn";

import type { JSX, ReactNode } from "react";

import styles from "./tag.module.css";

type TagProps = {
  tone?: "neutral" | "primary" | "success" | "warning";
  className?: string;
  children: ReactNode;
};

export function Tag({ tone = "neutral", className, children }: TagProps): JSX.Element {
  return <span className={cn(styles["tag"], styles[tone], className)}>{children}</span>;
}

type TagListProps = {
  tags: readonly string[];
  className?: string;
};

export function TagList({ tags, className }: TagListProps): JSX.Element {
  return (
    <ul className={cn(styles["list"], className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
