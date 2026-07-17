import { siteConfig } from './site'

export function personJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    jobTitle: 'Software Engineer',
    email: `mailto:${siteConfig.email}`,
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.x],
  }
}

interface ArticleInput {
  title: string
  description: string
  url: string
  pubDate: Date
  updatedDate?: Date
  author: { name: string; isAI: boolean }
}

export function articleJsonLd({
  title,
  description,
  url,
  pubDate,
  updatedDate,
  author,
}: ArticleInput): object {
  // schema.org has no AI-author type; Organization (a system, not a person) is the honest
  // fit, paired with an explicit human editor — per spec §3/§8.
  const authorLd = author.isAI
    ? { '@type': 'Organization', name: `${author.name} (AI writing system)` }
    : { '@type': 'Person', name: author.name }
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: pubDate.toISOString(),
    ...(updatedDate && { dateModified: updatedDate.toISOString() }),
    author: authorLd,
    ...(author.isAI && { editor: { '@type': 'Person', name: siteConfig.author } }),
  }
}
