export type PageMeta = {
  title: string
  description?: string
  /** Short label used in llms.txt page index. Pages without this are excluded. */
  llmLabel?: string
}

export const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Ink',
    description: 'Love. Loss. Memory. Mystery. A collection of emotional narrative stories by Akshara Hegde.',
    llmLabel: 'Home — story collection',
  },
  '/about': {
    title: 'About',
    description: 'About Akshara Hegde — software developer, musician, and storyteller behind Ink.',
    llmLabel: 'About the author',
  },
  '/stories': {
    title: 'Stories',
    description: 'A collection of narrative stories by Akshara Hegde.',
    llmLabel: 'All stories index',
  },
}
