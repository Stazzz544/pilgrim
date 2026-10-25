import { ALBUMS } from "@/mocks/albums";
import { CATEGORIES } from "@/mocks/categories";
import { POSTS } from "@/mocks/posts";
import { VK_POSTS } from "@/mocks/vk-posts";

import { toPage } from "./paginate";

import type { Album, Category, CategorySlug, Paginated, Post, VkPost } from "./types";

export async function getCategories(): Promise<Category[]> {
  return Object.values(CATEGORIES);
}

export async function getPosts(): Promise<Paginated<Post>> {
  return toPage([...POSTS].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt)));
}

export async function getPost(slug: string): Promise<Post | null> {
  return POSTS.find((post) => post.slug === slug) ?? null;
}

export async function getAlbums(category?: CategorySlug): Promise<Paginated<Album>> {
  const albums = ALBUMS.filter((album) => !category || album.category.slug === category);
  return toPage(albums.sort((first, second) => second.date.localeCompare(first.date)));
}

export async function getAlbum(slug: string): Promise<Album | null> {
  return ALBUMS.find((album) => album.slug === slug) ?? null;
}

export async function getVkPosts(): Promise<VkPost[]> {
  return VK_POSTS;
}
