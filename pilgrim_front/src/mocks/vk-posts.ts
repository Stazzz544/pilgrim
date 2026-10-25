import { SITE } from "@/shared/config/site";

import { PHOTOS } from "./photos";

import type { VkPost } from "@/shared/api/types";

export const VK_POSTS: VkPost[] = [
  {
    id: 1,
    text: "Открыли запись на «Поход выходного дня» 1 ноября! 15 км по Кавголовским высотам, чай на привале и новые знакомства. Пишите в комментариях или в чат.",
    publishedAt: "2026-10-23",
    image: PHOTOS.hikerMeadowTrail,
    likes: 48,
    url: SITE.vk.community,
  },
  {
    id: 2,
    text: "Фотоотчёт с осеннего маршрута по Карельскому перешейку уже в альбоме. Спасибо всем, кто был с нами эти три дня!",
    publishedAt: "2026-10-20",
    image: PHOTOS.autumnPineLake,
    likes: 112,
    url: SITE.vk.community,
  },
  {
    id: 3,
    text: "Ищем попутчиков в Териберку на конец ноября. Осталось 4 места, подробности — в карточке мероприятия.",
    publishedAt: "2026-10-16",
    image: null,
    likes: 37,
    url: SITE.vk.community,
  },
];
