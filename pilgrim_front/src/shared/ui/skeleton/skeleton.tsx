import { cn } from "@/shared/lib/cn";

import type { CSSProperties, JSX } from "react";

import styles from "./skeleton.module.css";

type SkeletonProps = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
};

export function Skeleton({ width = "100%", height = 16, radius, className }: SkeletonProps): JSX.Element {
  return (
    <span
      className={cn(styles["skeleton"], className)}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
