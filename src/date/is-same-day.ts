import { isDate, isNil, isNull } from '../predicate'

/**
 * Check if two dates are on the same day (ignores time components).
 *
 * 检查两个日期是否在同一天（忽略时间部分）。
 *
 * @category Date
 *
 * @param date1 - The first date to compare. 第一个要比较的日期
 * @param date2 - The second date to compare. 第二个要比较的日期
 *
 * @returns True if both dates are on the same day, false otherwise. 如果两个日期在同一天则返回 true，否则返回 false
 *
 * @example
 * ```ts
 * isSameDay(new Date('2024-01-15'), new Date('2024-01-15T12:00:00')) // => true
 * isSameDay(new Date('2024-01-15'), new Date('2024-01-16')) // => false
 * isSameDay(new Date('2024-01-15'), '2024-01-15') // => true
 * ```
 */
export function isSameDay(date1: Date | number | string, date2?: Date | number | string): boolean {
  if (isNil(date2)) return false

  const s1 = toDateString(date1)
  return !isNull(s1) && s1 === toDateString(date2)
}

function toDateString(value: Date | number | string): string | null {
  const date = isDate(value) ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
}
