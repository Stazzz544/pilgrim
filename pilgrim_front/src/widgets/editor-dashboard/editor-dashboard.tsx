"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { editorHref, KIND_META } from "@/features/editor/lib/kinds";
import {
  deleteItem,
  isLocallyChanged,
  resetDemoContent,
  useMergedAlbums,
  useMergedEvents,
  useMergedPosts,
} from "@/features/editor/model/content";
import { canEdit, logout, useSession } from "@/features/editor/model/session";
import { DemoNotice } from "@/features/editor/ui/editor-buttons";
import { albumHref, eventHref, postHref } from "@/shared/api/routes";
import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";
import { formatDate, formatDateRange } from "@/shared/lib/date";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { Modal } from "@/shared/ui/modal/modal";
import { Tag } from "@/shared/ui/tag/tag";

import type { ContentKind } from "@/features/editor/model/content";
import type { Album, Event, Photo, Post, Publication } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./editor-dashboard.module.css";

type Row = {
  kind: ContentKind;
  slug: string;
  title: string;
  meta: string;
  href: string;
  photo: Photo | null;
  publication?: Publication;
  isArchived?: boolean;
  isNew: boolean;
  isChanged: boolean;
};

type EditorDashboardProps = {
  events: Event[];
  posts: Post[];
  albums: Album[];
};

const KINDS: ContentKind[] = ["events", "posts", "albums"];

export function EditorDashboard({ events, posts, albums }: EditorDashboardProps): JSX.Element | null {
  const user = useSession();
  const [activeKind, setActiveKind] = useState<ContentKind>("events");
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const mergedEvents = useMergedEvents(events, true);
  const mergedPosts = useMergedPosts(posts, true);
  const mergedAlbums = useMergedAlbums(albums, true);

  if (!user) {
    return null;
  }

  const baseSlugs: Record<ContentKind, Set<string>> = {
    events: new Set(events.map((item) => item.slug)),
    posts: new Set(posts.map((item) => item.slug)),
    albums: new Set(albums.map((item) => item.slug)),
  };

  const status = (kind: ContentKind, slug: string): Pick<Row, "isNew" | "isChanged"> => ({
    isNew: !baseSlugs[kind].has(slug),
    isChanged: baseSlugs[kind].has(slug) && isLocallyChanged(kind, slug),
  });

  const rows: Record<ContentKind, Row[]> = {
    events: [...mergedEvents]
      .sort((first, second) => second.startDate.localeCompare(first.startDate))
      .filter((item) => canEdit(user, item))
      .map((item) => ({
        kind: "events",
        slug: item.slug,
        title: item.title,
        meta: formatDateRange(item.startDate, item.endDate),
        href: eventHref(item.slug),
        photo: item.cover,
        publication: item.publication,
        isArchived: item.isArchived,
        ...status("events", item.slug),
      })),
    posts: mergedPosts
      .filter((item) => canEdit(user, item))
      .map((item) => ({
        kind: "posts",
        slug: item.slug,
        title: item.title,
        meta: formatDate(item.publishedAt),
        href: postHref(item.slug),
        photo: item.images[0] ?? null,
        publication: item.publication,
        ...status("posts", item.slug),
      })),
    albums: mergedAlbums
      .filter((item) => canEdit(user, item))
      .map((item) => ({
        kind: "albums",
        slug: item.slug,
        title: item.title,
        meta: `${formatDate(item.date)} · ${item.photos.length} фото`,
        href: albumHref(item.slug),
        photo: item.cover,
        publication: item.publication,
        ...status("albums", item.slug),
      })),
  };

  const visibleRows = rows[activeKind];

  return (
    <div className={styles["dashboard"]}>
      <header className={styles["header"]}>
        <div>
          <p className={styles["role"]}>{user.roleLabel}</p>
          <h1 className="page-title">Здравствуйте, {user.name.split(" ")[0]}!</h1>
          <p className="page-lead">
            {user.role === "organizer"
              ? "Вы можете добавлять и править все мероприятия, посты и альбомы."
              : "Здесь ваши мероприятия, посты и альбомы. Записи других кураторов правит организатор."}
          </p>
        </div>
        <Button variant="ghost" onClick={logout}>
          <Icon name="logout" size={18} />
          Выйти
        </Button>
      </header>

      <DemoNotice />

      <div className={styles["create"]}>
        {KINDS.map((kind) => (
          <ButtonLink key={kind} href={editorHref(kind)} variant={kind === "posts" ? "primary" : "outline"}>
            <Icon name="plus" size={18} />
            {KIND_META[kind].addLabel}
          </ButtonLink>
        ))}
      </div>

      <section className={styles["list-section"]} aria-label="Записи">
        <div className={styles["tabs"]} role="tablist" aria-label="Тип записей">
          {KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={activeKind === kind}
              className={styles["tab"]}
              onClick={() => setActiveKind(kind)}
            >
              {KIND_META[kind].plural}
              <span className={styles["count"]}>{rows[kind].length}</span>
            </button>
          ))}
        </div>

        {visibleRows.length ? (
          <ul className={styles["rows"]} role="tabpanel">
            {visibleRows.map((row) => (
              <li key={row.slug} className={styles["row"]}>
                <span className={styles["thumb"]}>
                  {row.photo && (
                    <Image
                      src={asset(row.photo.thumbSrc)}
                      alt=""
                      fill
                      sizes="96px"
                      className={styles["thumb-image"]}
                    />
                  )}
                </span>
                <span className={styles["text"]}>
                  <Link href={row.href} className={styles["title"]}>
                    {row.title}
                  </Link>
                  <span className={styles["meta"]}>
                    {row.meta}
                    {row.publication === "draft" && <Tag tone="warning">Черновик</Tag>}
                    {row.isArchived && <Tag>В архиве</Tag>}
                    {row.isNew && <Tag tone="success">Новое</Tag>}
                    {row.isChanged && <Tag tone="primary">Изменено</Tag>}
                  </span>
                </span>
                <span className={styles["actions"]}>
                  <ButtonLink href={editorHref(row.kind, row.slug)} variant="outline" size="sm" aria-label={`Редактировать «${row.title}»`}>
                    <Icon name="pen" size={16} />
                    <span className={styles["action-label"]}>Изменить</span>
                  </ButtonLink>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles["danger"]}
                    aria-label={`Удалить «${row.title}»`}
                    onClick={() => setToDelete(row)}
                  >
                    <Icon name="trash" size={16} />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles["empty"]}>Пока пусто — добавьте первую запись кнопкой выше.</p>
        )}
      </section>

      <div className={styles["reset"]}>
        <Button variant="ghost" size="sm" onClick={() => setIsResetOpen(true)}>
          Сбросить демо-данные
        </Button>
      </div>

      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title={toDelete ? KIND_META[toDelete.kind].deleteQuestion : ""}
      >
        <p className={styles["confirm-text"]}>«{toDelete?.title}» исчезнет со всех страниц сайта.</p>
        <div className={styles["confirm-actions"]}>
          <Button
            className={cn(styles["danger-button"])}
            onClick={async () => {
              if (toDelete) {
                await deleteItem(toDelete.kind, toDelete.slug);
              }

              setToDelete(null);
            }}
          >
            Удалить
          </Button>
          <Button variant="outline" onClick={() => setToDelete(null)}>
            Отмена
          </Button>
        </div>
      </Modal>

      <Modal open={isResetOpen} onClose={() => setIsResetOpen(false)} title="Сбросить демо-данные?">
        <p className={styles["confirm-text"]}>
          Все добавленные и изменённые записи в этом браузере удалятся, сайт вернётся к исходным демо-данным.
        </p>
        <div className={styles["confirm-actions"]}>
          <Button
            className={styles["danger-button"]}
            onClick={async () => {
              await resetDemoContent();
              setIsResetOpen(false);
            }}
          >
            Сбросить
          </Button>
          <Button variant="outline" onClick={() => setIsResetOpen(false)}>
            Отмена
          </Button>
        </div>
      </Modal>
    </div>
  );
}
