/**
 *
 * @category Time
 */
export const timestamp = () => +Date.now()

/**
 * is same day
 * @category Time
 */
export function isSameDay(v1: Date, v2?: Date): boolean {
  v2 ||= new Date()
  const y1 = v1.getFullYear()
  const m1 = v1.getMonth()
  const d1 = v1.getDate()
  const y2 = v2.getFullYear()
  const m2 = v2.getMonth()
  const d2 = v2.getDate()

  return y1 === y2 && m1 === m2 && d1 === d2
}
