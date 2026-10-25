import Image from "next/image";

import { PHOTOS } from "@/mocks/photos";
import { asset } from "@/shared/lib/asset";

import type { Metadata } from "next";

import styles from "./credits.module.css";

export const metadata: Metadata = {
  title: "Авторы фотографий",
  description: "Фотографии демо-версии сайта PILGRIM и их лицензии.",
};

export default function CreditsPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Авторы фотографий</h1>
      <p className="page-lead">
        В демо-версии используются свободно лицензированные фотографии с Wikimedia Commons. Перед запуском их заменят на
        фотоотчёты сообщества.
      </p>
      <ul className={`page-body ${styles["list"]}`}>
        {Object.values(PHOTOS).map((photo) => (
          <li key={photo.id} className={styles["item"]}>
            <span className={styles["thumb"]}>
              <Image src={asset(photo.thumbSrc)} alt="" fill sizes="96px" className={styles["image"]} />
            </span>
            <span className={styles["text"]}>
              <span className={styles["alt"]}>{photo.alt}</span>
              <span className={styles["credit"]}>
                {photo.credit.author} · {photo.credit.license} ·{" "}
                <a href={photo.credit.sourceUrl} target="_blank" rel="noopener noreferrer">
                  источник
                </a>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
