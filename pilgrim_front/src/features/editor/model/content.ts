import { useSyncExternalStore } from "react";

import { idb } from "../lib/idb";

import type { Album, Event, Post } from "@/shared/api/types";

export type ContentKind = "events" | "posts" | "albums";

type ContentByKind = {
  events: Event;
  posts: Post;
  albums: Album;
};

type DemoRecord = {
  key: string;
  kind: ContentKind;
  slug: string;
  data: Event | Post | Album | null;
  updatedAt: number;
};

let records = new Map<string, DemoRecord>();
let ready = false;
let version = 0;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

function ensureLoaded(): void {
  if (loading || typeof indexedDB === "undefined") {
    return;
  }

  loading = idb
    .getAll<DemoRecord>()
    .then((stored) => {
      records = new Map(stored.map((record) => [record.key, record]));
    })
    .catch(() => {
      records = new Map();
    })
    .finally(() => {
      ready = true;
      emit();
    });
}

function subscribe(listener: () => void): () => void {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDemoContent(): { version: number; ready: boolean } {
  const current = useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  return { version: current, ready: current > 0 && ready };
}

async function persist(record: DemoRecord): Promise<void> {
  records.set(record.key, record);
  emit();
  await idb.put(record);
}

export function saveItem<Kind extends ContentKind>(kind: Kind, item: ContentByKind[Kind]): Promise<void> {
  return persist({ key: `${kind}:${item.slug}`, kind, slug: item.slug, data: item, updatedAt: Date.now() });
}

export function deleteItem(kind: ContentKind, slug: string): Promise<void> {
  return persist({ key: `${kind}:${slug}`, kind, slug, data: null, updatedAt: Date.now() });
}

export async function resetDemoContent(): Promise<void> {
  records = new Map();
  emit();
  await idb.clear();
}

export function isLocallyChanged(kind: ContentKind, slug: string): boolean {
  return records.has(`${kind}:${slug}`);
}

export function isDeleted(kind: ContentKind, slug: string): boolean {
  return records.get(`${kind}:${slug}`)?.data === null;
}

export function mergeItems<Kind extends ContentKind>(
  kind: Kind,
  base: readonly ContentByKind[Kind][],
  includeDrafts = false,
): ContentByKind[Kind][] {
  const bySlug = new Map(base.map((item) => [item.slug, item]));

  for (const record of records.values()) {
    if (record.kind !== kind) {
      continue;
    }

    if (record.data) {
      bySlug.set(record.slug, record.data as ContentByKind[Kind]);
    } else {
      bySlug.delete(record.slug);
    }
  }

  return [...bySlug.values()].filter((item) => includeDrafts || item.publication !== "draft");
}

export function useMergedEvents(base: readonly Event[], includeDrafts = false): Event[] {
  useDemoContent();
  return mergeItems("events", base, includeDrafts);
}

export function useMergedPosts(base: readonly Post[], includeDrafts = false): Post[] {
  useDemoContent();
  return mergeItems("posts", base, includeDrafts).sort((first, second) =>
    second.publishedAt.localeCompare(first.publishedAt),
  );
}

export function useMergedAlbums(base: readonly Album[], includeDrafts = false): Album[] {
  useDemoContent();
  return mergeItems("albums", base, includeDrafts).sort((first, second) => second.date.localeCompare(first.date));
}
