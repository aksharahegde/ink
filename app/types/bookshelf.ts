export type BookshelfStory = {
  title: string;
  description?: string;
  slug?: string;
  cover?: string;
  meta?: {
    slug?: string;
    cover?: string;
    category?: string;
    readingTime?: string;
  };
};
