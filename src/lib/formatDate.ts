const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

export function formatDate(d: Date): string {
  return formatter.format(d)
}
