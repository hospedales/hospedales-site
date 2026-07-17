import { describe, expect, it } from 'vitest'
import { sortPosts } from '../src/lib/posts'

const make = (id: string, pubDate: string, draft = false) => ({
  id,
  data: { pubDate: new Date(pubDate), draft },
})

describe('sortPosts', () => {
  it('sorts newest first and drops drafts', () => {
    const sorted = sortPosts([
      make('old', '2024-01-01'),
      make('draft', '2027-01-01', true),
      make('new', '2026-07-17'),
    ])
    expect(sorted.map((p) => p.id)).toEqual(['new', 'old'])
  })
})
