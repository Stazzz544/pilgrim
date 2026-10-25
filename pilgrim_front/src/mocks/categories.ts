import type { Category, CategorySlug } from "@/shared/api/types";

export const CATEGORIES = {
  outdoor: {
    slug: "outdoor",
    name: "Аутдор-туризм",
    description: "Походы, кемпинг и ночёвки у костра",
  },
  russia: {
    slug: "russia",
    name: "Путешествия по России",
    description: "Поездки по стране от Карелии до Кольского",
  },
  international: {
    slug: "international",
    name: "Международные путешествия",
    description: "Горы, монастыри и дороги за границей",
  },
  sport: {
    slug: "sport",
    name: "Спортивные мероприятия",
    description: "Сплавы, лыжи и велосипеды",
  },
  festivals: {
    slug: "festivals",
    name: "Фестивали и музыка",
    description: "Фестивали, концерты и праздники под открытым небом",
  },
  city: {
    slug: "city",
    name: "Городские мероприятия",
    description: "Выставки, кино, лекции и настолки",
  },
} satisfies Record<CategorySlug, Category>;
