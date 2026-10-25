import Link from "next/link";

import { cn } from "@/shared/lib/cn";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, JSX, ReactNode } from "react";

import styles from "./button.module.css";

type ButtonVariant = "primary" | "outline" | "ghost" | "vk";
type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth,
  iconOnly,
  className,
}: Omit<ButtonStyleProps, "children">): string {
  return cn(
    styles["button"],
    styles[variant],
    styles[size],
    fullWidth && styles["full-width"],
    iconOnly && styles["icon-only"],
    className,
  );
}

export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Button({
  variant,
  size,
  fullWidth,
  iconOnly,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, iconOnly, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  iconOnly,
  className,
  href,
  children,
  ...rest
}: ButtonLinkProps): JSX.Element {
  const classNames = buttonClassName({ variant, size, fullWidth, iconOnly, className });

  if (isExternalHref(href)) {
    const opensTab = href.startsWith("http");

    return (
      <a
        href={href}
        className={classNames}
        target={opensTab ? "_blank" : undefined}
        rel={opensTab ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames} {...rest}>
      {children}
    </Link>
  );
}
