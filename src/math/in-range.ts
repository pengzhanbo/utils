/**
 * Check if a number is in range [0, max]
 *
 * 检查一个数字是否在 [0, max] 范围内
 *
 * @category Math
 *
 * @param n - The number to check. 要检查的数字
 * @param max - The maximum number. 最大值
 * @returns True if the number is in range, false otherwise. 如果数字在范围内则返回true，否则返回false
 *
 * @example
 * ```ts
 * inRange(5, 10) // => true
 * inRange(10, 5) // => false
 * ```
 */
export function inRange(n: number, max: number): boolean
/**
 * Check if a number is in range [min, max]
 *
 * 检查一个数字是否在 [min, max] 范围内
 *
 * @category Math
 *
 * @param n - The number to check. 要检查的数字
 * @param min - The minimum number. 最小值
 * @param max - The maximum number. 最大值
 * @returns True if the number is in range, false otherwise. 如果数字在范围内则返回true，否则返回false
 *
 * @example
 * ```ts
 * inRange(5, 0, 10) // => true
 * inRange(10, 0, 5) // => false
 * ```
 */
export function inRange(n: number, min: number, max: number): boolean
export function inRange(n: number, min: number, max?: number): boolean {
  if (max === undefined) {
    max = min
    min = 0
  }
  return n >= Math.min(min, max) && n <= Math.max(min, max)
}
