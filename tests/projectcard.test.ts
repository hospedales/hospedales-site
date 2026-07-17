import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import ProjectCard from '../src/components/ProjectCard.astro'

describe('ProjectCard', () => {
  it('renders title, status badge, and stack', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(ProjectCard, {
      props: {
        href: '/projects/spark-writing-pipeline',
        title: 'The Spark writing pipeline',
        summary: 'A local LLM that writes blog posts via pull request.',
        status: 'active',
        stack: ['DGX Spark', 'GitHub Actions'],
      },
    })
    expect(html).toContain('The Spark writing pipeline')
    expect(html).toContain('Active')
    expect(html).toContain('DGX Spark')
  })
})
