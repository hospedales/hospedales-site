import { describe, expect, it } from 'vitest'
import { formatDate } from '../src/lib/formatDate'

describe('formatDate', () => {
  it('formats long en-US dates in UTC', () => {
    expect(formatDate(new Date('2026-07-17'))).toBe('July 17, 2026')
  })
})
