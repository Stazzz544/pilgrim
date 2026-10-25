"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { DIFFICULTY_LABELS, DIFFICULTY_OPTIONS } from "@/entities/event/model/difficulty";
import { EventCard, EventCardSkeleton } from "@/entities/event/ui/event-card";
import { filterEvents, getEventStatus } from "@/shared/api/events";
import { plural } from "@/shared/lib/plural";
import { useToday } from "@/shared/lib/use-today";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Chips } from "@/shared/ui/chips/chips";
import { Icon } from "@/shared/ui/icon/icon";
import { SearchInput } from "@/shared/ui/search-input/search-input";
import { Select } from "@/shared/ui/select/select";

import type { Category, CategorySlug, Difficulty, Event, EventsOrdering, EventsScope } from "@/shared/api/types";
import type { JSX } from "react";

import styles from "./events-catalog.module.css";

type DifficultyFilter = Difficulty | "all";

const ORDERING_OPTIONS: Array<{ value: EventsOrdering; label: string }> = [
  { value: "start_date", label: "Сначала ближайшие" },
  { value: "-start_date", label: "Сначала поздние" },
];

const ARCHIVE_ORDERING_OPTIONS: Array<{ value: EventsOrdering; label: string }> = [
  { value: "-start_date", label: "Сначала недавние" },
  { value: "start_date", label: "Сначала давние" },
];

const DIFFICULTY_FILTER_OPTIONS: Array<{ value: DifficultyFilter; label: string }> = [
  { value: "all", label: "Любая" },
  ...DIFFICULTY_OPTIONS,
];

function isDifficulty(value: string | null): value is Difficulty {
  return value !== null && value in DIFFICULTY_LABELS;
}

type EventsCatalogProps = {
  events: Event[];
  categories: Category[];
  scope: EventsScope;
};

export function EventsCatalog({ events, categories, scope }: EventsCatalogProps): JSX.Element {
  const today = useToday();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  const categorySlugs = new Set(categories.map((category) => category.slug));
  const selectedCategories = (searchParams.get("category") ?? "")
    .split(",")
    .filter((slug): slug is CategorySlug => categorySlugs.has(slug as CategorySlug));
  const difficultyParam = searchParams.get("difficulty");
  const difficulty = isDifficulty(difficultyParam) ? difficultyParam : null;
  const defaultOrdering: EventsOrdering = scope === "archive" ? "-start_date" : "start_date";
  const sortParam = searchParams.get("sort");
  const ordering: EventsOrdering = sortParam === "start_date" || sortParam === "-start_date" ? sortParam : defaultOrdering;
  const hasFilters = Boolean(search.trim() || selectedCategories.length || difficulty || ordering !== defaultOrdering);

  const updateParams = (patch: Record<string, string | null>): void => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(patch)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    const query = params.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  const resetFilters = (): void => {
    setSearch("");
    window.history.replaceState(null, "", pathname);
  };

  const results = today
    ? filterEvents(events, { scope, today, search, categories: selectedCategories, difficulty, ordering })
    : [];

  return (
    <div className={styles["catalog"]}>
      <div className={styles["filters"]} role="search">
        <div className={styles["controls"]}>
          <SearchInput
            label="Поиск по мероприятиям"
            placeholder="Название, место или тег"
            value={search}
            className={styles["search"]}
            onChange={(value) => {
              setSearch(value);
              updateParams({ q: value.trim() || null });
            }}
          />
          <Select
            label="Сложность"
            value={difficulty ?? "all"}
            options={DIFFICULTY_FILTER_OPTIONS}
            onChange={(value) => updateParams({ difficulty: value === "all" ? null : value })}
          />
          <Select
            label="Сортировка"
            hideLabel
            value={ordering}
            options={scope === "archive" ? ARCHIVE_ORDERING_OPTIONS : ORDERING_OPTIONS}
            onChange={(value) => updateParams({ sort: value === defaultOrdering ? null : value })}
          />
        </div>
        <Chips
          label="Направления"
          allLabel="Все направления"
          options={categories.map((category) => ({ value: category.slug, label: category.name }))}
          selected={selectedCategories}
          onChange={(selected) => updateParams({ category: selected.join(",") || null })}
        />
      </div>

      {today ? (
        <>
          <div className={styles["summary"]} aria-live="polite">
            <span>
              {results.length
                ? `Найдено ${results.length} ${plural(results.length, ["мероприятие", "мероприятия", "мероприятий"])}`
                : "Ничего не найдено"}
            </span>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <Icon name="close" size={16} />
                Сбросить фильтры
              </Button>
            )}
          </div>

          {results.length ? (
            <ul className={styles["list"]}>
              {results.map((event, index) => (
                <li key={event.slug}>
                  <EventCard
                    event={event}
                    status={getEventStatus(event, today)}
                    showCategory
                    headingLevel="h2"
                    priority={index === 0}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles["empty"]}>
              <Icon name="search" size={32} />
              <p className={styles["empty-title"]}>По этим условиям мероприятий нет</p>
              <p className={styles["empty-text"]}>
                Попробуйте изменить запрос или выбрать другие направления.
                {scope === "upcoming" && " Возможно, похожее мероприятие уже есть в архиве."}
              </p>
              <div className={styles["empty-actions"]}>
                <Button variant="outline" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
                {scope === "upcoming" && (
                  <ButtonLink href="/events/archive" variant="ghost">
                    Открыть архив
                  </ButtonLink>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles["list"]}>
          {Array.from({ length: 3 }, (_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
