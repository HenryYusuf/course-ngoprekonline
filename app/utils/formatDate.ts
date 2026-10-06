const formatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })

export function formatDate(date: Date | string): string {
  return formatter.format(new Date(date))
}
