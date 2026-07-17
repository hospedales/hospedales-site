import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import SiteHeader from '../src/components/SiteHeader.astro'
import SiteFooter from '../src/components/SiteFooter.astro'
import KoiMark from '../src/components/KoiMark.astro'

describe('SiteHeader', () => {
  it('renders all nav links', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(SiteHeader, { props: { currentPath: '/blog' } })
    for (const href of ['/about', '/projects', '/blog', '/contact']) {
      expect(html).toContain(`href="${href}"`)
    }
  })
})

describe('SiteFooter', () => {
  it('renders social + email links', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(SiteFooter)
    expect(html).toContain('https://github.com/hospedales')
    expect(html).toContain('mailto:mick@hospedales.com')
    expect(html).toContain('/rss.xml')
  })
})

describe('KoiMark', () => {
  it('is decorative svg', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(KoiMark)
    expect(html).toContain('<svg')
    expect(html).toContain('aria-hidden="true"')
  })
})
