import { pageMeta } from '#llm-page-meta.json'
import { llmSummaries } from '#llm-summaries.json'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return mdResponse('')
  }

  const base = siteBase(event)

  const lines = [
    mdFrontmatter(base, '/stories', pageMeta['/stories']!),
    '',
  ]

  for (const story of llmSummaries) {
    lines.push(`## ${story.title}`)
    lines.push('')
    if (story.author) lines.push(`- **Author:** ${story.author}`)
    if (story.category) lines.push(`- **Category:** ${story.category}`)
    if (story.readingTime) lines.push(`- **Reading time:** ${story.readingTime}`)
    if (story.description) {
      lines.push('')
      lines.push(story.description)
    }
    lines.push('')
    lines.push(`[Read full story](${base}/stories/${story.slug}.md)`)
    lines.push('')
  }

  return mdResponse(lines.join('\n'))
})
