"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { asset } from "@/shared/lib/asset";
import { Icon } from "@/shared/ui/icon/icon";

import type { Photo } from "@/shared/api/types";
import type { JSX, KeyboardEvent, PointerEvent } from "react";

import styles from "./lightbox.module.css";

const SWIPE_THRESHOLD = 50;

type LightboxProps = {
  photos: Photo[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

export function Lightbox({ photos, index, onIndexChange }: LightboxProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStartRef = useRef<number | null>(null);
  const isOpen = index !== null;
  const photo = isOpen ? photos[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const show = (delta: number): void => {
    if (index !== null) {
      onIndexChange((index + delta + photos.length) % photos.length);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>): void => {
    if (event.key === "ArrowRight") {
      show(1);
    }

    if (event.key === "ArrowLeft") {
      show(-1);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (start === null) {
      return;
    }

    const distance = event.clientX - start;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      show(distance < 0 ? 1 : -1);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles["lightbox"]}
      aria-label="Просмотр фотографий"
      onClose={() => onIndexChange(null)}
      onKeyDown={handleKeyDown}
    >
      {photo && index !== null && (
        <>
          <div className={styles["toolbar"]}>
            <span className={styles["counter"]} aria-live="polite">
              {index + 1} / {photos.length}
            </span>
            <button type="button" className={styles["control"]} onClick={() => onIndexChange(null)} aria-label="Закрыть">
              <Icon name="close" size={24} />
            </button>
          </div>

          <div
            className={styles["stage"]}
            onPointerDown={(event) => {
              swipeStartRef.current = event.clientX;
            }}
            onPointerUp={handlePointerUp}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                onIndexChange(null);
              }
            }}
          >
            {photos.length > 1 && (
              <button
                type="button"
                className={`${styles["control"]} ${styles["prev"]}`}
                onClick={() => show(-1)}
                aria-label="Предыдущее фото"
              >
                <Icon name="chevron-left" size={28} />
              </button>
            )}
            <figure className={styles["figure"]}>
              <Image
                key={photo.id}
                src={asset(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className={styles["image"]}
                draggable={false}
                priority
              />
              <figcaption className={styles["caption"]}>
                <span>{photo.alt}</span>
                {photo.credit.sourceUrl ? (
                  <a
                    href={photo.credit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["credit"]}
                  >
                    Фото: {photo.credit.author}, {photo.credit.license}
                  </a>
                ) : (
                  <span className={styles["credit"]}>
                    Фото: {photo.credit.author}, {photo.credit.license}
                  </span>
                )}
              </figcaption>
            </figure>
            {photos.length > 1 && (
              <button
                type="button"
                className={`${styles["control"]} ${styles["next"]}`}
                onClick={() => show(1)}
                aria-label="Следующее фото"
              >
                <Icon name="chevron-right" size={28} />
              </button>
            )}
          </div>
        </>
      )}
    </dialog>
  );
}
