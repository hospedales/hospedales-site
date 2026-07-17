import { z } from 'astro/zod'

export const authorSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  isAI: z.boolean().default(false),
  model: z.string().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(300),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.enum(['michael', 'spark']),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
})

export const projectSchema = z.object({
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(300),
  status: z.enum(['active', 'shipped', 'archived']),
  stack: z.array(z.string()).default([]),
  links: z
    .object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      post: z.string().optional(),
    })
    .default({}),
  featured: z.boolean().default(false),
  order: z.number().int().default(99),
})

export type AuthorData = z.infer<typeof authorSchema>
export type BlogData = z.infer<typeof blogSchema>
export type ProjectData = z.infer<typeof projectSchema>
