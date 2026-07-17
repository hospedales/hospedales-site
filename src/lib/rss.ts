interface RssSourcePost {
  id: string
  data: {
    title: string
    description: string
    pubDate: Date
    author: 'michael' | 'spark'
    draft: boolean
  }
}

export function toRssItems(posts: RssSourcePost[]) {
  return posts
    .filter((p) => !p.data.draft)
    .map((p) => ({
      title: p.data.title,
      description:
        p.data.author === 'spark'
          ? `[AI-written, human-reviewed] ${p.data.description}`
          : p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}`,
    }))
}
