import Image from "next/image";

import { PHOTOS } from "@/mocks/photos";
import { asset } from "@/shared/lib/asset";
import { ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX } from "react";

import styles from "./home-hero.module.css";

export function HomeHero(): JSX.Element {
  const photo = PHOTOS.heroRidgeSunrise;

  return (
    <section className={styles["hero"]} aria-labelledby="hero-title">
      <Image src={asset(photo.src)} alt="" fill priority sizes="100vw" className={styles["image"]} />
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
