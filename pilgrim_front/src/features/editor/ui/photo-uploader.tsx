"use client";

/* eslint-disable @next/next/no-img-element -- превью из data: URL, оптимизатор Next тут не нужен */
import { useId, useState } from "react";

import { cn } from "@/shared/lib/cn";
import { plural } from "@/shared/lib/plural";
import { Icon } from "@/shared/ui/icon/icon";

import { processImage } from "../lib/process-image";

import type { Photo } from "@/shared/api/types";
import type { DragEvent, JSX } from "react";

import styles from "./photo-uploader.module.css";

type PhotoUploaderProps = {
  id: string;
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  max: number;
  author: string;
  showCover?: boolean;
  invalid?: boolean;
};

function move<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function PhotoUploader({
  id,
  photos,
  onChange,
  max,
  author,
  showCover,
  invalid,
}: PhotoUploaderProps): JSX.Element {
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const hintId = useId();
  const freeSlots = max - photos.length;

  const addFiles = async (fileList: FileList | null): Promise<void> => {
    const files = [...(fileList ?? [])];

    if (!files.length) {
      return;
    }

    const accepted = files.slice(0, Math.max(0, freeSlots));
    const nextErrors =
      files.length > accepted.length ? [`Можно добавить ещё ${freeSlots} ${plural(freeSlots, ["фото", "фото", "фото"])}`] : [];
    const added: Photo[] = [];
    setProgress({ done: 0, total: accepted.length });

    for (const [index, file] of accepted.entries()) {
      try {
        added.push(await processImage(file, author));
      } catch (error) {
        nextErrors.push(error instanceof Error ? error.message : `Не удалось обработать «${file.name}»`);
      }

      setProgress({ done: index + 1, total: accepted.length });
    }

    setProgress(null);
    setErrors(nextErrors);

    if (added.length) {
      onChange([...photos, ...added]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragOver(false);
    void addFiles(event.dataTransfer.files);
  };

  return (
    <div className={styles["uploader"]}>
      {freeSlots > 0 && (
        <label
          htmlFor={id}
          className={cn(styles["dropzone"], isDragOver && styles["drag-over"], invalid && styles["invalid"])}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <Icon name="upload" size={28} />
          <span className={styles["dropzone-title"]}>
            {progress ? `Обрабатываем фото: ${progress.done} из ${progress.total}…` : "Перетащите фото сюда или нажмите, чтобы выбрать"}
          </span>
          <span id={hintId} className={styles["dropzone-hint"]}>
            JPEG, PNG или WebP до 25 МБ. Ещё можно {freeSlots} {plural(freeSlots, ["фото", "фото", "фото"])}. Фото
            уменьшаются до 1600 px прямо в браузере.
          </span>
          <input
            id={id}
            type="file"
            accept="image/*"
            multiple={max > 1}
            className="visually-hidden"
            aria-describedby={hintId}
            disabled={Boolean(progress)}
            onChange={(event) => {
              void addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      )}

      {errors.length > 0 && (
        <ul className={styles["errors"]} role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {photos.length > 0 && (
        <ul className={styles["grid"]}>
          {photos.map((photo, index) => (
            <li key={photo.id} className={styles["item"]}>
              <div className={styles["thumb"]}>
                <img src={photo.thumbSrc} alt="" className={styles["image"]} />
                {showCover && index === 0 && <span className={styles["cover"]}>Обложка</span>}
              </div>
              <input
                type="text"
                className={styles["caption"]}
                value={photo.alt}
                placeholder="Подпись к фото"
                aria-label={`Подпись к фото ${index + 1}`}
                onChange={(event) =>
                  onChange(photos.map((item) => (item.id === photo.id ? { ...item, alt: event.target.value } : item)))
                }
              />
              <div className={styles["actions"]}>
                <button
                  type="button"
                  className={styles["action"]}
                  disabled={index === 0}
                  onClick={() => onChange(move(photos, index, index - 1))}
                  aria-label="Переместить левее"
                >
                  <Icon name="chevron-left" size={16} />
                </button>
                <button
                  type="button"
                  className={styles["action"]}
                  disabled={index === photos.length - 1}
                  onClick={() => onChange(move(photos, index, index + 1))}
                  aria-label="Переместить правее"
                >
                  <Icon name="chevron-right" size={16} />
                </button>
                {showCover && index > 0 && (
                  <button
                    type="button"
                    className={styles["action"]}
                    onClick={() => onChange(move(photos, index, 0))}
                    aria-label="Сделать обложкой"
                    title="Сделать обложкой"
                  >
                    <Icon name="star" size={16} />
                  </button>
                )}
                <button
                  type="button"
                  className={cn(styles["action"], styles["remove"])}
                  onClick={() => onChange(photos.filter((item) => item.id !== photo.id))}
                  aria-label="Удалить фото"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
