/**
 * Compare two values
 *
 * 比较两个值的大小
 */
export function compareValues(a: any, b: any, order: 'asc' | 'desc'): 0 | -1 | 1 {
  if (a < b) return order === 'asc' ? -1 : 1

  if (a > b) return order === 'asc' ? 1 : -1

  return 0
}
