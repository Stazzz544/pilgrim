"use client";

import Image from "next/image";
import { useState } from "react";

import { asset } from "@/shared/lib/asset";
import { cn } from "@/shared/lib/cn";
import { Lightbox } from "@/shared/ui/lightbox/lightbox";

import type { Photo } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./photo-gallery.module.css";

type PhotoGalleryProps = {
  photos: Photo[];
  variant?: "masonry" | "post";
  className?: string;
};

export function PhotoGallery({ photos, variant = "masonry", className }: PhotoGalleryProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={cn(styles[variant], variant === "post" && styles[`count-${Math.min(photos.length, 4)}`], className)}>
        {photos.map((photo, index) => (
          <li key={photo.id} className={styles["item"]}>
            <button
              type="button"
              className={styles["button"]}
              onClick={() => setOpenIndex(index)}
              aria-label={`Открыть фото: ${photo.alt}`}
            >
              <Image
                src={asset(photo.thumbSrc)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={variant === "post" ? "(max-width: 640px) 100vw, 640px" : "(max-width: 640px) 50vw, 400px"}
                className={styles["image"]}
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
