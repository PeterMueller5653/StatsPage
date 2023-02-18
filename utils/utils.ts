export function parseDate(dateString?: string): Date {
  const date = new Date(dateString ?? 0)
  if (date.toString() === 'Invalid Date') {
    return new Date(0)
  }
  return date
}
