import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const OLD_BLOG = '/media/michael/DGX Data1/hospedales-website/content/blog'
const NEW_BLOG = fileURLToPath(new URL('../src/content/blog', import.meta.url))

/** slug → { newSlug?, newTitle? } */
const KEEP = {
  'system-design-for-juniors': {},
  'startup-tech-stack-guide': {},
  'react-performance-checklist': {},
  'code-review-checklist': {},
  'aws-cost-optimization': {},
  'full-stack-app-with-ai': {},
  'ai-wont-replace-junior-developers': {},
  'ai-developer-productivity-reality-2025': {},
  'developer-visibility-building-in-public': {},
  'i-am-learning-rust': {},
  'web-technologies-2025-when-web-wins': {
    newSlug: 'when-the-web-wins',
    newTitle: 'When the Web Wins: The Case for Betting on the Browser',
  },
}

for (const [slug, { newSlug, newTitle }] of Object.entries(KEEP)) {
  const raw = readFileSync(join(OLD_BLOG, `${slug}.mdx`), 'utf8')
  const { data, content } = matter(raw)
  const fm = [
    '---',
    `title: ${JSON.stringify(newTitle ?? data.title)}`,
    `description: ${JSON.stringify(data.description)}`,
    `pubDate: ${data.date}`,
    `author: 'michael'`,
    ...(Array.isArray(data.tags) && data.tags.length
      ? [`tags: [${data.tags.map((t) => JSON.stringify(t)).join(', ')}]`]
      : []),
    '---',
    '',
  ].join('\n')
  writeFileSync(join(NEW_BLOG, `${newSlug ?? slug}.mdx`), fm + content.trimStart())
  console.log(`migrated: ${slug}${newSlug ? ` → ${newSlug}` : ''}`)
}
