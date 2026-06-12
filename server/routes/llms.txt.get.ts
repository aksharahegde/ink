import { pageMeta } from '#llm-page-meta.json'
import { llmSummaries } from '#llm-summaries.json'
import { llmHome } from '#llm-home.json'
import { aboutTwitterUrl } from '#shared/about-content'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return txtResponse('')
  }

  const base = siteBase(event)
  const config = useRuntimeConfig(event)
  const ownerName = config.public.ownerName ?? 'Akshara Hegde'
  const siteName = config.public.siteName ?? 'Ink'

  const pageIndex = Object.entries(pageMeta)
    .filter(([, meta]) => meta.llmLabel)
    .map(([path, meta]) => {
      const mdPath = path === '/' ? '/index.md' : `${path}.md`
      return `- [${meta.title}](${base}${mdPath}): ${meta.llmLabel}`
    })

  const recentStories = llmSummaries.slice(0, 5)

  const tagline = llmHome.description
    ?? `A collection of short stories from the heart by ${ownerName}.`

  const lines = [
    `# ${siteName} — Stories by ${ownerName}`,
    '',
    `> ${tagline}`,
    '',
    '## About',
    '',
    ...pageIndex,
    '',
    '## Key Links',
    '',
    `- Website: ${base}`,
    `- Twitter: ${aboutTwitterUrl}`,
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
  }

  lines.push('## Optional')
  lines.push('')
  lines.push(`- [Full content](${base}/llms-full.txt): Complete about section and all stories in a single document`)
  lines.push('')

  return txtResponse(lines.join('\n'))
})
