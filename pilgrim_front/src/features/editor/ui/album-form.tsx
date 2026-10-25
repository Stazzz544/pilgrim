"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { albumHref } from "@/shared/api/routes";
import { formatDate, toDateKey } from "@/shared/lib/date";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Field, FormRow, FormSection, RadioGroup, SelectInput, TextArea, TextInput } from "@/shared/ui/form/form";
import { Icon } from "@/shared/ui/icon/icon";

import { focusFirstError, PUBLICATION_OPTIONS } from "../lib/form-utils";
import { KIND_META } from "../lib/kinds";
import { createId, createSlug } from "../lib/slug";
import { saveItem, useDemoContent, useMergedAlbums, useMergedEvents } from "../model/content";
import { EditorFrame } from "./editor-frame";
import { PhotoUploader } from "./photo-uploader";

import type { DemoUser } from "../model/session";
import type { Album, Category, CategorySlug, Event, Photo, Publication } from "@/shared/api/types";
import type { FormEvent, JSX } from "react";

import styles from "./editor-form.module.css";

const MAX_PHOTOS = 40;
const NO_EVENT = "none";

type AlbumValues = {
  title: string;
  description: string;
  category: CategorySlug;
  date: string;
  eventSlug: string;
  photos: Photo[];
  publication: Publication;
};

type AlbumErrors = Partial<Record<keyof AlbumValues, string>>;

function toValues(album: Album | null): AlbumValues {
  return {
    title: album?.title ?? "",
    description: album?.description ?? "",
    category: album?.category.slug ?? "outdoor",
    date: album?.date ?? toDateKey(new Date()),
    eventSlug: album?.eventSlug ?? NO_EVENT,
    photos: album?.photos ?? [],
    publication: album?.publication ?? "published",
  };
}

function validate(values: AlbumValues): AlbumErrors {
  const errors: AlbumErrors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Название — минимум 3 символа";
  }

  if (!values.date) {
    errors.date = "Укажите дату";
  }

  if (!values.photos.length) {
    errors.photos = "Добавьте хотя бы одно фото";
  }

  return errors;
}

type AlbumEditorProps = {
  baseAlbums: Album[];
  baseEvents: Event[];
  categories: Category[];
};

export function AlbumEditor({ baseAlbums, baseEvents, categories }: AlbumEditorProps): JSX.Element {
  const slug = useSearchParams().get("slug");
  const albums = useMergedAlbums(baseAlbums, true);
  const events = useMergedEvents(baseEvents);
  const { ready } = useDemoContent();

  return (
    <EditorFrame kind="albums" slug={slug} items={albums} ready={ready}>
      {(album, user) => (
        <AlbumForm key={album?.slug ?? "new"} album={album} user={user} events={events} categories={categories} />
      )}
    </EditorFrame>
  );
}

type AlbumFormProps = {
  album: Album | null;
  user: DemoUser;
  events: Event[];
  categories: Category[];
};

function AlbumForm({ album, user, events, categories }: AlbumFormProps): JSX.Element {
  const router = useRouter();
  const formId = useId();
  const [values, setValues] = useState(() => toValues(album));
  const [errors, setErrors] = useState<AlbumErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const fieldId = (name: string): string => `${formId}-${name}`;
  const eventOptions = [
    { value: NO_EVENT, label: "Без привязки" },
    ...[...events]
      .sort((first, second) => second.startDate.localeCompare(first.startDate))
      .map((event) => ({ value: event.slug, label: `${event.title} · ${formatDate(event.startDate)}` })),
  ];

  const update = <Key extends keyof AlbumValues>(key: Key, value: AlbumValues[Key]): void => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>): Promise<void> => {
    submitEvent.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (focusFirstError(fieldId, nextErrors)) {
      return;
    }

    setIsSaving(true);
    const saved: Album = {
      id: album?.id ?? createId(),
      slug: album?.slug ?? createSlug(values.title),
      title: values.title.trim(),
      description: values.description.trim(),
      category: categories.find((item) => item.slug === values.category) ?? categories[0],
      date: values.date,
      eventSlug: values.eventSlug === NO_EVENT ? null : values.eventSlug,
      cover: values.photos[0],
      photos: values.photos,
      authorId: album?.authorId ?? user.id,
      publication: values.publication,
    };

    await saveItem("albums", saved);
    router.push(albumHref(saved.slug));
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit} noValidate>
      <FormSection title="Альбом">
        <Field label="Название" htmlFor={fieldId("title")} required error={errors.title}>
          <TextInput
            id={fieldId("title")}
            value={values.title}
            maxLength={120}
            invalid={Boolean(errors.title)}
            placeholder="Осень на Карельском перешейке"
            onChange={(changeEvent) => update("title", changeEvent.target.value)}
          />
        </Field>
        <Field label="Описание" htmlFor={fieldId("description")}>
          <TextArea
            id={fieldId("description")}
            value={values.description}
            rows={3}
            onChange={(changeEvent) => update("description", changeEvent.target.value)}
          />
        </Field>
        <FormRow>
          <Field label="Направление" htmlFor={fieldId("category")} required>
            <SelectInput
              id={fieldId("category")}
              value={values.category}
              options={categories.map((category) => ({ value: category.slug, label: category.name }))}
              onChange={(value) => update("category", value)}
            />
          </Field>
          <Field label="Дата" htmlFor={fieldId("date")} required error={errors.date}>
            <TextInput
              id={fieldId("date")}
              type="date"
              value={values.date}
              invalid={Boolean(errors.date)}
              onChange={(changeEvent) => update("date", changeEvent.target.value)}
            />
          </Field>
        </FormRow>
        <Field label="Мероприятие" htmlFor={fieldId("eventSlug")} hint="Альбом появится на странице мероприятия">
          <SelectInput
            id={fieldId("eventSlug")}
            value={values.eventSlug}
            options={eventOptions}
            onChange={(value) => update("eventSlug", value)}
          />
        </Field>
      </FormSection>

      <FormSection title="Фотографии">
        <Field
          label="Первое фото — обложка альбома"
          htmlFor={fieldId("photos")}
          required
          error={errors.photos}
        >
          <PhotoUploader
            id={fieldId("photos")}
            photos={values.photos}
            max={MAX_PHOTOS}
            author={user.name}
            showCover
            invalid={Boolean(errors.photos)}
            onChange={(photos) => update("photos", photos)}
          />
        </Field>
      </FormSection>

      <FormSection title="Публикация">
        <RadioGroup
          name={fieldId("publication")}
          label="Статус"
          value={values.publication}
          options={PUBLICATION_OPTIONS}
          onChange={(value) => update("publication", value)}
        />
      </FormSection>

      <div className={styles["actions"]}>
        {Object.values(errors).some(Boolean) && (
          <span className={styles["actions-error"]}>Проверьте поля, отмеченные красным</span>
        )}
        <ButtonLink href={album ? albumHref(album.slug) : KIND_META.albums.listHref} variant="ghost">
          Отмена
        </ButtonLink>
        <Button type="submit" disabled={isSaving}>
          <Icon name="check" size={18} />
          {album ? "Сохранить" : "Создать альбом"}
        </Button>
      </div>
    </form>
  );
}
