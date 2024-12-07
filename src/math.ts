/**
 * Math Helpers
 *
 * @module Math
 */

/**
 * Clamp a number between min and max
 *
 * 返回一个介于最小值和最大值之间的数字
 *
 * @category Math
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(n, min))
}

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

/**
 * Random number
 *
 * 返回一个介于 0 和 max 之间的随机数
 *
 * @category Math
 *
 * @param max - the maximum number. 最大值
 * @param float - (optional) if `true`, returns a floating-point number. 是否返回浮点数
 *
 * @example
 * ```ts
 * random(5) // => an integer between 0 and 5
 * random(5, true) // => a floating-point number between 0 and 5
 * ```
 */
export function random(max: number, float?: boolean): number
/**
 * Random number between min and max
 *
 * 返回一个介于 min 和 max 之间的随机数
 *
 * @category Math
 *
 * @param min - the minimum number. 最小值
 * @param max - the maximum number. 最大值
 * @param float - (optional) if `true`, returns a floating-point number. 是否返回浮点数
 *
 * @example
 * ```ts
 * random(1, 5) // => an integer between 1 and 5
 * random(1, 5, true) // => a floating-point number between 1 and 5
 * ```
 */
export function random(min: number, max: number, float?: boolean): number
export function random(...args: any[]): number {
  let min, max, float
  if (args.length === 1) {
    min = 0
    max = args[0]
    float = false
  }
  else {
    if (typeof args[1] === 'number') {
      min = args[0]
      max = args[1]
      float = !!args[2]
    }
    else {
      min = 0
      max = args[0]
      float = !!args[1]
    }
  }
  const num = Math.random() * (max - min) + min
  return float ? num : Math.floor(num)
}
