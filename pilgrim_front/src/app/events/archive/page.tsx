import { EventsPage } from "../events-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Архив мероприятий",
  description: "Прошедшие походы и встречи сообщества PILGRIM с фотоотчётами.",
};

export default function ArchiveEventsPage() {
  return (
    <EventsPage
      scope="archive"
      title="Архив мероприятий"
      lead="Всё, где мы уже побывали. У многих мероприятий есть фотоотчёты в галерее."
    />
  );
}
