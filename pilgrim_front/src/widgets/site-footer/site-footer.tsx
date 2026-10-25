import Link from "next/link";

import { MAIN_NAV, SECONDARY_NAV, VK_NAV } from "@/shared/config/navigation";
import { SITE } from "@/shared/config/site";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { LogoFull } from "@/shared/ui/logo/logo";

import type { JSX } from "react";

import styles from "./site-footer.module.css";

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter(): JSX.Element {
  return (
    <footer className={styles["footer"]} id="about">
      <div className={`container ${styles["grid"]}`}>
        <section className={styles["about"]} aria-labelledby="footer-about">
          <LogoFull />
          <h2 id="footer-about" className="visually-hidden">
            О сообществе
          </h2>
          <p className={styles["text"]}>
            PILGRIM — сообщество людей, которых объединяют путешествия, активный отдых и новые знакомства. Мы не
            турагентство: каждую встречу ведёт активист-куратор, а участие бесплатное или за небольшой добровольный
            взнос.
          </p>
          <ButtonLink href="/donate" variant="outline" size="sm">
            <Icon name="heart" size={16} />
            Поддержать проект
          </ButtonLink>
        </section>

        <nav className={styles["column"]} aria-labelledby="footer-sections">
          <h2 id="footer-sections" className={styles["heading"]}>
            Разделы
          </h2>
          <ul className={styles["links"]}>
            {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles["column"]} aria-labelledby="footer-vk">
          <h2 id="footer-vk" className={styles["heading"]}>
            ВКонтакте
          </h2>
          <ul className={styles["links"]}>
            {VK_NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles["column"]} aria-labelledby="footer-contacts">
          <h2 id="footer-contacts" className={styles["heading"]}>
            Контакты
          </h2>
          <p className={styles["person"]}>
            {SITE.organizer.name}
            <span>{SITE.organizer.role}</span>
          </p>
          <ul className={styles["links"]}>
            <li>
              <a href={SITE.organizer.phoneHref} className={styles["contact"]}>
                <Icon name="phone" size={16} />
                {SITE.organizer.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.organizer.email}`} className={styles["contact"]}>
                <Icon name="mail" size={16} />
                {SITE.organizer.email}
              </a>
            </li>
            <li>
              <a href={SITE.organizer.vk} target="_blank" rel="noopener noreferrer" className={styles["contact"]}>
                <Icon name="vk" size={16} />
                Написать в ВК
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className={`container ${styles["bottom"]}`}>
        <p>
          © {SITE.foundedYear}–{CURRENT_YEAR} {SITE.name}. {SITE.tagline}.
        </p>
        <p className={styles["meta"]}>
          <span>Демо-версия сайта</span>
          <Link href="/credits">Фотографии: Wikimedia Commons</Link>
        </p>
      </div>
    </footer>
  );
}
