import { pageMeta } from '#llm-page-meta.json'
import { llmSummaries } from '#llm-summaries.json'
import { llmHome } from '#llm-home.json'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return mdResponse('')
  }

  const base = siteBase(event)
  const config = useRuntimeConfig(event)
  const ownerName = config.public.ownerName ?? 'Akshara Hegde'

  const recentStories = llmSummaries.slice(0, 5)
  const quote = llmHome.quote ?? 'Some stories stay with you long after the last word.'

  const lines = [
    mdFrontmatter(base, '/', pageMeta['/']!),
    '',
    llmHome.description
      ?? `Love. Loss. Memory. Mystery. A collection of emotional narrative stories by ${ownerName}.`,
    '',
    `> ${quote}`,
    '',
    `[More about ${ownerName}](${base}/about.md)`,
    '',
  ]

  if (recentStories.length) {
    lines.push('## Recent Stories')
    lines.push('')
    for (const story of recentStories) {
      const category = story.category ? ` — ${story.category}` : ''
      lines.push(`- [${story.title}](${base}/stories/${story.slug}.md)${category}`)
    }
    lines.push('')
    lines.push(`[All stories](${base}/stories.md)`)
    lines.push('')
  }

  return mdResponse(lines.join('\n'))
})
