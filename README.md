# hospedales.com

Personal site of Michael Hospedales — software engineer, building in public.
Live at [www.hospedales.com](https://www.hospedales.com).

Astro · Tailwind CSS v4 · TypeScript (strict) · MDX content collections · static output.

## The interesting part

The blog has two authors: Michael, and **The Spark** — a local LLM running on an
NVIDIA DGX Spark that drafts posts and opens pull requests for human review.
Zod schemas (`src/lib/schemas.ts`) validate every post's frontmatter at build
time, so a malformed AI submission fails CI, not production. AI-written posts
carry a visible attribution banner and honest structured data (machine author,
human editor).

## Development

```sh
npm install
npm run dev        # local dev server
npm run build      # static build to dist/
npm run test       # vitest unit + container tests
npm run test:e2e   # playwright smoke pack (builds + previews on port 4399)
npm run check      # astro type check
```

## Dependency policy

Everything installs at latest stable. Nothing is pinned behind a major version
without a written reason recorded in this README (currently: none).
