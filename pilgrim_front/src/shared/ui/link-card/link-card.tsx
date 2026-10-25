import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { isExternalHref } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX, ReactNode } from "react";

import styles from "./link-card.module.css";

type LinkCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  text: string;
  className?: string;
};

export function LinkCard({ href, icon, title, text, className }: LinkCardProps): JSX.Element {
  const content = (
    <>
      <span className={styles["icon"]}>{icon}</span>
      <span className={styles["text"]}>
        <span className={styles["title"]}>{title}</span>
        <span className={styles["description"]}>{text}</span>
      </span>
      <Icon name="arrow-right" size={16} className={styles["arrow"]} />
    </>
  );

  if (isExternalHref(href)) {
    return (
      <a href={href} className={cn(styles["card"], className)} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(styles["card"], className)}>
      {content}
    </Link>
  );
}
