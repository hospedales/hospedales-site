import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import PostCard from '../src/components/PostCard.astro'

describe('PostCard', () => {
  it('links to the post and shows byline', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(PostCard, {
      props: {
        href: '/blog/a-new-coat-of-paint',
        title: 'A new coat of paint',
        description: 'Rebuilt the site.',
        date: new Date('2026-07-17'),
        author: { name: 'Michael Hospedales', isAI: false },
      },
    })
    expect(html).toContain('href="/blog/a-new-coat-of-paint"')
    expect(html).toContain('A new coat of paint')
    expect(html).toContain('Michael Hospedales')
  })
})
