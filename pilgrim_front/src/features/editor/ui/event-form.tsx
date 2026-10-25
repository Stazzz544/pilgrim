"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { DIFFICULTY_OPTIONS } from "@/entities/event/model/difficulty";
import { eventHref } from "@/shared/api/routes";
import { SITE } from "@/shared/config/site";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Field, FormRow, FormSection, RadioGroup, SelectInput, TextArea, TextInput } from "@/shared/ui/form/form";
import { Icon } from "@/shared/ui/icon/icon";
import { TagList } from "@/shared/ui/tag/tag";

import { focusFirstError, PUBLICATION_OPTIONS, splitParagraphs, splitTags } from "../lib/form-utils";
import { KIND_META } from "../lib/kinds";
import { createId, createSlug } from "../lib/slug";
import { saveItem, useDemoContent, useMergedEvents } from "../model/content";
import { EditorFrame } from "./editor-frame";
import { PhotoUploader } from "./photo-uploader";

import type { DemoUser } from "../model/session";
import type { Category, CategorySlug, Difficulty, Event, EventProgramItem, Photo, Publication } from "@/shared/api/types";
import type { FormEvent, JSX } from "react";

import styles from "./editor-form.module.css";

type EventValues = {
  title: string;
  summary: string;
  description: string;
  category: CategorySlug;
  difficulty: Difficulty;
  startDate: string;
  endDate: string;
  startTime: string;
  location: string;
  region: string;
  meetingPoint: string;
  price: string;
  groupSize: string;
  curator: string;
  tags: string;
  program: EventProgramItem[];
  equipment: string[];
  cover: Photo[];
  publication: Publication;
};

type EventErrors = Partial<Record<keyof EventValues, string>>;

function toValues(event: Event | null, user: DemoUser): EventValues {
  return {
    title: event?.title ?? "",
    summary: event?.summary ?? "",
    description: event?.description.join("\n\n") ?? "",
    category: event?.category.slug ?? "outdoor",
    difficulty: event?.difficulty ?? "easy",
    startDate: event?.startDate ?? "",
    endDate: event?.endDate ?? "",
    startTime: event && event.startTime !== "—" ? event.startTime : "",
    location: event?.location ?? "",
    region: event?.region ?? "",
    meetingPoint: event?.meetingPoint ?? "",
    price: event?.price ?? "Бесплатно",
    groupSize: event?.groupSize ?? "",
    curator: event?.curator ?? user.name,
    tags: event?.tags.join(", ") ?? "",
    program: event?.program.length ? event.program : [{ title: "", text: "" }],
    equipment: event?.equipment.length ? event.equipment : [""],
    cover: event ? [event.cover] : [],
    publication: event?.publication ?? "published",
  };
}

function validate(values: EventValues): EventErrors {
  const errors: EventErrors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Название — минимум 3 символа";
  }

  if (values.summary.trim().length < 10) {
    errors.summary = "Коротко опишите мероприятие — минимум 10 символов";
  }

  if (!values.description.trim()) {
    errors.description = "Добавьте описание";
  }

  if (!values.startDate) {
    errors.startDate = "Укажите дату начала";
  }

  if (values.endDate && values.startDate && values.endDate < values.startDate) {
    errors.endDate = "Окончание не может быть раньше начала";
  }

  if (!values.location.trim()) {
    errors.location = "Укажите место";
  }

  if (!values.region.trim()) {
    errors.region = "Укажите регион";
  }

  if (!values.cover.length) {
    errors.cover = "Добавьте обложку";
  }

  return errors;
}

type EventEditorProps = {
  baseEvents: Event[];
  categories: Category[];
};

export function EventEditor({ baseEvents, categories }: EventEditorProps): JSX.Element {
  const slug = useSearchParams().get("slug");
  const events = useMergedEvents(baseEvents, true);
  const { ready } = useDemoContent();

  return (
    <EditorFrame kind="events" slug={slug} items={events} ready={ready}>
      {(event, user) => <EventForm key={event?.slug ?? "new"} event={event} user={user} categories={categories} />}
    </EditorFrame>
  );
}

type EventFormProps = {
  event: Event | null;
  user: DemoUser;
  categories: Category[];
};

function EventForm({ event, user, categories }: EventFormProps): JSX.Element {
  const router = useRouter();
  const formId = useId();
  const [values, setValues] = useState(() => toValues(event, user));
  const [errors, setErrors] = useState<EventErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const fieldId = (name: string): string => `${formId}-${name}`;

  const update = <Key extends keyof EventValues>(key: Key, value: EventValues[Key]): void => {
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
    const category = categories.find((item) => item.slug === values.category) ?? categories[0];
    const saved: Event = {
      id: event?.id ?? createId(),
      slug: event?.slug ?? createSlug(values.title),
      title: values.title.trim(),
      summary: values.summary.trim(),
      description: splitParagraphs(values.description),
      startDate: values.startDate,
      endDate: values.endDate || values.startDate,
      startTime: values.startTime || "—",
      location: values.location.trim(),
      region: values.region.trim(),
      meetingPoint: values.meetingPoint.trim() || "Уточняется в чате",
      difficulty: values.difficulty,
      category,
      tags: splitTags(values.tags),
      cover: values.cover[0],
      albumSlug: event?.albumSlug ?? null,
      curator: values.curator.trim() || user.name,
      price: values.price.trim() || "Бесплатно",
      groupSize: values.groupSize.trim() || "без ограничений",
      program: values.program.filter((item) => item.title.trim() || item.text.trim()),
      equipment: values.equipment.map((item) => item.trim()).filter(Boolean),
      vkUrl: event?.vkUrl ?? SITE.vk.chats,
      authorId: event?.authorId ?? user.id,
      publication: values.publication,
      isArchived: event?.isArchived,
    };

    await saveItem("events", saved);
    router.push(eventHref(saved.slug));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form className={styles["form"]} onSubmit={handleSubmit} noValidate>
      <FormSection title="Основное">
        <Field label="Название" htmlFor={fieldId("title")} required error={errors.title}>
          <TextInput
            id={fieldId("title")}
            value={values.title}
            maxLength={120}
            invalid={Boolean(errors.title)}
            placeholder="Например, Поход выходного дня"
            onChange={(changeEvent) => update("title", changeEvent.target.value)}
          />
        </Field>
        <Field
          label="Коротко"
          htmlFor={fieldId("summary")}
          required
          error={errors.summary}
          hint="Одно предложение для карточки в списке"
        >
          <TextInput
            id={fieldId("summary")}
            value={values.summary}
            maxLength={200}
            invalid={Boolean(errors.summary)}
            onChange={(changeEvent) => update("summary", changeEvent.target.value)}
          />
        </Field>
        <Field
          label="Описание"
          htmlFor={fieldId("description")}
          required
          error={errors.description}
          hint="Пустая строка между абзацами"
        >
          <TextArea
            id={fieldId("description")}
            value={values.description}
            invalid={Boolean(errors.description)}
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
          <Field label="Сложность" required>
            <RadioGroup
              name={fieldId("difficulty")}
              label="Сложность"
              value={values.difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={(value) => update("difficulty", value)}
            />
          </Field>
        </FormRow>
        <Field label="Теги" htmlFor={fieldId("tags")} hint="Через запятую, до 8 штук">
          <TextInput
            id={fieldId("tags")}
            value={values.tags}
            placeholder="Поход, Лес, Палатки"
            onChange={(changeEvent) => update("tags", changeEvent.target.value)}
          />
          {splitTags(values.tags).length > 0 && <TagList tags={splitTags(values.tags)} className={styles["tags"]} />}
        </Field>
      </FormSection>

      <FormSection title="Когда и где">
        <FormRow>
          <Field label="Начало" htmlFor={fieldId("startDate")} required error={errors.startDate}>
            <TextInput
              id={fieldId("startDate")}
              type="date"
              value={values.startDate}
              invalid={Boolean(errors.startDate)}
              onChange={(changeEvent) => update("startDate", changeEvent.target.value)}
            />
          </Field>
          <Field
            label="Окончание"
            htmlFor={fieldId("endDate")}
            error={errors.endDate}
            hint="Пусто — однодневное"
          >
            <TextInput
              id={fieldId("endDate")}
              type="date"
              value={values.endDate}
              min={values.startDate || undefined}
              invalid={Boolean(errors.endDate)}
              onChange={(changeEvent) => update("endDate", changeEvent.target.value)}
            />
          </Field>
          <Field label="Время сбора" htmlFor={fieldId("startTime")}>
            <TextInput
              id={fieldId("startTime")}
              type="time"
              value={values.startTime}
              onChange={(changeEvent) => update("startTime", changeEvent.target.value)}
            />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Место" htmlFor={fieldId("location")} required error={errors.location}>
            <TextInput
              id={fieldId("location")}
              value={values.location}
              invalid={Boolean(errors.location)}
              placeholder="Кавголовские высоты, Токсово"
              onChange={(changeEvent) => update("location", changeEvent.target.value)}
            />
          </Field>
          <Field label="Регион" htmlFor={fieldId("region")} required error={errors.region}>
            <TextInput
              id={fieldId("region")}
              value={values.region}
              invalid={Boolean(errors.region)}
              placeholder="Ленинградская область"
              onChange={(changeEvent) => update("region", changeEvent.target.value)}
            />
          </Field>
        </FormRow>
        <Field label="Место сбора" htmlFor={fieldId("meetingPoint")}>
          <TextInput
            id={fieldId("meetingPoint")}
            value={values.meetingPoint}
            placeholder="Финляндский вокзал, электричка 9:47"
            onChange={(changeEvent) => update("meetingPoint", changeEvent.target.value)}
          />
        </Field>
      </FormSection>

      <FormSection title="Участие">
        <FormRow>
          <Field label="Стоимость" htmlFor={fieldId("price")}>
            <TextInput
              id={fieldId("price")}
              value={values.price}
              onChange={(changeEvent) => update("price", changeEvent.target.value)}
            />
          </Field>
          <Field label="Размер группы" htmlFor={fieldId("groupSize")}>
            <TextInput
              id={fieldId("groupSize")}
              value={values.groupSize}
              placeholder="до 15 человек"
              onChange={(changeEvent) => update("groupSize", changeEvent.target.value)}
            />
          </Field>
          <Field label="Куратор" htmlFor={fieldId("curator")}>
            <TextInput
              id={fieldId("curator")}
              value={values.curator}
              onChange={(changeEvent) => update("curator", changeEvent.target.value)}
            />
          </Field>
        </FormRow>
      </FormSection>

      <FormSection title="Программа">
        <ul className={styles["list"]}>
          {values.program.map((item, index) => (
            <li key={index} className={styles["list-row"]}>
              <div className={styles["pair"]}>
                <TextInput
                  value={item.title}
                  placeholder="День 1 / 10:00"
                  aria-label={`Когда, пункт ${index + 1}`}
                  onChange={(changeEvent) =>
                    update(
                      "program",
                      values.program.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, title: changeEvent.target.value } : row,
                      ),
                    )
                  }
                />
                <TextInput
                  value={item.text}
                  placeholder="Что происходит"
                  aria-label={`Что, пункт ${index + 1}`}
                  onChange={(changeEvent) =>
                    update(
                      "program",
                      values.program.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, text: changeEvent.target.value } : row,
                      ),
                    )
                  }
                />
              </div>
              <button
                type="button"
                className={styles["remove"]}
                aria-label={`Удалить пункт ${index + 1}`}
                onClick={() =>
                  update(
                    "program",
                    values.program.filter((_, rowIndex) => rowIndex !== index),
                  )
                }
              >
                <Icon name="trash" size={16} />
              </button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          className={styles["add"]}
          onClick={() => update("program", [...values.program, { title: "", text: "" }])}
        >
          <Icon name="plus" size={16} />
          Добавить пункт
        </Button>
      </FormSection>

      <FormSection title="Что взять с собой">
        <ul className={styles["list"]}>
          {values.equipment.map((item, index) => (
            <li key={index} className={styles["list-row"]}>
              <TextInput
                value={item}
                placeholder="Спальник до 0 °C"
                aria-label={`Снаряжение, пункт ${index + 1}`}
                onChange={(changeEvent) =>
                  update(
                    "equipment",
                    values.equipment.map((row, rowIndex) => (rowIndex === index ? changeEvent.target.value : row)),
                  )
                }
              />
              <button
                type="button"
                className={styles["remove"]}
                aria-label={`Удалить пункт ${index + 1}`}
                onClick={() =>
                  update(
                    "equipment",
                    values.equipment.filter((_, rowIndex) => rowIndex !== index),
                  )
                }
              >
                <Icon name="trash" size={16} />
              </button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          className={styles["add"]}
          onClick={() => update("equipment", [...values.equipment, ""])}
        >
          <Icon name="plus" size={16} />
          Добавить пункт
        </Button>
      </FormSection>

      <FormSection title="Обложка">
        <Field label="Фото для карточки и страницы" htmlFor={fieldId("cover")} required error={errors.cover}>
          <PhotoUploader
            id={fieldId("cover")}
            photos={values.cover}
            max={1}
            author={user.name}
            invalid={Boolean(errors.cover)}
            onChange={(photos) => update("cover", photos)}
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
        {errorCount > 0 && <span className={styles["actions-error"]}>Проверьте поля, отмеченные красным</span>}
        <ButtonLink href={event ? eventHref(event.slug) : KIND_META.events.listHref} variant="ghost">
          Отмена
        </ButtonLink>
        <Button type="submit" disabled={isSaving}>
          <Icon name="check" size={18} />
          {event ? "Сохранить" : "Создать мероприятие"}
        </Button>
      </div>
    </form>
  );
}
