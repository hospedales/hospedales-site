import { describe, expect, it } from 'vitest'
import { articleJsonLd, personJsonLd } from '../src/lib/jsonld'

describe('personJsonLd', () => {
  it('describes Michael with sameAs links', () => {
    const ld = personJsonLd() as Record<string, unknown>
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Michael Hospedales')
    expect(ld.sameAs).toContain('https://github.com/hospedales')
  })
})

describe('articleJsonLd', () => {
  const base = {
    title: 'T',
    description: 'D',
    url: 'https://www.hospedales.com/blog/t',
    pubDate: new Date('2026-07-17'),
  }
  it('human post: Person author, no editor', () => {
    const ld = articleJsonLd({
      ...base,
      author: { name: 'Michael Hospedales', isAI: false },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as Record<string, any>
    expect(ld.author['@type']).toBe('Person')
    expect(ld.editor).toBeUndefined()
  })
  it('AI post: honest non-person author plus human editor', () => {
    const ld = articleJsonLd({ ...base, author: { name: 'The Spark', isAI: true } }) as Record<
      string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >
    expect(ld.author['@type']).toBe('Organization')
    expect(ld.author.name).toContain('The Spark')
    expect(ld.editor['@type']).toBe('Person')
    expect(ld.editor.name).toBe('Michael Hospedales')
  })
})
