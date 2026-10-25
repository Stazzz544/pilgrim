"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MAIN_NAV, SECONDARY_NAV, isActivePath } from "@/shared/config/navigation";
import { SITE } from "@/shared/config/site";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { Logo } from "@/shared/ui/logo/logo";
import { Modal } from "@/shared/ui/modal/modal";
import { ThemeToggle } from "@/shared/ui/theme-toggle/theme-toggle";

import type { JSX } from "react";

import styles from "./site-header.module.css";

const DRAWER_EXTRA_NAV = SECONDARY_NAV.filter((item) => item.href !== "/donate");

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = (): void => setIsMenuOpen(false);

  return (
    <header className={styles["header"]}>
      <div className={`container ${styles["inner"]}`}>
        <Logo className={styles["logo"]} />

        <nav className={styles["nav"]} aria-label="Основная навигация">
          <ul className={styles["nav-list"]}>
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles["nav-link"]}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles["actions"]}>
          <ButtonLink href="/donate" size="md" className={styles["support"]}>
            <Icon name="heart" size={18} />
            Поддержать проект
          </ButtonLink>
          <a
            href={SITE.vk.community}
            className={styles["icon-link"]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Сообщество ВКонтакте"
          >
            <Icon name="vk" size={24} />
          </a>
          <ThemeToggle className={`${styles["icon-link"]} ${styles["theme"]}`} />
          <button
            type="button"
            className={styles["icon-link"]}
            aria-label="Открыть меню"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <Modal open={isMenuOpen} onClose={closeMenu} title="Меню" hideTitle variant="drawer">
        <nav aria-label="Меню сайта" className={styles["drawer-nav"]}>
          <ul className={styles["drawer-list"]}>
            {[{ href: "/", label: "Главная" }, ...MAIN_NAV, ...DRAWER_EXTRA_NAV].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles["drawer-link"]}
                  aria-current={
                    (item.href === "/" ? pathname === "/" : isActivePath(pathname, item.href)) ? "page" : undefined
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles["drawer-footer"]}>
          <ButtonLink href="/donate" fullWidth onClick={closeMenu}>
            <Icon name="heart" size={18} />
            Поддержать проект
          </ButtonLink>
          <ButtonLink href={SITE.vk.community} variant="vk" fullWidth>
            <Icon name="vk" size={20} />
            Мы ВКонтакте
          </ButtonLink>
          <div className={styles["drawer-contacts"]}>
            <a href={SITE.organizer.phoneHref}>{SITE.organizer.phone}</a>
            <a href={`mailto:${SITE.organizer.email}`}>{SITE.organizer.email}</a>
          </div>
        </div>
      </Modal>
    </header>
  );
}
