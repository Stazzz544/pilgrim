import Link from "next/link";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX, ReactNode } from "react";

import styles from "./section-header.module.css";

type SectionHeaderProps = {
  title: ReactNode;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md";
  id?: string;
  className?: string;
};

export function SectionHeader({
  title,
  href,
  linkLabel,
  as: Heading = "h2",
  size = "lg",
  id,
  className,
}: SectionHeaderProps): JSX.Element {
  return (
    <div className={cn(styles["header"], className)}>
      <Heading id={id} className={cn(styles["title"], styles[size])}>
        {title}
      </Heading>
      {href && linkLabel && <MoreLink href={href}>{linkLabel}</MoreLink>}
    </div>
  );
}

type MoreLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function MoreLink({ href, children, className }: MoreLinkProps): JSX.Element {
  return (
    <Link href={href} className={cn(styles["more"], className)}>
      {children}
      <Icon name="arrow-right" size={14} />
    </Link>
  );
}
