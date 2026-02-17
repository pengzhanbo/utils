/**
 * Check if two dates is same day
 *
 * 检查两个日期是否是同一天
 *
 * @category Date
 *
 * @param date1 - The first date to compare. 第一个要比较的日期
 * @param date2 - The second date to compare. 第二个要比较的日期
 * @returns True if both dates are on the same day, false otherwise. 如果两个日期在同一天则返回true，否则返回false
 */
export function isSameDay(date1: Date | number | string, date2?: Date | number | string): boolean {
  if (!date2) return false

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
