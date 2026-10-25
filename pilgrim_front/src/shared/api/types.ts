export type CategorySlug = "international" | "russia" | "city" | "festivals" | "sport" | "outdoor";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export type PhotoCredit = {
  author: string;
  license: string;
  sourceUrl: string;
};

export type Photo = {
  id: string;
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
  alt: string;
  credit: PhotoCredit;
};

export type EventProgramItem = {
  title: string;
  text: string;
};

export type Event = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  location: string;
  region: string;
  meetingPoint: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  cover: Photo;
  albumSlug: string | null;
  curator: string;
  price: string;
  groupSize: string;
  program: EventProgramItem[];
  equipment: string[];
  vkUrl: string;
};

export type EventStatus = "upcoming" | "ongoing" | "past";

export type EventsScope = "upcoming" | "archive";

export type EventsOrdering = "start_date" | "-start_date";

export type EventsQuery = {
  scope?: EventsScope;
  today?: string;
  search?: string;
  categories?: CategorySlug[];
  difficulty?: Difficulty | null;
  ordering?: EventsOrdering;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  images: Photo[];
  tags: string[];
  eventSlug: string | null;
};

export type Album = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  eventSlug: string | null;
  cover: Photo;
  photos: Photo[];
};

export type VkPost = {
  id: number;
  text: string;
  publishedAt: string;
  image: Photo | null;
  likes: number;
  url: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
