import { describe, expect, it } from 'vitest'
import { authorSchema, blogSchema, projectSchema } from '../src/lib/schemas'

const validPost = {
  title: 'A post',
  description: 'A description',
  pubDate: '2026-07-17',
  author: 'michael',
}

describe('blogSchema', () => {
  it('accepts a minimal valid post and applies defaults', () => {
    const parsed = blogSchema.parse(validPost)
    expect(parsed.tags).toEqual([])
    expect(parsed.draft).toBe(false)
    expect(parsed.pubDate).toBeInstanceOf(Date)
  })
  it('rejects unknown authors', () => {
    expect(() => blogSchema.parse({ ...validPost, author: 'chatgpt' })).toThrow()
  })
  it('rejects missing description', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { description: _omitted, ...rest } = validPost
    expect(() => blogSchema.parse(rest)).toThrow()
  })
})

describe('projectSchema', () => {
  it('accepts a valid project', () => {
    const parsed = projectSchema.parse({
      title: 'Thing',
      summary: 'Does thing',
      status: 'active',
    })
    expect(parsed.featured).toBe(false)
    expect(parsed.stack).toEqual([])
  })
  it('rejects invalid status', () => {
    expect(() => projectSchema.parse({ title: 'T', summary: 'S', status: 'someday' })).toThrow()
  })
})

describe('authorSchema', () => {
  it('requires model only via optionality (spark provides it)', () => {
    const parsed = authorSchema.parse({
      name: 'The Spark',
      role: 'Resident AI writer',
      bio: 'A local LLM.',
      isAI: true,
      model: 'local model on NVIDIA DGX Spark',
    })
    expect(parsed.isAI).toBe(true)
  })
})
