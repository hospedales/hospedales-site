# Agent guidance — hospedales-site

- Static Astro site; TypeScript strict; Tailwind v4 tokens defined in `src/styles/global.css`.
- Use semantic tokens (`paper`, `ink*`, `koi-*`, `spark-*`) — never raw palette colors, never `dark:` classes.
- Components take plain data props and never import `astro:content`; pages/layouts do all fetching.
- Author display names come from `src/content/authors.json` — never hardcode them in code.
- Blog frontmatter contract is enforced by `src/lib/schemas.ts` (`author: 'michael' | 'spark'`); AI posts must use `author: 'spark'`.
- Commits: `<type>(<scope>): <subject>`.
- Before committing: `npm run format && npm run test && npm run check && npm run lint && npm run build`.
- Do not run `npm run dev`/`preview` on port 4321 — it is occupied by an unrelated app on this machine; e2e uses port 4399.
