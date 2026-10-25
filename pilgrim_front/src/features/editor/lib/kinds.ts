import type { ContentKind } from "../model/content";

type KindMeta = {
  listHref: string;
  addLabel: string;
  createTitle: string;
  editTitle: string;
  plural: string;
  deleteQuestion: string;
};

export const KIND_META: Record<ContentKind, KindMeta> = {
  events: {
    listHref: "/events",
    addLabel: "Добавить мероприятие",
    createTitle: "Новое мероприятие",
    editTitle: "Редактирование мероприятия",
    plural: "Мероприятия",
    deleteQuestion: "Удалить мероприятие?",
  },
  posts: {
    listHref: "/blog",
    addLabel: "Добавить пост",
    createTitle: "Новый пост",
    editTitle: "Редактирование поста",
    plural: "Посты",
    deleteQuestion: "Удалить пост?",
  },
  albums: {
    listHref: "/gallery",
    addLabel: "Добавить альбом",
    createTitle: "Новый альбом",
    editTitle: "Редактирование альбома",
    plural: "Альбомы",
    deleteQuestion: "Удалить альбом?",
  },
};

export function editorHref(kind: ContentKind, slug?: string): string {
  return slug ? `/manage/${kind}?slug=${encodeURIComponent(slug)}` : `/manage/${kind}`;
}
