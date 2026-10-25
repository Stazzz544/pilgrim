import { notFound } from "next/navigation";

import { getAlbums } from "@/shared/api/content";
import { getEvent, getEvents } from "@/shared/api/events";
import { eventHref } from "@/shared/api/routes";
import { absoluteUrl, SITE } from "@/shared/config/site";
import { EventDetails } from "@/widgets/event-details/event-details";

import type { Event } from "@/shared/api/types";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { results } = await getEvents();
  return results.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEvent(slug);

  if (!event) {
    return {};
  }

  return {
    title: event.title,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      images: [{ url: absoluteUrl(event.cover.src), width: event.cover.width, height: event.cover.height }],
    },
  };
}

function eventJsonLd(event: Event): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.location, address: event.region },
    image: [absoluteUrl(event.cover.src)],
    url: absoluteUrl(eventHref(event.slug)),
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
  });
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const [{ results: events }, { results: albums }] = await Promise.all([getEvents(), getAlbums()]);

  return (
    <div className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventJsonLd(event) }} />
      <EventDetails slug={slug} events={events} albums={albums} />
    </div>
  );
}
