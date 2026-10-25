import { PHOTOS } from "@/mocks/photos";
import { asset } from "@/shared/lib/asset";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX } from "react";

import styles from "./home-hero.module.css";

const HERO_LARGE_SRC = "/images/photos/hero-lake-trail-2880.webp";
const HERO_MOBILE_SRC = "/images/photos/hero-lake-trail-mobile.webp";

export function HomeHero(): JSX.Element {
  const photo = PHOTOS.heroLakeTrail;

  return (
    <section className={styles["hero"]} aria-labelledby="hero-title">
      <picture>
        <source media="(max-width: 640px)" srcSet={asset(HERO_MOBILE_SRC)} />
        <img
          src={asset(photo.src)}
          srcSet={`${asset(photo.src)} ${photo.width}w, ${asset(HERO_LARGE_SRC)} 2880w`}
          sizes="100vw"
          alt=""
          width={photo.width}
          height={photo.height}
          className={styles["image"]}
          fetchPriority="high"
        />
      </picture>
      <div className={`container ${styles["content"]}`}>
        <h1 id="hero-title" className={styles["title"]}>
          Больше дорог.
          <br />
          Больше историй.
        </h1>
        <p className={styles["lead"]}>Походы, выезды и приключения вместе.</p>
        <ButtonLink href="/events" size="lg" className={styles["cta"]}>
          Смотреть мероприятия
          <Icon name="arrow-right" size={18} />
        </ButtonLink>
      </div>
    </section>
  );
}
