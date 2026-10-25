import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DifficultyMeter } from "@/entities/event/ui/event-meta";
import { EventCard } from "@/entities/event/ui/event-card";
import { AddToCalendarButton, LiveEventStatus } from "@/entities/event/ui/event-client-parts";
import { getAlbum } from "@/shared/api/content";
import { getEvent, getEvents } from "@/shared/api/events";
import { absoluteUrl, SITE } from "@/shared/config/site";
import { asset } from "@/shared/lib/asset";
import { daysInclusive, formatDateRange, formatWeekday } from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { ButtonLink } from "@/shared/ui/button/button";
import { Card } from "@/shared/ui/card/card";
import { Icon } from "@/shared/ui/icon/icon";
import { MoreLink, SectionHeader } from "@/shared/ui/section-header/section-header";
import { TagList } from "@/shared/ui/tag/tag";

import type { Event } from "@/shared/api/types";
import type { Metadata } from "next";

import styles from "./event.module.css";

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
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
  });
}

function getDuration(event: Event): string {
  const days = daysInclusive(event.startDate, event.endDate);
  return days === 1 ? formatWeekday(event.startDate) : `${days} ${plural(days, ["день", "дня", "дней"])}`;
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const [album, { results: allEvents }] = await Promise.all([
    event.albumSlug ? getAlbum(event.albumSlug) : null,
    getEvents(),
  ]);
  const others = allEvents.filter((item) => item.slug !== event.slug);
  const similar = [
    ...others.filter((item) => item.category.slug === event.category.slug),
    ...others.filter((item) => item.category.slug !== event.category.slug),
  ].slice(0, 3);

  const facts = [
    { icon: "calendar" as const, label: "Даты", value: `${formatDateRange(event.startDate, event.endDate)} · ${getDuration(event)}` },
    { icon: "clock" as const, label: "Сбор", value: event.startTime === "—" ? event.meetingPoint : `${event.startTime}, ${event.meetingPoint}` },
    { icon: "pin" as const, label: "Место", value: `${event.location}, ${event.region}` },
    { icon: "ruble" as const, label: "Участие", value: event.price },
    { icon: "user" as const, label: "Куратор", value: `${event.curator} · группа ${event.groupSize}` },
  ];

  return (
    <article className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: eventJsonLd(event) }} />

      <Link href="/events" className={styles["back"]}>
        <Icon name="arrow-left" size={16} />
        Все мероприятия
      </Link>

      <header className={styles["header"]}>
        <div className={styles["eyebrow"]}>
          <span className={styles["category"]}>{event.category.name}</span>
          <LiveEventStatus event={event} />
        </div>
        <h1 className={styles["title"]}>{event.title}</h1>
        <p className={styles["summary"]}>{event.summary}</p>
      </header>

      <div className={styles["cover"]}>
        <Image
          src={asset(event.cover.src)}
          alt={event.cover.alt}
          fill
          priority
          sizes="(max-width: 1240px) 100vw, 1200px"
          className={styles["cover-image"]}
        />
      </div>

      <div className={styles["layout"]}>
        <div className={styles["content"]}>
          <section aria-labelledby="about-title" className={styles["section"]}>
            <h2 id="about-title" className={styles["section-title"]}>
              О мероприятии
            </h2>
            {event.description.map((paragraph) => (
              <p key={paragraph} className={styles["paragraph"]}>
                {paragraph}
              </p>
            ))}
            <TagList tags={event.tags} />
          </section>

          <section aria-labelledby="program-title" className={styles["section"]}>
            <h2 id="program-title" className={styles["section-title"]}>
              Программа
            </h2>
            <ol className={styles["program"]}>
              {event.program.map((item) => (
                <li key={item.title}>
                  <span className={styles["program-title"]}>{item.title}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="equipment-title" className={styles["section"]}>
            <h2 id="equipment-title" className={styles["section-title"]}>
              Что взять с собой
            </h2>
            <ul className={styles["checklist"]}>
              {event.equipment.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {album && (
            <section aria-labelledby="album-title" className={styles["section"]}>
              <div className={styles["album-header"]}>
                <h2 id="album-title" className={styles["section-title"]}>
                  Фотоотчёт
                </h2>
                <MoreLink href={`/gallery/${album.slug}`}>
                  {album.photos.length} {plural(album.photos.length, ["фото", "фото", "фото"])} в альбоме
                </MoreLink>
              </div>
              <Link href={`/gallery/${album.slug}`} className={styles["album-strip"]} aria-label={`Альбом «${album.title}»`}>
                {album.photos.slice(0, 4).map((photo) => (
                  <span key={photo.id} className={styles["album-thumb"]}>
                    <Image src={asset(photo.thumbSrc)} alt={photo.alt} fill sizes="200px" className={styles["album-image"]} />
                  </span>
                ))}
              </Link>
            </section>
          )}
        </div>

        <aside className={styles["aside"]}>
          <Card as="section" aria-label="Коротко о мероприятии" className={styles["facts-card"]}>
            <dl className={styles["facts"]}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles["fact"]}>
                  <Icon name={fact.icon} size={18} />
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
              <div className={styles["fact"]}>
                <Icon name="mountain" size={18} />
                <dt>Сложность</dt>
                <dd>
                  <DifficultyMeter difficulty={event.difficulty} />
                </dd>
              </div>
            </dl>
            <div className={styles["actions"]}>
              <ButtonLink href={event.vkUrl} variant="vk" fullWidth>
                <Icon name="vk" size={20} />
                Записаться в чате ВК
              </ButtonLink>
              <AddToCalendarButton event={event} fullWidth />
              <ButtonLink href={SITE.organizer.vk} variant="ghost" fullWidth>
                <Icon name="chat" size={18} />
                Вопрос организатору
              </ButtonLink>
            </div>
          </Card>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className={styles["similar"]}>
          <SectionHeader id="similar-title" title="Похожие мероприятия" href="/events" linkLabel="Все мероприятия" />
          <ul className={styles["similar-grid"]}>
            {similar.map((item) => (
              <li key={item.slug}>
                <EventCard event={item} layout="vertical" showCategory />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
