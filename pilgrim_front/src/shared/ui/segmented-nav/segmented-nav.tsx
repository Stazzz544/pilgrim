import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import type { JSX } from "react";

import styles from "./segmented-nav.module.css";

type SegmentedNavProps = {
  label: string;
  items: Array<{ href: string; label: string }>;
  current: string;
  className?: string;
};

export function SegmentedNav({ label, items, current, className }: SegmentedNavProps): JSX.Element {
  return (
    <nav aria-label={label} className={cn(styles["nav"], className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles["item"]}
          aria-current={item.href === current ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
