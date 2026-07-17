import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'

const blog = await getCollection('blog')
const projects = await getCollection('projects')

const pages: Record<string, { title: string; description: string }> = {
  'page/home': {
    title: 'Michael Hospedales',
    description: 'Software Engineer — building in public',
  },
  'page/about': { title: 'About', description: 'Front-end engineer with full-stack range' },
  'page/blog': { title: 'Writing', description: 'Two bylines: mine, and my machine’s' },
  'page/projects': { title: 'Projects', description: 'Proof of work' },
  'page/contact': { title: 'Say hello', description: 'Founding-engineer conversations welcome' },
}
for (const post of blog) {
  pages[`blog/${post.id}`] = { title: post.data.title, description: post.data.description }
}
for (const project of projects) {
  pages[`projects/${project.id}`] = {
    title: project.data.title,
    description: project.data.summary,
  }
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  // The `.png` suffix is already part of this route file's name
  // (`[...route].png.ts`), so the generated slug must be the bare
  // path — otherwise astro-og-canvas's default slug generator (which
  // itself appends `.png`) would double the extension.
  getSlug: (path) => path,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [250, 247, 242],
      [251, 231, 236],
    ],
    font: {
      title: { color: [18, 18, 24], size: 64, weight: 'Bold' },
      description: { color: [82, 82, 94], size: 32 },
    },
    padding: 80,
  }),
})
