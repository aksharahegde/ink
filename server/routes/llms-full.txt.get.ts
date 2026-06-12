import { llmStories } from '#llm-stories.json'
import { llmHome } from '#llm-home.json'
import { aboutParagraphs, aboutTwitterUrl } from '#shared/about-content'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return txtResponse('')
  }

  const base = siteBase(event)
  const config = useRuntimeConfig(event)
  const ownerName = config.public.ownerName ?? 'Akshara Hegde'
  const siteName = config.public.siteName ?? 'Ink'

  const tagline = llmHome.description
    ?? `A collection of short stories from the heart by ${ownerName}.`

  const lines = [
    `# ${siteName} — Stories by ${ownerName}`,
    '',
    `> ${tagline}`,
    '',
    '---',
    '',
    '## About the Author',
    '',
    ...aboutParagraphs,
    '',
    '---',
    '',
  ]

  for (const story of llmStories) {
    lines.push(`## ${story.title}`)
    lines.push('')
    if (story.author) lines.push(`- **Author:** ${story.author}`)
    if (story.category) lines.push(`- **Category:** ${story.category}`)
    if (story.readingTime) lines.push(`- **Reading time:** ${story.readingTime}`)
    if (story.date) lines.push(`- **Date:** ${story.date}`)
    lines.push(`- **URL:** ${base}/stories/${story.slug}.md`)
    if (story.description) {
      lines.push('')
      lines.push(story.description)
    }
    lines.push('')
    lines.push(story.body)
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  lines.push('## Contact')
  lines.push('')
  lines.push(`- Twitter: ${aboutTwitterUrl}`)
  lines.push(`- Website: ${base}`)
  lines.push('')

  return txtResponse(lines.join('\n'))
})
