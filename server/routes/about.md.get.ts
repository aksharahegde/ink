import { pageMeta } from '#llm-page-meta.json'
import { aboutParagraphs, aboutTwitterUrl } from '#shared/about-content'

export default defineEventHandler((event) => {
  if (import.meta.test) {
    return mdResponse('')
  }

  const base = siteBase(event)

  const md = [
    mdFrontmatter(base, '/about', pageMeta['/about']!),
    '',
    ...aboutParagraphs,
    '',
    `[Twitter](${aboutTwitterUrl})`,
    '',
  ].join('\n')

  return mdResponse(md)
})
