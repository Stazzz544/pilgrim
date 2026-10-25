import { getAlbums, getPosts } from "@/shared/api/content";
import { getEvents } from "@/shared/api/events";
import { SITE } from "@/shared/config/site";
import { Icon } from "@/shared/ui/icon/icon";
import { LinkCard } from "@/shared/ui/link-card/link-card";
import { SectionHeader } from "@/shared/ui/section-header/section-header";
import { CalendarPanel } from "@/widgets/calendar-panel/calendar-panel";
import { HomeHero } from "@/widgets/home-hero/home-hero";
import { GalleryPreview, NotesPreview } from "@/widgets/home-previews/home-previews";
import { UpcomingEvents } from "@/widgets/upcoming-events/upcoming-events";

import styles from "./home.module.css";

const HOME_ALBUMS = ["karelia-autumn-2026", "khibiny-2026", "ladoga-summer-2026", "kazbegi-2026"];

export default async function HomePage() {
  const [{ results: events }, { results: posts }, { results: albums }] = await Promise.all([
    getEvents(),
    getPosts(),
    getAlbums(),
  ]);

  return (
    <>
      <HomeHero />
      <div className={`container ${styles["layout"]}`}>
        <section className={styles["events"]} aria-labelledby="upcoming-title">
          <SectionHeader
            id="upcoming-title"
            title="Ближайшие мероприятия"
            href="/events"
            linkLabel="Все мероприятия"
          />
          <UpcomingEvents events={events} limit={3} />
        </section>

        <aside className={styles["sidebar"]} aria-label="Календарь и сообщество">
          <CalendarPanel events={events} />
          <LinkCard
            href="/donate"
            icon={<Icon name="heart" size={30} />}
            title={`Поддержать ${SITE.name}`}
            text="Помогите нам открывать новые маршруты"
          />
          <LinkCard
            href={SITE.vk.community}
            icon={
              <span className={styles["vk-badge"]}>
                <Icon name="vk" size={22} />
              </span>
            }
            title="Мы ВКонтакте"
            text="Новости, анонсы, фото и общение в нашем сообществе"
          />
        </aside>

        <div className={styles["extra"]}>
          <section aria-labelledby="notes-title">
            <SectionHeader
              id="notes-title"
              title="Из походных заметок"
              size="md"
              href="/blog"
              linkLabel="Все записи"
            />
            <NotesPreview posts={posts} />
          </section>

          <section aria-labelledby="gallery-title">
            <SectionHeader
              id="gallery-title"
              title="Галерея моментов"
              size="md"
              href="/gallery"
              linkLabel="Вся галерея"
            />
            <GalleryPreview albums={albums} featured={HOME_ALBUMS} />
          </section>
        </div>
      </div>
    </>
  );
}
