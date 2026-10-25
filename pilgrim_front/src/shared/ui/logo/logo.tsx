import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/shared/config/site";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";

import type { JSX } from "react";

import styles from "./logo.module.css";

const MARK = { src: "/images/brand/logo-mark.png", width: 552, height: 205 };
const FULL = { src: "/images/brand/logo-full.png", width: 552, height: 431 };

type LogoProps = {
  size?: "md" | "sm";
  className?: string;
};

export function Logo({ size = "md", className }: LogoProps): JSX.Element {
  return (
    <Link href="/" className={cn(styles["logo"], styles[size], className)} aria-label={`${SITE.name} — на главную`}>
      <Image
        src={asset(MARK.src)}
        alt=""
        width={MARK.width}
        height={MARK.height}
        className={cn(styles["mark"], styles["themed"])}
        priority
      />
      <span className={styles["text"]}>
        <span className={styles["name"]}>{SITE.name}</span>
        <span className={styles["tagline"]}>{SITE.tagline}</span>
      </span>
    </Link>
  );
}

type LogoFullProps = {
  className?: string;
};

export function LogoFull({ className }: LogoFullProps): JSX.Element {
  return (
    <Image
      src={asset(FULL.src)}
      alt={`${SITE.name} — ${SITE.tagline.toLowerCase()}`}
      width={FULL.width}
      height={FULL.height}
      className={cn(styles["full"], styles["themed"], className)}
    />
  );
}
