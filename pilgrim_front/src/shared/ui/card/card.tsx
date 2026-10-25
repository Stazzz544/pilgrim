import { cn } from "@/shared/lib/cn";

import type { HTMLAttributes, JSX } from "react";

import styles from "./card.module.css";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article" | "aside";
  padding?: "sm" | "md" | "lg";
};

export function Card({ as: Element = "div", padding = "md", className, ...rest }: CardProps): JSX.Element {
  return <Element className={cn(styles["card"], styles[padding], className)} {...rest} />;
}
