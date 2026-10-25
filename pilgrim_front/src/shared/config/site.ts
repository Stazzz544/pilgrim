const VK_GROUP_ID = "97716803";

export const SITE = {
  name: "PILGRIM",
  tagline: "Походы и приключения",
  description:
    "Сообщество PILGRIM: походы, сплавы, поездки и события для своих. Календарь мероприятий, заметки и фотоотчёты.",
  foundedYear: 2019,
  vk: {
    community: `https://vk.ru/club${VK_GROUP_ID}`,
    chats: `https://vk.ru/wall-${VK_GROUP_ID}_12713`,
    market: `https://vk.ru/market-${VK_GROUP_ID}?screen=group`,
    reviews: `https://vk.ru/topic-${VK_GROUP_ID}_47217244?offset=0`,
    faq: `https://vk.ru/topic-${VK_GROUP_ID}_49259936?offset=0`,
    rules: `https://vk.ru/topic-${VK_GROUP_ID}_34436698?offset=0`,
  },
  organizer: {
    name: "Алексей Малахов",
    role: "Организатор",
    phone: "+7 (911) 831-87-77",
    phoneHref: "tel:+79118318777",
    email: "alexsey.anatolich@mail.ru",
    vk: "https://vk.com/alexey_trvl",
  },
} as const;
