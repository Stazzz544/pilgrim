import Link from "next/link";

import { SITE } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";

import type { JSX } from "react";

import styles from "./logo.module.css";

type LogoProps = {
  size?: "md" | "sm";
  className?: string;
};

export function LogoMark({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={cn(styles["mark"], className)} viewBox="0 0 96 44" aria-hidden="true" focusable="false">
      <path className={styles["mountains"]} d="M0 42 20 17l6 7 16-20 13 16 6-6 23 28Z" />
      <path className={styles["snow"]} d="m42 4-6.4 8 3.4-1.3 2.6 2.6 2.8-2.8 4 1.4Z" />
      <path className={styles["snow"]} d="m20 17-4.4 5.5 2.4-.8 1.9 1.7 1.8-1.6 2 .6Z" />
      <path className={styles["snow"]} d="m61 14-3.6 4.4 1.9-.6 1.6 1.4 1.5-1.2 2.1.6Z" />
    </svg>
  );
}

export function Logo({ size = "md", className }: LogoProps): JSX.Element {
  return (
    <Link href="/" className={cn(styles["logo"], styles[size], className)} aria-label={`${SITE.name} — на главную`}>
      <LogoMark />
      <span className={styles["text"]}>
        <span className={styles["name"]}>{SITE.name}</span>
        <span className={styles["tagline"]}>{SITE.tagline}</span>
      </span>
    </Link>
  );
}
