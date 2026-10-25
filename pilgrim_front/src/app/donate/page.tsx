import { SITE } from "@/shared/config/site";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { DonateForm } from "@/widgets/donate-form/donate-form";

import type { IconName } from "@/shared/ui/icon/icon";
import type { Metadata } from "next";

import styles from "./donate.module.css";

export const metadata: Metadata = {
  title: "Поддержать проект",
  description: "Добровольная поддержка сообщества PILGRIM: снаряжение, транспорт до маршрутов и развитие сайта.",
};

const SPENDING: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "mountain",
    title: "Общее снаряжение",
    text: "Палатки, котлы, байдарки и аптечки, которые выдаём новичкам бесплатно.",
  },
  {
    icon: "pin",
    title: "Новые маршруты",
    text: "Разведка, карты и трансферы до стартов, куда не ходит общественный транспорт.",
  },
  {
    icon: "users",
    title: "Городские встречи",
    text: "Аренда залов для лекций и кинопоказов, настольные игры для субботних встреч.",
  },
  {
    icon: "image",
    title: "Сайт и фотоотчёты",
    text: "Хостинг, домен и хранение фотографий, чтобы воспоминания оставались с нами.",
  },
];

export default function DonatePage() {
  return (
    <div className="container page">
      <div className={styles["layout"]}>
        <div className={styles["intro"]}>
          <span className={styles["eyebrow"]}>
            <Icon name="heart" size={16} />
            Добровольная поддержка
          </span>
          <h1 className="page-title">Поддержать {SITE.name}</h1>
          <p className="page-lead">
            Мы не турагентство и не зарабатываем на встречах: большинство из них бесплатные, а кураторы — такие же
            участники. Ваша поддержка помогает открывать новые маршруты и принимать новичков.
          </p>
        </div>

        <div className={styles["details"]}>
          <section aria-labelledby="spending-title" className={styles["section"]}>
            <h2 id="spending-title" className={styles["section-title"]}>
              На что идут средства
            </h2>
            <ul className={styles["spending"]}>
              {SPENDING.map((item) => (
                <li key={item.title} className={styles["spending-item"]}>
                  <span className={styles["spending-icon"]}>
                    <Icon name={item.icon} size={22} />
                  </span>
                  <span>
                    <span className={styles["spending-title"]}>{item.title}</span>
                    <span className={styles["spending-text"]}>{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="other-title" className={styles["section"]}>
            <h2 id="other-title" className={styles["section-title"]}>
              Другие способы помочь
            </h2>
            <div className={styles["other"]}>
              <LinkCard
                href={SITE.organizer.vk}
                icon={<Icon name="chat" size={26} />}
                title="Стать активистом"
                text="Возьмите на себя маршрут или городскую встречу — поможем с организацией"
              />
              <LinkCard
                href={SITE.vk.market}
                icon={<Icon name="vk" size={26} />}
                title="Магазин сообщества"
                text="Мерч и полезные мелочи для походов в нашем магазине ВКонтакте"
              />
            </div>
          </section>
        </div>

        <div className={styles["aside"]}>
          <DonateForm />
        </div>
      </div>
    </div>
  );
}
