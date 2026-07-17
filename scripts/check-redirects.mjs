import { readFileSync } from 'node:fs'

const base = process.argv[2]
if (!base) {
  console.error('usage: node scripts/check-redirects.mjs <base-url>')
  process.exit(2)
}
const rules = JSON.parse(
  readFileSync(new URL('../infra/amplify-redirects.json', import.meta.url), 'utf8'),
)
let failures = 0
for (const rule of rules) {
  if (rule.source.includes('<*>')) continue
  const res = await fetch(new URL(rule.source, base), { redirect: 'manual' })
  const location = res.headers.get('location') ?? ''
  const ok = String(res.status) === rule.status && location.endsWith(rule.target)
  console.log(`${ok ? 'PASS' : 'FAIL'} ${rule.source} → ${res.status} ${location}`)
  if (!ok) failures++
}
for (const path of ['/', '/about', '/projects', '/blog', '/contact', '/rss.xml']) {
  const res = await fetch(new URL(path, base))
  const ok = res.status === 200
  console.log(`${ok ? 'PASS' : 'FAIL'} ${path} → ${res.status}`)
  if (!ok) failures++
}
console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
