import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";

import type { Metadata } from "next";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <div className={`container ${styles["page"]}`}>
      <p className={styles["code"]}>404</p>
      <h1 className={styles["title"]}>Кажется, эта тропа никуда не ведёт</h1>
      <p className={styles["text"]}>Страница переехала или её никогда не было. Вернитесь на главную или посмотрите ближайшие мероприятия.</p>
      <div className={styles["actions"]}>
        <ButtonLink href="/">На главную</ButtonLink>
        <ButtonLink href="/events" variant="outline">
          Мероприятия
          <Icon name="arrow-right" size={16} />
        </ButtonLink>
      </div>
    </div>
  );
}
