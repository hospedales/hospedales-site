import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import ContactForm from '../src/components/ContactForm.astro'

describe('ContactForm', () => {
  it('has honeypot, required fields, and endpoint wiring', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(ContactForm, {
      props: { endpoint: 'https://contact.test/send' },
    })
    expect(html).toContain('data-endpoint="https://contact.test/send"')
    expect(html).toContain('name="website"')
    expect(html).toContain('name="email"')
    expect(html).toMatch(/name="message"[^>]*required/)
  })
})
