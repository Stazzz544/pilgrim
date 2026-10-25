"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX, ReactNode } from "react";

import styles from "./modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  hideTitle?: boolean;
  variant?: "center" | "drawer";
  className?: string;
  children: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  hideTitle,
  variant = "center",
  className,
  children,
}: ModalProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(styles["dialog"], styles[variant], className)}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles["body"]}>
        <div className={styles["header"]}>
          <h2 id={titleId} className={hideTitle ? "visually-hidden" : styles["title"]}>
            {title}
          </h2>
          <button type="button" className={styles["close"]} onClick={onClose} aria-label="Закрыть">
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
