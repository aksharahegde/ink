import { llmStories } from '#llm-stories.json'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return mdResponse('')
  }

  const pathname = getRequestURL(event).pathname
  const match = pathname.match(/^\/stories\/(.+)\.md$/)
  const slug = match?.[1]

  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const story = llmStories.find(s => s.slug === slug)

  if (!story) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const base = siteBase(event)
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

  const frontmatterLines = [
    '---',
    `title: "${esc(story.title)}"`,
    `url: ${base}/stories/${story.slug}`,
  ]
  if (story.author) frontmatterLines.push(`author: "${esc(story.author)}"`)
  if (story.description) frontmatterLines.push(`description: "${esc(story.description)}"`)
  if (story.category) frontmatterLines.push(`category: "${esc(story.category)}"`)
  if (story.readingTime) frontmatterLines.push(`readingTime: "${esc(story.readingTime)}"`)
  if (story.date) frontmatterLines.push(`date: ${story.date}`)
  frontmatterLines.push('---')

  const md = [
    ...frontmatterLines,
    '',
    story.body,
    '',
  ].join('\n')

  return mdResponse(md)
})
