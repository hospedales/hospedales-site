import { describe, expect, it } from 'vitest'
import { toRssItems } from '../src/lib/rss'

describe('toRssItems', () => {
  it('maps posts to rss items with author label', () => {
    const items = toRssItems([
      {
        id: 'hello-from-the-spark',
        data: {
          title: 'Hello',
          description: 'Intro',
          pubDate: new Date('2026-07-17'),
          author: 'spark' as const,
          draft: false,
        },
      },
    ])
    expect(items[0].link).toBe('/blog/hello-from-the-spark')
    expect(items[0].title).toBe('Hello')
    expect(items[0].description).toContain('[AI-written, human-reviewed]')
  })
})
