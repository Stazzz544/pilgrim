import { Suspense } from "react";

import { getEvents } from "@/shared/api/events";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { EventsCalendar } from "@/widgets/events-calendar/events-calendar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Календарь мероприятий",
  description: "Календарь походов, поездок и встреч сообщества PILGRIM по месяцам.",
};

export default async function CalendarPage() {
  const { results: events } = await getEvents();

  return (
    <div className="container page">
      <h1 className="page-title">Календарь</h1>
      <p className="page-lead">Выберите день, чтобы увидеть его мероприятия, или листайте месяцы стрелками.</p>
      <div className="page-body">
        <Suspense fallback={<Skeleton height={640} radius="var(--radius-md)" />}>
          <EventsCalendar events={events} />
        </Suspense>
      </div>
    </div>
  );
}
