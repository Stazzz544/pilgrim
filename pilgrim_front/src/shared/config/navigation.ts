import { SITE } from "./site";

export type NavItem = {
  href: string;
  label: string;
};

export const MAIN_NAV: NavItem[] = [
  { href: "/events", label: "Мероприятия" },
  { href: "/calendar", label: "Календарь" },
  { href: "/blog", label: "Микроблог" },
  { href: "/gallery", label: "Галерея" },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/events/archive", label: "Архив мероприятий" },
  { href: "/donate", label: "Поддержать проект" },
];

export const VK_NAV: NavItem[] = [
  { href: SITE.vk.community, label: "Сообщество ВКонтакте" },
  { href: SITE.vk.chats, label: "Чаты" },
  { href: SITE.vk.market, label: "Магазин" },
  { href: SITE.vk.reviews, label: "Отзывы" },
  { href: SITE.vk.faq, label: "FAQ" },
  { href: SITE.vk.rules, label: "Правила" },
];

export function isActivePath(pathname: string, href: string): boolean {
  const current = pathname.replace(/\/$/, "") || "/";

  if (href === "/events") {
    return current === "/events" || (current.startsWith("/events/") && current !== "/events/archive");
  }

  return current === href || current.startsWith(`${href}/`);
}
