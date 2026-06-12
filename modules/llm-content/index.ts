import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { addServerHandler, addTypeTemplate, createResolver, defineNuxtModule, useNuxt } from 'nuxt/kit'
import { pageMeta } from '../../shared/page-meta'

type FrontmatterRecord = Record<string, string | boolean | number | undefined>

export type LlmStory = {
  slug: string
  title: string
  author?: string
  description?: string
  category?: string
  readingTime?: string
  date?: string
  body: string
}

export type LlmSummary = {
  slug: string
  title: string
  author?: string
  description?: string
  category?: string
  readingTime?: string
  date?: string
  path?: string
  body: string
}

export type LlmHome = {
  title?: string
  description?: string
  quote?: string
}

function parseFrontmatter (content: string): { data: FrontmatterRecord, body: string } {
  if (!content.startsWith('---')) {
    return { data: {}, body: content.trim() }
  }

  const end = content.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, body: content.trim() }
  }

  const raw = content.slice(4, end)
  const body = content.slice(end + 4).replace(/^\n/, '')
  const data: FrontmatterRecord = {}

  for (const line of raw.split('\n')) {
    const match = line.match(/^([\w-]+):\s*(.*)$/)
    if (!match) continue
    const [, key, value] = match
    const trimmed = value.replace(/^["']|["']$/g, '')
    if (trimmed === 'true') data[key] = true
    else if (trimmed === 'false') data[key] = false
    else if (/^\d+$/.test(trimmed)) data[key] = Number(trimmed)
    else data[key] = trimmed
  }

  return { data, body: body.trim() }
}

function readMarkdownDir (dir: string, filter: (name: string) => boolean) {
  return readdirSync(dir)
    .filter(name => name.endsWith('.md') && filter(name))
    .map(name => {
      const filePath = join(dir, name)
      const content = readFileSync(filePath, 'utf8')
      const { data, body } = parseFrontmatter(content)
      const slug = String(data.slug ?? name.replace(/\.md$/, ''))
      return { slug, data, body, filePath }
    })
}

export default defineNuxtModule({
  meta: {
    name: 'llm-content',
  },
  setup () {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)
    const rootDir = nuxt.options.rootDir

    const storiesDir = join(rootDir, 'content/stories')
    const summariesDir = join(rootDir, 'content/stories/summary')
    const homePath = join(rootDir, 'content/index.md')

    const storyFiles = readMarkdownDir(storiesDir, name => name !== 'index.md')
    const summaryFiles = readMarkdownDir(summariesDir, () => true)

    const stories: LlmStory[] = storyFiles.map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? slug),
      author: data.author ? String(data.author) : undefined,
      description: data.description ? String(data.description) : undefined,
      category: data.category ? String(data.category) : undefined,
      readingTime: data.readingTime ? String(data.readingTime) : undefined,
      date: data.date ? String(data.date) : undefined,
      body,
    }))

    const summaries: LlmSummary[] = summaryFiles.map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? slug),
      author: data.author ? String(data.author) : undefined,
      description: data.description ? String(data.description) : undefined,
      category: data.category ? String(data.category) : undefined,
      readingTime: data.readingTime ? String(data.readingTime) : undefined,
      date: data.date ? String(data.date) : undefined,
      path: data.path ? String(data.path) : `/stories/${slug}`,
      body,
    }))

    let home: LlmHome = {}
    try {
      const homeContent = readFileSync(homePath, 'utf8')
      const { data } = parseFrontmatter(homeContent)
      home = {
        title: data.title ? String(data.title) : undefined,
        description: data.description ? String(data.description) : undefined,
        quote: data.quote ? String(data.quote) : undefined,
      }
    } catch {
      // content/index.md optional
    }

    nuxt.options.nitro.virtual ||= {}
    nuxt.options.nitro.virtual['#llm-page-meta.json'] = () =>
      `export const pageMeta = ${JSON.stringify(pageMeta)}`
    nuxt.options.nitro.virtual['#llm-stories.json'] = () =>
      `export const llmStories = ${JSON.stringify(stories)}`
    nuxt.options.nitro.virtual['#llm-summaries.json'] = () =>
      `export const llmSummaries = ${JSON.stringify(summaries)}`
    nuxt.options.nitro.virtual['#llm-home.json'] = () =>
      `export const llmHome = ${JSON.stringify(home)}`

    nuxt.options.nitro.externals ||= {}
    nuxt.options.nitro.externals.inline ||= []
    nuxt.options.nitro.externals.inline.push(
      '#llm-page-meta.json',
      '#llm-stories.json',
      '#llm-summaries.json',
      '#llm-home.json',
    )

    for (const story of stories) {
      addServerHandler({
        route: `/stories/${story.slug}.md`,
        handler: resolver.resolve('./runtime/story-md.get'),
      })
    }

    addTypeTemplate({
      filename: 'types/llm-content.d.ts',
      getContents: () => `
declare module '#llm-page-meta.json' {
  export const pageMeta: Record<string, { title: string, description?: string, llmLabel?: string }>
}

declare module '#llm-stories.json' {
  export const llmStories: Array<{
    slug: string
    title: string
    author?: string
    description?: string
    category?: string
    readingTime?: string
    date?: string
    body: string
  }>
}

declare module '#llm-summaries.json' {
  export const llmSummaries: Array<{
    slug: string
    title: string
    author?: string
    description?: string
    category?: string
    readingTime?: string
    date?: string
    path?: string
    body: string
  }>
}

declare module '#llm-home.json' {
  export const llmHome: {
    title?: string
    description?: string
    quote?: string
  }
}
`,
    })
  },
})
