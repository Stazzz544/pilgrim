import { EventsPage } from "./events-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мероприятия",
  description: "Предстоящие походы, сплавы, поездки и городские встречи сообщества PILGRIM.",
};

export default function UpcomingEventsPage() {
  return (
    <EventsPage
      scope="upcoming"
      title="Мероприятия"
      lead="Походы, сплавы, поездки и городские встречи. Выберите направление и записывайтесь в чате ВКонтакте."
    />
  );
}
