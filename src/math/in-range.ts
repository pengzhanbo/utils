/**
 * Check if a number is in range [0, max]
 *
 * 检查一个数字是否在 [0, max] 范围内
 *
 * @category Math
 *
 * @param n - the number
 * @param max - the maximum number
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
 * @param n - the number
 * @param min - the minimum number
 * @param max - the maximum number
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
