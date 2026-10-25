"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { EventCard } from "@/entities/event/ui/event-card";
import { AddToCalendarButton, LiveEventStatus } from "@/entities/event/ui/event-client-parts";
import { DifficultyMeter } from "@/entities/event/ui/event-meta";
import { useDemoContent, useMergedAlbums, useMergedEvents } from "@/features/editor/model/content";
import { useSession } from "@/features/editor/model/session";
import { ItemToolbar } from "@/features/editor/ui/editor-buttons";
import { albumHref } from "@/shared/api/routes";
import { SITE } from "@/shared/config/site";
import { asset } from "@/shared/lib/asset";
import { daysInclusive, formatDateRange, formatWeekday } from "@/shared/lib/date";
import { plural } from "@/shared/lib/plural";
import { ButtonLink } from "@/shared/ui/button/button";
import { Card } from "@/shared/ui/card/card";
import { Icon } from "@/shared/ui/icon/icon";
import { MoreLink, SectionHeader } from "@/shared/ui/section-header/section-header";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";
import { TagList } from "@/shared/ui/tag/tag";

import type { Album, Event } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./event-details.module.css";

function getDuration(event: Event): string {
  const days = daysInclusive(event.startDate, event.endDate);
  return days === 1 ? formatWeekday(event.startDate) : `${days} ${plural(days, ["день", "дня", "дней"])}`;
}

type EventDetailsProps = {
  slug: string;
  events: Event[];
  albums: Album[];
};

export function EventDetails({ slug, events, albums }: EventDetailsProps): JSX.Element {
  const user = useSession();
  const { ready } = useDemoContent();
  const mergedEvents = useMergedEvents(events, Boolean(user));
  const mergedAlbums = useMergedAlbums(albums);
  const event = mergedEvents.find((item) => item.slug === slug);

  if (!event) {
    if (!ready && !events.some((item) => item.slug === slug)) {
      return <Skeleton height={520} radius="var(--radius-lg)" />;
    }

    return (
      <div className={styles["missing"]}>
        <p className={styles["missing-title"]}>Мероприятие не найдено</p>
        <p>Возможно, его удалили или перенесли.</p>
        <ButtonLink href="/events">Все мероприятия</ButtonLink>
      </div>
    );
  }

  const album =
    mergedAlbums.find((item) => item.slug === event.albumSlug) ??
    mergedAlbums.find((item) => item.eventSlug === event.slug);
  const others = mergedEvents.filter((item) => item.slug !== event.slug && item.publication !== "draft");
  const similar = [
    ...others.filter((item) => item.category.slug === event.category.slug),
    ...others.filter((item) => item.category.slug !== event.category.slug),
  ].slice(0, 3);

  const facts = [
    {
      icon: "calendar" as const,
      label: "Даты",
      value: `${formatDateRange(event.startDate, event.endDate)} · ${getDuration(event)}`,
    },
    {
      icon: "clock" as const,
      label: "Сбор",
      value: event.startTime === "—" ? event.meetingPoint : `${event.startTime}, ${event.meetingPoint}`,
    },
    { icon: "pin" as const, label: "Место", value: `${event.location}, ${event.region}` },
    { icon: "ruble" as const, label: "Участие", value: event.price },
    { icon: "user" as const, label: "Куратор", value: `${event.curator} · группа ${event.groupSize}` },
  ];

  return (
    <article>
      <Link href="/events" className={styles["back"]}>
        <Icon name="arrow-left" size={16} />
        Все мероприятия
      </Link>

      <ItemToolbar kind="events" item={event} />

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

          {event.program.length > 0 && (
            <section aria-labelledby="program-title" className={styles["section"]}>
              <h2 id="program-title" className={styles["section-title"]}>
                Программа
              </h2>
              <ol className={styles["program"]}>
                {event.program.map((item) => (
                  <li key={`${item.title}-${item.text}`}>
                    <span className={styles["program-title"]}>{item.title}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {event.equipment.length > 0 && (
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
          )}

          {album && (
            <section aria-labelledby="album-title" className={styles["section"]}>
              <div className={styles["album-header"]}>
                <h2 id="album-title" className={styles["section-title"]}>
                  Фотоотчёт
                </h2>
                <MoreLink href={albumHref(album.slug)}>
                  {album.photos.length} {plural(album.photos.length, ["фото", "фото", "фото"])} в альбоме
                </MoreLink>
              </div>
              <Link href={albumHref(album.slug)} className={styles["album-strip"]} aria-label={`Альбом «${album.title}»`}>
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

type EventDetailsFromQueryProps = Omit<EventDetailsProps, "slug">;

export function EventDetailsFromQuery(props: EventDetailsFromQueryProps): JSX.Element {
  const slug = useSearchParams().get("slug") ?? "";
  return <EventDetails slug={slug} {...props} />;
}
