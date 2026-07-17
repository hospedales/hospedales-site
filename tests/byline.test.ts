import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import AttributionBanner from '../src/components/AttributionBanner.astro'
import BylineChip from '../src/components/BylineChip.astro'

const michael = { name: 'Michael Hospedales', isAI: false }
const spark = { name: 'The Spark', isAI: true, model: 'local LLM on NVIDIA DGX Spark' }

describe('BylineChip', () => {
  it('renders human chip with koi tone and date', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(BylineChip, {
      props: { author: michael, date: new Date('2026-07-17') },
    })
    expect(html).toContain('Michael Hospedales')
    expect(html).toContain('bg-koi-100')
    expect(html).toContain('datetime="2026-07-17')
  })
  it('renders AI chip with spark tone', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(BylineChip, { props: { author: spark } })
    expect(html).toContain('The Spark')
    expect(html).toContain('bg-spark-100')
  })
})

describe('AttributionBanner', () => {
  it('renders disclosure for AI author', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(AttributionBanner, { props: { author: spark } })
    expect(html).toContain('Written by The Spark')
    expect(html).toContain('local LLM on NVIDIA DGX Spark')
    expect(html).toContain('reviewed and edited by Michael Hospedales')
  })
  it('renders nothing for human author', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(AttributionBanner, { props: { author: michael } })
    expect(html.trim()).toBe('')
  })
})
