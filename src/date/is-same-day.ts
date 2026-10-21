import { isDate, isNil, isNull } from '../predicate/index.js'

/**
 * Check if two dates fall on the same calendar day in the **local time zone** (time components are ignored).
 *
 * 检查两个日期是否在**本地时区**的同一天（忽略时间部分）。
 *
 * @category Date
 *
 * @param date1 - The first date to compare. 第一个要比较的日期
 * @param date2 - The second date to compare. 第二个要比较的日期
 *
 * @returns True if both dates are on the same local calendar day, false otherwise. 如果两个日期在本地时区的同一天则返回 true，否则返回 false
 *
 * @remarks
 * The comparison is based on the local calendar day (`Date.prototype.toDateString`), not on the UTC day:
 * the question this function answers is "are these two instants the same day *for the user*?".
 * The time zone therefore changes the result — `2024-01-14T16:00:00Z` and `2024-01-15T15:59:00Z`
 * are the same day in UTC+8 but different days in UTC.
 *
 * String inputs are converted with `new Date(value)`, which parses a date-only string such as
 * `'2024-01-15'` as **UTC midnight**; in time zones west of UTC that instant belongs to the
 * previous local day. Pass a `Date` object or a timestamp when the local calendar day matters.
 *
 * 比较基于本地日历日（`Date.prototype.toDateString`），而非 UTC 日：本函数要回答的是"这两个时刻
 * 对用户而言是不是同一天"，因此结果随时区变化——`2024-01-14T16:00:00Z` 与 `2024-01-15T15:59:00Z`
 * 在 UTC+8 属于同一天，在 UTC 则不是。
 *
 * 字符串入参通过 `new Date(value)` 解析，`'2024-01-15'` 这类纯日期字符串会被当作 **UTC 午夜**，
 * 在 UTC 以西的时区会落到前一个本地日。若关心本地日历日，请传入 `Date` 对象或时间戳。
 *
 * @example
 * ```ts
 * // Date / 日期对象
 * isSameDay(new Date(2024, 0, 15, 10, 30), new Date(2024, 0, 15, 23, 59)) // => true
 * isSameDay(new Date(2024, 0, 15), new Date(2024, 0, 16)) // => false
 *
 * // number - timestamp in milliseconds / 毫秒时间戳
 * const noon = new Date(2024, 0, 15, 12).getTime()
 * isSameDay(noon, noon + 60 * 60 * 1000) // => true
 * isSameDay(noon, noon + 24 * 60 * 60 * 1000) // => false
 *
 * // string - ISO 8601 / ISO 字符串
 * // date-only strings parse as UTC midnight, see above / 纯日期字符串按 UTC 午夜解析，见 @remarks
 * isSameDay('2024-01-15', '2024-01-15T00:00:00Z') // => true
 * isSameDay('2024-01-15', '2024-01-16') // => false
 * ```
 */
export function isSameDay(date1: Date | number | string, date2?: Date | number | string): boolean {
  if (isNil(date2)) {
    return false
  }

  const s1 = toLocalDayKey(date1)
  return !isNull(s1) && s1 === toLocalDayKey(date2)
}

/**
 * Build a comparable key for the **local** calendar day of a date-like value.
 *
 * 生成本地日历日的可比较 key。
 *
 * @param value - The date-like value. 日期类值
 *
 * @returns The local day key, or `null` when the value is not a valid date. 本地日 key，无效日期返回 `null`
 *
 * @internal
 */
function toLocalDayKey(value: Date | number | string): string | null {
  const date = isDate(value) ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  // `toDateString()` renders the local calendar day (e.g. `"Mon Jan 15 2024"`),
  // which is exactly the key we need — no locale dependency, no manual padding.
  // `toDateString()` 输出的即本地日历日（如 `"Mon Jan 15 2024"`），无需手工补零，也与 locale 无关。
  return date.toDateString()
}
