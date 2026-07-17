export function sortPosts<T extends { data: { pubDate: Date; draft: boolean } }>(posts: T[]): T[] {
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}
