export function getSubjectsDisplay(subjects: string[]): string {
  if (!subjects || subjects.length === 0) return ''
  if (subjects.length === 1) return subjects[0]
  return 'Multi-branches'
}