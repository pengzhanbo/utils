/**
 * Recommended time library:
 *
 * - [dayjs](https://day.js.org/)
 * - [date-fns](https://date-fns.org)
 *
 * @module
 */

/**
 * Get current timestamp
 * @category Time
 */
export function timestamp(): number {
  return +Date.now()
}

/**
 * Check if two dates is same day
 * @category Time
 */
export function isSameDay(date1: Date | number | string, date2?: Date | number | string): boolean {
  if (!date2)
    return false

  const v1 = new Date(date1)
  const v2 = new Date(date2)

  const y1 = v1.getFullYear()
  const m1 = v1.getMonth()
  const d1 = v1.getDate()
  const y2 = v2.getFullYear()
  const m2 = v2.getMonth()
  const d2 = v2.getDate()

  return y1 === y2 && m1 === m2 && d1 === d2
}
