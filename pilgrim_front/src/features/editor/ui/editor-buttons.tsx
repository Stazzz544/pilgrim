"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { Modal } from "@/shared/ui/modal/modal";

import { editorHref, KIND_META } from "../lib/kinds";
import { deleteItem, saveItem } from "../model/content";
import { canEdit, useSession } from "../model/session";

import type { ContentKind } from "../model/content";
import type { Album, Event, Post } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./editor-buttons.module.css";

type EditorEntryProps = {
  className?: string;
  onNavigate?: () => void;
};

export function EditorEntry({ className, onNavigate }: EditorEntryProps): JSX.Element | null {
  const user = useSession();

  if (!user) {
    return null;
  }

  return (
    <ButtonLink href="/manage" variant="outline" className={className} onClick={onNavigate}>
      <Icon name="pen" size={18} />
      <span className={styles["entry-label"]}>Редактор</span>
    </ButtonLink>
  );
}

type AddButtonProps = {
  kind: ContentKind;
};

export function EditorAddButton({ kind }: AddButtonProps): JSX.Element | null {
  const user = useSession();

  if (!user) {
    return null;
  }

  return (
    <ButtonLink href={editorHref(kind)}>
      <Icon name="plus" size={18} />
      {KIND_META[kind].addLabel}
    </ButtonLink>
  );
}

type ItemToolbarProps =
  | { kind: "events"; item: Event }
  | { kind: "posts"; item: Post }
  | { kind: "albums"; item: Album };

export function ItemToolbar(props: ItemToolbarProps): JSX.Element | null {
  const { kind, item } = props;
  const user = useSession();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!canEdit(user, item)) {
    return null;
  }

  const handleDelete = async (): Promise<void> => {
    await deleteItem(kind, item.slug);
    setIsConfirmOpen(false);
    router.push(KIND_META[kind].listHref);
  };

  return (
    <div className={styles["toolbar"]} role="toolbar" aria-label="Редактирование">
      {item.publication === "draft" && <span className={styles["draft"]}>Черновик — виден только редакторам</span>}
      <ButtonLink href={editorHref(kind, item.slug)} variant="outline" size="sm">
        <Icon name="pen" size={16} />
        Редактировать
      </ButtonLink>
      {props.kind === "events" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => saveItem("events", { ...props.item, isArchived: !props.item.isArchived })}
        >
          <Icon name="archive" size={16} />
          {props.item.isArchived ? "Вернуть из архива" : "В архив"}
        </Button>
      )}
      <Button variant="ghost" size="sm" className={styles["danger"]} onClick={() => setIsConfirmOpen(true)}>
        <Icon name="trash" size={16} />
        Удалить
      </Button>

      <Modal open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title={KIND_META[kind].deleteQuestion}>
        <p className={styles["confirm-text"]}>«{item.title}» исчезнет со всех страниц сайта.</p>
        <div className={styles["confirm-actions"]}>
          <Button className={styles["danger-button"]} onClick={handleDelete}>
            Удалить
          </Button>
          <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
            Отмена
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function DemoNotice(): JSX.Element {
  return (
    <p className={styles["notice"]}>
      <Icon name="star" size={16} />
      Демо-версия: всё, что вы добавите, сохраняется только в этом браузере и не видно другим посетителям.
    </p>
  );
}
