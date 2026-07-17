import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { toRssItems } from '../lib/rss'
import { sortPosts } from '../lib/posts'
import { siteConfig } from '../lib/site'

export async function GET(context: APIContext) {
  const posts = sortPosts(await getCollection('blog'))
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!,
    items: toRssItems(posts),
  })
}
