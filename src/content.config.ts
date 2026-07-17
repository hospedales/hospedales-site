import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { authorSchema, blogSchema, projectSchema } from './lib/schemas'

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
    schema: blogSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
    schema: projectSchema,
  }),
  authors: defineCollection({
    loader: file('./src/content/authors.json'),
    schema: authorSchema,
  }),
}
