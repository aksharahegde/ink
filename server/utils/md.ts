function yamlEscape (str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function mdFrontmatter (
  siteUrl: string,
  path: string,
  meta: { title: string, description?: string },
): string {
  const lines = ['---']
  lines.push(`title: "${yamlEscape(meta.title)}"`)
  if (meta.description) {
    lines.push(`description: "${yamlEscape(meta.description)}"`)
  }
  lines.push(`url: ${siteUrl}${path}`)
  lines.push('---')
  return lines.join('\n')
}

export function mdResponse (content: string): Response {
  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export function txtResponse (content: string): Response {
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

export function formatDate (dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function siteBase (event?: Parameters<typeof getRequestURL>[0]): string {
  const config = useRuntimeConfig(event)
  return String(config.public.baseURL ?? '').replace(/\/$/, '')
}
