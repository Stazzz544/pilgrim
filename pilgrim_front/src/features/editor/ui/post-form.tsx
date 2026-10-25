"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { postHref } from "@/shared/api/routes";
import { formatDate, toDateKey } from "@/shared/lib/date";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Field, FormSection, RadioGroup, SelectInput, TextArea, TextInput } from "@/shared/ui/form/form";
import { Icon } from "@/shared/ui/icon/icon";
import { TagList } from "@/shared/ui/tag/tag";

import { focusFirstError, PUBLICATION_OPTIONS, splitParagraphs, splitTags } from "../lib/form-utils";
import { KIND_META } from "../lib/kinds";
import { createId, createSlug } from "../lib/slug";
import { saveItem, useDemoContent, useMergedEvents, useMergedPosts } from "../model/content";
import { EditorFrame } from "./editor-frame";
import { PhotoUploader } from "./photo-uploader";

import type { DemoUser } from "../model/session";
import type { Event, Photo, Post, Publication } from "@/shared/api/types";
import type { FormEvent, JSX } from "react";

import styles from "./editor-form.module.css";

const MAX_PHOTOS = 10;
const EXCERPT_LENGTH = 180;
const NO_EVENT = "none";

type PostValues = {
  title: string;
  body: string;
  excerpt: string;
  tags: string;
  eventSlug: string;
  images: Photo[];
  publication: Publication;
};

type PostErrors = Partial<Record<keyof PostValues, string>>;

function toValues(post: Post | null): PostValues {
  return {
    title: post?.title ?? "",
    body: post?.body.join("\n\n") ?? "",
    excerpt: post?.excerpt ?? "",
    tags: post?.tags.join(", ") ?? "",
    eventSlug: post?.eventSlug ?? NO_EVENT,
    images: post?.images ?? [],
    publication: post?.publication ?? "published",
  };
}

function validate(values: PostValues): PostErrors {
  const errors: PostErrors = {};

  if (values.title.trim().length < 3) {
    errors.title = "Заголовок — минимум 3 символа";
  }

  if (values.body.trim().length < 10) {
    errors.body = "Напишите хотя бы пару предложений";
  }

  return errors;
}

function makeExcerpt(paragraphs: string[]): string {
  const [first = ""] = paragraphs;
  return first.length > EXCERPT_LENGTH ? `${first.slice(0, EXCERPT_LENGTH).trimEnd()}…` : first;
}

type PostEditorProps = {
  basePosts: Post[];
  baseEvents: Event[];
};

export function PostEditor({ basePosts, baseEvents }: PostEditorProps): JSX.Element {
  const slug = useSearchParams().get("slug");
  const posts = useMergedPosts(basePosts, true);
  const events = useMergedEvents(baseEvents);
  const { ready } = useDemoContent();

  return (
    <EditorFrame kind="posts" slug={slug} items={posts} ready={ready}>
      {(post, user) => <PostForm key={post?.slug ?? "new"} post={post} user={user} events={events} />}
    </EditorFrame>
  );
}

type PostFormProps = {
  post: Post | null;
  user: DemoUser;
  events: Event[];
};

function PostForm({ post, user, events }: PostFormProps): JSX.Element {
  const router = useRouter();
  const formId = useId();
  const [values, setValues] = useState(() => toValues(post));
  const [errors, setErrors] = useState<PostErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const fieldId = (name: string): string => `${formId}-${name}`;
  const eventOptions = [
    { value: NO_EVENT, label: "Без привязки" },
    ...[...events]
      .sort((first, second) => second.startDate.localeCompare(first.startDate))
      .map((event) => ({ value: event.slug, label: `${event.title} · ${formatDate(event.startDate)}` })),
  ];

  const update = <Key extends keyof PostValues>(key: Key, value: PostValues[Key]): void => {
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
    const body = splitParagraphs(values.body);
    const saved: Post = {
      id: post?.id ?? createId(),
      slug: post?.slug ?? createSlug(values.title),
      title: values.title.trim(),
      excerpt: values.excerpt.trim() || makeExcerpt(body),
      body,
      publishedAt: post?.publishedAt ?? toDateKey(new Date()),
      images: values.images,
      tags: splitTags(values.tags),
      eventSlug: values.eventSlug === NO_EVENT ? null : values.eventSlug,
      authorId: post?.authorId ?? user.id,
      publication: values.publication,
    };

    await saveItem("posts", saved);
    router.push(postHref(saved.slug));
  };

  return (
    <form className={styles["form"]} onSubmit={handleSubmit} noValidate>
      <FormSection title="Текст">
        <Field label="Заголовок" htmlFor={fieldId("title")} required error={errors.title}>
          <TextInput
            id={fieldId("title")}
            value={values.title}
            maxLength={140}
            invalid={Boolean(errors.title)}
            placeholder="Как мы дошли до Ладоги"
            onChange={(changeEvent) => update("title", changeEvent.target.value)}
          />
        </Field>
        <Field
          label="Текст поста"
          htmlFor={fieldId("body")}
          required
          error={errors.body}
          hint="Пустая строка между абзацами. Первый абзац виден в ленте"
        >
          <TextArea
            id={fieldId("body")}
            value={values.body}
            rows={8}
            invalid={Boolean(errors.body)}
            onChange={(changeEvent) => update("body", changeEvent.target.value)}
          />
        </Field>
        <Field
          label="Анонс для карточек"
          htmlFor={fieldId("excerpt")}
          hint="Если оставить пустым, возьмём начало первого абзаца"
        >
          <TextInput
            id={fieldId("excerpt")}
            value={values.excerpt}
            maxLength={200}
            onChange={(changeEvent) => update("excerpt", changeEvent.target.value)}
          />
        </Field>
        <Field label="Теги" htmlFor={fieldId("tags")} hint="Через запятую, до 8 штук">
          <TextInput
            id={fieldId("tags")}
            value={values.tags}
            placeholder="Ладога, Поход"
            onChange={(changeEvent) => update("tags", changeEvent.target.value)}
          />
          {splitTags(values.tags).length > 0 && <TagList tags={splitTags(values.tags)} className={styles["tags"]} />}
        </Field>
        <Field label="Связанное мероприятие" htmlFor={fieldId("eventSlug")}>
          <SelectInput
            id={fieldId("eventSlug")}
            value={values.eventSlug}
            options={eventOptions}
            onChange={(value) => update("eventSlug", value)}
          />
        </Field>
      </FormSection>

      <FormSection title="Фотографии">
        <PhotoUploader
          id={fieldId("images")}
          photos={values.images}
          max={MAX_PHOTOS}
          author={user.name}
          onChange={(photos) => update("images", photos)}
        />
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
        <ButtonLink href={post ? postHref(post.slug) : KIND_META.posts.listHref} variant="ghost">
          Отмена
        </ButtonLink>
        <Button type="submit" disabled={isSaving}>
          <Icon name="check" size={18} />
          {post ? "Сохранить" : "Опубликовать пост"}
        </Button>
      </div>
    </form>
  );
}
