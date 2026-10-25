"use client";

import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import { KIND_META } from "../lib/kinds";
import { canEdit, useSession } from "../model/session";

import type { ContentKind } from "../model/content";
import type { DemoUser } from "../model/session";
import type { Authored } from "@/shared/api/types";
import type { JSX, ReactNode } from "react";

import styles from "./editor-form.module.css";

type EditorFrameProps<Item extends Authored & { slug: string }> = {
  kind: ContentKind;
  slug: string | null;
  items: Item[];
  ready: boolean;
  children: (item: Item | null, user: DemoUser) => ReactNode;
};

export function EditorFrame<Item extends Authored & { slug: string }>({
  kind,
  slug,
  items,
  ready,
  children,
}: EditorFrameProps<Item>): JSX.Element {
  const user = useSession();

  if (!user || (slug && !ready)) {
    return <Skeleton height={480} radius="var(--radius-md)" />;
  }

  const item = slug ? (items.find((candidate) => candidate.slug === slug) ?? null) : null;

  if (slug && !item) {
    return (
      <div className={styles["message"]}>
        <Icon name="search" size={28} />
        <p>Запись не найдена — возможно, её уже удалили.</p>
        <ButtonLink href="/manage" variant="outline">
          В редактор
        </ButtonLink>
      </div>
    );
  }

  if (item && !canEdit(user, item)) {
    return (
      <div className={styles["message"]}>
        <Icon name="user" size={28} />
        <p>Активист может редактировать только свои записи. Эту запись правит организатор.</p>
        <ButtonLink href={KIND_META[kind].listHref} variant="outline">
          Назад
        </ButtonLink>
      </div>
    );
  }

  return <>{children(item, user)}</>;
}
